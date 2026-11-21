import React from 'react';
import { tokenizeFormula } from '../utils/chemistryLogic';

interface FormulaTextProps {
  text: string;
  className?: string;
}

export const FormulaText: React.FC<FormulaTextProps> = ({ text, className = '' }) => {
  const tokens = tokenizeFormula(text);
  return (
    <span className={`font-mono ${className}`}>
      {tokens.map((tok, i) => {
        if (tok.type === 'sub') {
          return (
            <sub key={i} className="text-[0.72em] leading-none">
              {tok.value}
            </sub>
          );
        }
        if (tok.type === 'sup') {
          return (
            <sup key={i} className="text-[0.72em] leading-none">
              {tok.value}
            </sup>
          );
        }
        return <React.Fragment key={i}>{tok.value}</React.Fragment>;
      })}
    </span>
  );
};
