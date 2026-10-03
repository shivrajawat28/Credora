import React from 'react';
import { UserCheck, Cpu, Award, Network } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Enter Your Information',
      desc: 'Provide basic employment details, annual income, loan requirements, and credit history length through our guided 4-step wizard.',
      icon: UserCheck,
      color: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      num: '02',
      title: 'AI Analyzes Profile',
      desc: 'Our Tuned Random Forest model transforms 26 categorical & numerical dimensions through Platt Sigmoid Probability Calibration.',
      icon: Cpu,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      num: '03',
      title: 'Receive Your Credit Score',
      desc: 'Get an instant FICO-calibrated Credit Score (300–850) and clear approval classification (Approved, Manual Review, or High Risk).',
      icon: Award,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      num: '04',
      title: 'Understand What Influenced It',
      desc: 'Explore localized TreeSHAP waterfall charts revealing exactly which financial habits boosted or lowered your credit assessment.',
      icon: Network,
      color: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Intelligent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            How CrediVantage Evaluates Credit
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base">
            From raw financial telemetry to explainable, human-readable insights in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative rounded-2xl bg-gradient-to-b ${step.color} border ${step.borderColor} p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/40 group`}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-extrabold font-mono text-slate-500 group-hover:text-white transition-colors">
                    {step.num}
                  </span>
                  <div className={`w-11 h-11 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center ${step.iconColor} shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
