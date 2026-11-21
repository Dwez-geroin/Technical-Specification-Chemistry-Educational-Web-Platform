import React, { useState } from 'react';
import { ArrowRight, FlaskConical } from 'lucide-react';
import { ORGANIC_GENETIC_GRAPH, type GeneticEdge } from '../data/tablesData';
import { FormulaText } from './FormulaText';

interface OrganicGeneticGraphProps {
  highlightNodeId?: string;
  onOpenTopic: (topicId: string) => void;
  onOpenReaction: (reactionId: string) => void;
}

export const OrganicGeneticGraph: React.FC<OrganicGeneticGraphProps> = ({
  highlightNodeId,
  onOpenTopic,
  onOpenReaction,
}) => {
  const [selectedEdge, setSelectedEdge] = useState<GeneticEdge>(ORGANIC_GENETIC_GRAPH.edges[0]);

  const nodeMap = new Map(ORGANIC_GENETIC_GRAPH.nodes.map((n) => [n.id, n]));

  return (
    <div className="bg-white border border-[#DDE3DF] rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-lg text-[#2E3B36]">
            Генетические связи классов органических соединений
          </h3>
          <p className="text-sm text-[#52635C] mt-0.5">
            Нажмите на класс веществ, чтобы открыть тему, или на переход «класс → класс», чтобы увидеть реагент и уравнение.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto chem-scroll pb-2">
        <svg
          viewBox="0 0 820 400"
          className="w-full min-w-[680px] h-auto select-none"
          role="img"
          aria-label="Схема генетических связей классов органической химии"
        >
          <defs>
            <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#8FA399" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3A6E56" />
            </marker>
          </defs>

          {/* Edges */}
          {ORGANIC_GENETIC_GRAPH.edges.map((edge, idx) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const isActive =
              selectedEdge.from === edge.from && selectedEdge.to === edge.to && selectedEdge.reagent === edge.reagent;

            // Slight curve offset for bidirectional edges
            const reverseExists = ORGANIC_GENETIC_GRAPH.edges.some(
              (e) => e.from === edge.to && e.to === edge.from,
            );
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.hypot(dx, dy) || 1;
            const nx = -dy / dist;
            const ny = dx / dist;
            const curveOffset = reverseExists ? 18 : 0;

            const sx = from.x + (dx / dist) * 58 + nx * (curveOffset * 0.4);
            const sy = from.y + (dy / dist) * 26 + ny * (curveOffset * 0.4);
            const ex = to.x - (dx / dist) * 58 + nx * (curveOffset * 0.4);
            const ey = to.y - (dy / dist) * 26 + ny * (curveOffset * 0.4);
            const mx = (sx + ex) / 2 + nx * curveOffset;
            const my = (sy + ey) / 2 + ny * curveOffset;

            return (
              <g
                key={`${edge.from}-${edge.to}-${idx}`}
                onClick={() => setSelectedEdge(edge)}
                className="cursor-pointer group"
              >
                <path
                  d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                />
                <path
                  d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`}
                  fill="none"
                  stroke={isActive ? '#3A6E56' : '#A9B9B1'}
                  strokeWidth={isActive ? 2.5 : 1.6}
                  markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow-muted)'}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {ORGANIC_GENETIC_GRAPH.nodes.map((node) => {
            const isHighlighted = highlightNodeId === node.id;
            const isInEdge = selectedEdge.from === node.id || selectedEdge.to === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onOpenTopic(node.topicId)}
                className="cursor-pointer"
              >
                <rect
                  x={-68}
                  y={-26}
                  width={136}
                  height={52}
                  rx={10}
                  fill={isHighlighted ? '#3A6E56' : isInEdge ? '#EBF3EE' : '#FFFFFF'}
                  stroke={isHighlighted ? '#3A6E56' : isInEdge ? '#4F8A6E' : '#C8D3CD'}
                  strokeWidth={isHighlighted || isInEdge ? 2 : 1.2}
                />
                <text
                  textAnchor="middle"
                  y={-3}
                  fontSize={12.5}
                  fontWeight={600}
                  fill={isHighlighted ? '#FFFFFF' : '#2E3B36'}
                  style={{ fontFamily: 'Manrope, sans-serif' }}
                >
                  {node.label}
                </text>
                <text
                  textAnchor="middle"
                  y={15}
                  fontSize={11}
                  fill={isHighlighted ? '#DCEEE5' : '#52635C'}
                  style={{ fontFamily: 'IBM Plex Mono, monospace' }}
                >
                  {node.formula}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Transition selector list + active reaction detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-[#DDE3DF]">
        <div className="lg:col-span-5 flex flex-wrap gap-1.5">
          {ORGANIC_GENETIC_GRAPH.edges.map((edge, idx) => {
            const fromLabel = nodeMap.get(edge.from)?.label || edge.from;
            const toLabel = nodeMap.get(edge.to)?.label || edge.to;
            const isActive =
              selectedEdge.from === edge.from && selectedEdge.to === edge.to && selectedEdge.reagent === edge.reagent;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedEdge(edge)}
                className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#3A6E56] text-white border-[#3A6E56]'
                    : 'bg-[#F5F7F4] text-[#2E3B36] border-[#DDE3DF] hover:border-[#4F8A6E]'
                }`}
              >
                {fromLabel} → {toLabel}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-[#F5F7F4] border border-[#DDE3DF] rounded-xl p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#52635C]">
              <span>Переход</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#3A6E56]">
                {nodeMap.get(selectedEdge.from)?.label} → {nodeMap.get(selectedEdge.to)?.label}
              </span>
            </div>
            <div className="mt-2 text-base font-medium text-[#2E3B36]">
              <FormulaText text={selectedEdge.equation} />
            </div>
            <p className="text-sm text-[#52635C] mt-1.5">
              Реагент: <strong className="text-[#2E3B36] font-medium">{selectedEdge.reagent}</strong> · Условия:{' '}
              <strong className="text-[#2E3B36] font-medium">{selectedEdge.condition}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedEdge.reactionId && (
              <button
                type="button"
                onClick={() => onOpenReaction(selectedEdge.reactionId!)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#437265] text-white rounded-lg hover:bg-[#355D52] transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Открыть в конструкторе
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const target = nodeMap.get(selectedEdge.to);
                if (target) onOpenTopic(target.topicId);
              }}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-medium bg-white border border-[#DDE3DF] text-[#2E3B36] rounded-lg hover:border-[#4F8A6E] transition-colors cursor-pointer"
            >
              К теме «{nodeMap.get(selectedEdge.to)?.label}»
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
