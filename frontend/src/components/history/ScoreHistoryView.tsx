import React from 'react';
import { ScoreHistoryItem, ThemeMode } from '../../types/credit';
import {
  History,
  CheckCircle2,
  XCircle,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface ScoreHistoryViewProps {
  history: ScoreHistoryItem[];
  theme: ThemeMode;
  onSelectHistoryItem: (item: ScoreHistoryItem) => void;
  onStartNewAssessment: () => void;
}

export const ScoreHistoryView: React.FC<ScoreHistoryViewProps> = ({
  history,
  theme,
  onSelectHistoryItem,
  onStartNewAssessment,
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Top Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-cyan-400 mb-1.5">
              <History className="w-3.5 h-3.5" />
              <span>Assessment Audit Log</span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Prediction History
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Review historical loan evaluations and probability outputs generated during this session.
            </p>
          </div>

          <button
            onClick={onStartNewAssessment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* History Items List or Empty State */}
      {history.length > 0 ? (
        <div className={`rounded-3xl border overflow-hidden transition-all ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Assessment Record</span>
            <span>Outcome & Likelihood</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Loan Request: ${item.loan_amnt.toLocaleString()}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-slate-500">
                      Income: ${item.income.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-xs font-bold flex items-center justify-end gap-1.5 ${
                      item.is_approved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {item.is_approved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>{item.decision}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.approval_percentage}% Approval Likelihood
                    </span>
                  </div>

                  <button
                    className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    title="Reload application"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className={`p-12 text-center rounded-3xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No Assessment History Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
            Run your first loan application assessment to view historical decision tracking and probability progression.
          </p>
          <button
            onClick={onStartNewAssessment}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all cursor-pointer"
          >
            Start First Assessment
          </button>
        </div>
      )}

    </div>
  );
};
