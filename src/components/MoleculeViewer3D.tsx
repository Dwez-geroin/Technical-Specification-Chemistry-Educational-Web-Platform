import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Bookmark, BookmarkCheck, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { ElementData, Molecule3D } from '../types/chemistry';
import { FormulaText } from './FormulaText';

const CPK_COLORS: Record<string, { hex: number; radius: number; label: string; css: string }> = {
  C: { hex: 0x3b4843, radius: 0.44, label: 'Углерод (C)', css: '#3B4843' },
  H: { hex: 0xeef2ef, radius: 0.27, label: 'Водород (H)', css: '#DCE4DE' },
  O: { hex: 0xc26352, radius: 0.4, label: 'Кислород (O)', css: '#C26352' },
  N: { hex: 0x5276a3, radius: 0.42, label: 'Азот (N)', css: '#5276A3' },
  Cl: { hex: 0x5d946e, radius: 0.48, label: 'Хлор (Cl)', css: '#5D946E' },
  S: { hex: 0xc8a44d, radius: 0.5, label: 'Сера (S)', css: '#C8A44D' },
  Na: { hex: 0x7b6ba8, radius: 0.52, label: 'Натрий (Na)', css: '#7B6BA8' },
  Cu: { hex: 0xb57249, radius: 0.54, label: 'Медь (Cu)', css: '#B57249' },
};

let cachedSoftwareGl: boolean | null = null;
function detectSoftwareGl(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    cachedSoftwareGl = true;
  }
  return cachedSoftwareGl;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(46, 59, 54, 0.28)');
  grad.addColorStop(0.55, 'rgba(46, 59, 54, 0.08)');
  grad.addColorStop(1, 'rgba(46, 59, 54, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildMoleculeGroup(molecule: Molecule3D, mode: 'ball-stick' | 'structural'): THREE.Group {
  const group = new THREE.Group();
  const isStructural = mode === 'structural';

  // Center atoms around origin
  const center = new THREE.Vector3();
  for (const a of molecule.atoms) {
    center.x += a.x;
    center.y += a.y;
    center.z += a.z;
  }
  if (molecule.atoms.length > 0) {
    center.divideScalar(molecule.atoms.length);
  }

  const positions = molecule.atoms.map((a) => new THREE.Vector3(a.x - center.x, a.y - center.y, a.z - center.z));

  const sphereGeo = new THREE.SphereGeometry(1, 24, 20);
  const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 14);
  const matCache = new Map<string, THREE.MeshPhysicalMaterial>();

  const getAtomMat = (el: string) => {
    const key = `${el}-${mode}`;
    const existing = matCache.get(key);
    if (existing) return existing;
    const spec = CPK_COLORS[el] || { hex: 0x6e9c8f, radius: 0.42 };
    const mat = new THREE.MeshPhysicalMaterial({
      color: spec.hex,
      roughness: el === 'H' ? 0.35 : 0.24,
      metalness: el === 'Cu' || el === 'Na' ? 0.45 : 0.08,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });
    matCache.set(key, mat);
    return mat;
  };

  const bondMat = new THREE.MeshStandardMaterial({
    color: isStructural ? 0x4b5c55 : 0x9aa9a2,
    roughness: 0.42,
    metalness: 0.12,
  });

  const piBondMat = new THREE.MeshStandardMaterial({
    color: 0x4f8a6e,
    roughness: 0.35,
    metalness: 0.15,
  });

  // Atoms
  molecule.atoms.forEach((atom, i) => {
    const spec = CPK_COLORS[atom.element] || { hex: 0x6e9c8f, radius: 0.42 };
    const radius = isStructural
      ? atom.element === 'H'
        ? 0.11
        : 0.17
      : spec.radius;
    const mesh = new THREE.Mesh(sphereGeo, getAtomMat(atom.element));
    mesh.position.copy(positions[i]);
    mesh.scale.setScalar(radius);
    mesh.castShadow = true;
    group.add(mesh);
  });

  // Bonds
  const up = new THREE.Vector3(0, 1, 0);
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const perp = new THREE.Vector3();
  const quat = new THREE.Quaternion();

  for (const bond of molecule.bonds) {
    const p1 = positions[bond.from];
    const p2 = positions[bond.to];
    if (!p1 || !p2) continue;

    dir.subVectors(p2, p1);
    const len = dir.length();
    if (len < 0.001) continue;
    mid.addVectors(p1, p2).multiplyScalar(0.5);

    const dirNorm = dir.clone().normalize();
    quat.setFromUnitVectors(up, dirNorm);

    // Choose perpendicular vector for multi-order bonds
    if (Math.abs(dirNorm.z) < 0.9) {
      perp.set(0, 0, 1).cross(dirNorm).normalize();
    } else {
      perp.set(1, 0, 0).cross(dirNorm).normalize();
    }

    const bondRadius = isStructural ? 0.085 : 0.095;
    const offsets =
      bond.order === 1
        ? [0]
        : bond.order === 2 || bond.order === 1.5
        ? [-0.11, 0.11]
        : [-0.14, 0, 0.14];

    offsets.forEach((off, idx) => {
      const mat = bond.order === 1.5 && idx === 1 ? piBondMat : bondMat;
      const mesh = new THREE.Mesh(cylGeo, mat);
      mesh.position.copy(mid).addScaledVector(perp, off);
      mesh.quaternion.copy(quat);
      const r = bond.order === 1 ? bondRadius : bondRadius * 0.78;
      mesh.scale.set(r, len, r);
      group.add(mesh);
    });
  }

  // Compute lowest Y to ground contact shadow beneath molecule
  const box = new THREE.Box3().setFromObject(group);
  const minY = box.min.y;
  const shadowGeo = new THREE.CircleGeometry(Math.max(1.8, (box.max.x - box.min.x) * 0.72), 32);
  const shadowTex = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.75,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = minY - 0.55;
  group.add(shadowMesh);

  return group;
}

interface MoleculeViewer3DProps {
  molecule: Molecule3D;
  heightClass?: string;
  compact?: boolean;
  isSaved?: boolean;
  onToggleSave?: (molecule: Molecule3D) => void;
}

export const MoleculeViewer3D: React.FC<MoleculeViewer3DProps> = ({
  molecule,
  heightClass = 'h-72 sm:h-80',
  compact = false,
  isSaved = false,
  onToggleSave,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [modelStyle, setModelStyle] = useState<'ball-stick' | 'structural'>('ball-stick');
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  const uniqueElements = Array.from(new Set(molecule.atoms.map((a) => a.element)));

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = Math.max(container.clientWidth, 240);
    const height = Math.max(container.clientHeight, 220);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f3ef);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.3, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute('aria-label', `3D модель молекулы ${molecule.name}`);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const hemi = new THREE.HemisphereLight(0xf6faf7, 0xd8e0dc, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7eb, 1.35);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd9e9f5, 0.55);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 14;
    controlsRef.current = controls;

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    const resizeObserver = new ResizeObserver(() => {
      if (disposed || !container) return;
      const w = Math.max(container.clientWidth, 180);
      const h = Math.max(container.clientHeight, 180);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      envTex.dispose();
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, []);

  // Rebuild molecule geometry cleanly whenever molecule or visual style changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!scene || !camera || !controls) return;

    if (groupRef.current) {
      scene.remove(groupRef.current);
      groupRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    }

    const group = buildMoleculeGroup(molecule, modelStyle);
    scene.add(group);
    groupRef.current = group;

    // Fit camera nicely to bounding sphere
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 2.2);
    camera.position.set(maxDim * 0.45, maxDim * 0.35, maxDim * 1.45 + 1.2);
    controls.target.set(0, 0, 0);
    controls.update();
    requestRenderRef.current?.();
  }, [molecule, modelStyle]);

  const handleZoom = (factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const nextDist = THREE.MathUtils.clamp(camera.position.length() * factor, 2.8, 13.5);
    camera.position.setLength(nextDist);
    controls.update();
    requestRenderRef.current?.();
  };

  const handleReset = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(1.8, 1.4, 5.8);
    controls.target.set(0, 0, 0);
    controls.update();
    requestRenderRef.current?.();
  };

  return (
    <div
      className="bg-white border border-[#DDE3DF] rounded-xl overflow-hidden flex flex-col"
      data-testid={`molecule-viewer-${molecule.id}`}
    >
      <div className="px-4 py-3 border-b border-[#DDE3DF] flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="font-display font-semibold text-[#2E3B36] text-base">{molecule.name}</h4>
            <FormulaText text={molecule.formula} className="text-sm text-[#4F8A6E] font-medium" />
          </div>
          {!compact && (
            <p className="text-xs text-[#52635C] mt-0.5">
              {molecule.geometry} · M = {molecule.molarMass} г/моль
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-[#EDF1EC] p-0.5 rounded-lg" role="group" aria-label="Режим 3D-модели">
            <button
              type="button"
              onClick={() => setModelStyle('ball-stick')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                modelStyle === 'ball-stick'
                  ? 'bg-white text-[#2E3B36] shadow-xs'
                  : 'text-[#52635C] hover:text-[#2E3B36]'
              }`}
            >
              Шаростержневая
            </button>
            <button
              type="button"
              onClick={() => setModelStyle('structural')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                modelStyle === 'structural'
                  ? 'bg-white text-[#2E3B36] shadow-xs'
                  : 'text-[#52635C] hover:text-[#2E3B36]'
              }`}
            >
              Структурная
            </button>
          </div>
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(molecule)}
              aria-label={isSaved ? `Убрать ${molecule.name} из сохранённых` : `Сохранить ${molecule.name} в профиль`}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#EBF3EE] border-[#4F8A6E] text-[#3A6E56]'
                  : 'bg-white border-[#DDE3DF] text-[#52635C] hover:text-[#2E3B36]'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Dedicated empty ref container for Three.js WebGL canvas */}
      <div className={`relative w-full ${heightClass} bg-[#F0F3EF] select-none`}>
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Compact solid bottom dock (no backdrop-blur over WebGL) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="text-[11px] text-[#52635C] bg-[#FFFFFF]/95 border border-[#DDE3DF] rounded-md px-2.5 py-1 pointer-events-auto">
            Вращение: мышь / палец · Масштаб: колесо / щипок
          </span>
          <div className="flex items-center gap-1 bg-[#FFFFFF]/95 border border-[#DDE3DF] rounded-md p-1 pointer-events-auto">
            <button
              type="button"
              onClick={() => handleZoom(0.84)}
              aria-label="Увеличить масштаб"
              className="p-1 text-[#2E3B36] hover:bg-[#EDF1EC] rounded cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(1.18)}
              aria-label="Уменьшить масштаб"
              className="p-1 text-[#2E3B36] hover:bg-[#EDF1EC] rounded cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="Сбросить ракурс"
              className="p-1 text-[#2E3B36] hover:bg-[#EDF1EC] rounded cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 bg-[#FAFBF9] border-t border-[#DDE3DF] flex flex-wrap items-center justify-between gap-2 text-xs text-[#52635C]">
        <div className="flex flex-wrap items-center gap-3">
          {uniqueElements.map((el) => {
            const spec = CPK_COLORS[el] || { label: el, css: '#6E9C8F' };
            return (
              <span key={el} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                  style={{ backgroundColor: spec.css }}
                />
                <span>{spec.label}</span>
              </span>
            );
          })}
        </div>
        <span className="font-mono text-[#2E3B36]">{molecule.structuralDisplay.replace(/\n/g, ' ')}</span>
      </div>
    </div>
  );
};

interface AtomViewer3DProps {
  element: ElementData;
}

export const AtomViewer3D: React.FC<AtomViewer3DProps> = ({ element }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = Math.max(container.clientWidth, 200);
    const height = Math.max(container.clientHeight, 200);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f3ef);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const maxRadius = 1.2 + element.shells.length * 0.65;
    camera.position.set(0, maxRadius * 0.85, maxRadius * 2.15);

    const renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xf6faf7, 0xd8e0dc, 0.9));
    const keyLight = new THREE.DirectionalLight(0xfff7eb, 1.3);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const atomGroup = new THREE.Group();

    // Nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.55, 24, 20);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f8a6e,
      roughness: 0.25,
      metalness: 0.2,
      clearcoat: 0.4,
    });
    atomGroup.add(new THREE.Mesh(nucleusGeo, nucleusMat));

    const electronGeo = new THREE.SphereGeometry(0.11, 14, 12);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x5b7fa6,
      roughness: 0.25,
      metalness: 0.3,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb8c7c0,
      transparent: true,
      opacity: 0.75,
    });

    element.shells.forEach((count, shellIdx) => {
      const r = 1.05 + shellIdx * 0.56;
      const ringGeo = new THREE.TorusGeometry(r, 0.018, 8, 64);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      const shellContainer = new THREE.Group();
      shellContainer.rotation.x = Math.PI / 2 + (shellIdx % 2 === 0 ? 0.18 : -0.18);
      shellContainer.rotation.y = shellIdx * 0.4;
      shellContainer.add(ring);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const eMesh = new THREE.Mesh(electronGeo, electronMat);
        eMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
        shellContainer.add(eMesh);
      }
      atomGroup.add(shellContainer);
    });

    scene.add(atomGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 16;

    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) frameId = window.setTimeout(poll, 5);
          else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        controls.update();
        renderer.render(scene, camera);
        const done = () => {
          renderBusy = false;
          if (renderDirty && !disposed) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    controls.addEventListener('change', requestRender);
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      atomGroup.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      envTex.dispose();
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [element.number]);

  return (
    <div className="rounded-xl border border-[#DDE3DF] overflow-hidden bg-[#F0F3EF]">
      <div ref={mountRef} className="w-full h-56 cursor-grab active:cursor-grabbing" data-testid="atom-viewer-3d" />
      <div className="px-3 py-2 bg-white border-t border-[#DDE3DF] text-xs text-[#52635C] flex items-center justify-between">
        <span>3D-модель атома ({element.symbol}, Z = {element.number})</span>
        <span className="font-mono text-[#2E3B36] tabular-nums">Слои: {element.shells.join(' · ')}</span>
      </div>
    </div>
  );
};
