import React from 'react';
import { ResearchDirection } from '../types';

// Icons
const FormulaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.761 2.156 18 4.828 18h10.344c2.673 0 4.012-3.239 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const MatchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
  </svg>
);

const QuoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-violet-500" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);

interface ScoreBarProps {
  label: string;
  score: number;
  colorClass: string;
  description: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, score, colorClass, description }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-end mb-1">
      <span className="text-xs font-semibold text-slate-600" title={description}>{label}</span>
      <span className="text-xs font-bold text-slate-800">{score}/10</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: `${score * 10}%` }}
      ></div>
    </div>
  </div>
);

interface Props {
  data: ResearchDirection;
  index: number;
}

export const DirectionCard: React.FC<Props> = ({ data, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
        <h3 className="text-lg font-bold text-slate-800 leading-tight">
          <span className="text-blue-600 mr-2">#{index + 1}</span>
          {data.title}
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
          {data.logicType}
        </span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Combination Formula */}
        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">
            <FormulaIcon />
            组合公式 (Combination Formula)
          </div>
          <div className="text-indigo-900 font-mono text-sm md:text-base">
            {data.combinationFormula}
          </div>
        </div>

        {/* Evaluation Scores Grid */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center text-sm font-semibold text-slate-700 mb-3">
            <ChartIcon />
            四维平衡评价 (Balanced Evaluation)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <ScoreBar 
              label="创新性 (Innovation)" 
              score={data.evaluation?.innovationScore ?? 0} 
              colorClass="bg-purple-500" 
              description="是否前沿、原创"
            />
            <ScoreBar 
              label="可行性 (Feasibility)" 
              score={data.evaluation?.feasibilityScore ?? 0} 
              colorClass="bg-green-500" 
              description="能否做出来"
            />
            <ScoreBar 
              label="延续性 (Continuity)" 
              score={data.evaluation?.continuityScore ?? 0} 
              colorClass="bg-amber-500" 
              description="利用已有积累"
            />
            <ScoreBar 
              label="逻辑性 (Logicality)" 
              score={data.evaluation?.logicalityScore ?? 0} 
              colorClass="bg-blue-500" 
              description="故事通不通"
            />
          </div>
          <p className="text-xs text-slate-500 italic border-t border-slate-200 pt-2">
            “{data.evaluation?.analysis}”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logic */}
          <div>
            <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
              <TargetIcon />
              迁移逻辑 (Migration Logic)
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {data.migrationLogicDescription}
            </p>
          </div>

          {/* Resource Match */}
          <div>
            <div className="flex items-center text-sm font-semibold text-slate-500 mb-2">
              <MatchIcon />
              资源匹配度 (Resource Match)
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">
              {data.resourceMatch}
            </p>
          </div>
        </div>

        {/* Grant Pitch */}
        <div className="border-t border-slate-100 pt-4 mt-2">
          <div className="flex items-start">
            <QuoteIcon />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-700 mb-1">
                基金申报话术 (Grant Pitch)
              </div>
              <p className="text-slate-600 italic text-sm border-l-4 border-amber-200 pl-3 py-1 bg-amber-50/50 rounded-r">
                "{data.grantPitch}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};