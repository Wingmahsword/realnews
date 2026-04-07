import React from 'react';
import { reportData } from '../data/medicalReportData';

const MedicalReport: React.FC = () => {
  const { patient, results, lipidScreen, riskTables } = reportData;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-baseline gap-2 py-1.5 border-b border-slate-100 last:border-0 group">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[120px]">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900 flex-1">
        {value}
      </span>
    </div>
  );

  const ResultRow = ({ item }: { item: any }) => (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 pr-4">
        <div className="font-semibold text-slate-900 text-sm leading-tight">{item.name}</div>
        {item.method && <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.method}</div>}
      </td>
      <td className="py-4 px-4 text-center">
        <span className={`px-2.5 py-1 rounded-full text-sm font-bold shadow-sm ${
          item.status === 'High' ? 'bg-red-50 text-red-600 ring-1 ring-red-200/50' : 
          item.status === 'Low' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/50' : 
          'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50'
        }`}>
          {item.results}
        </span>
      </td>
      <td className="py-4 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-tight">{item.units}</td>
      <td className="py-4 pl-4 text-right text-xs font-medium text-slate-400 font-mono tracking-tight">{item.refInterval}</td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl mx-auto bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden border border-slate-100 ring-1 ring-slate-100">
        
        {/* Premium Header Container */}
        <header className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 px-10 py-12 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <div className="relative flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                  <span className="text-2xl font-black italic tracking-tighter text-white">LPL</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">
                    Dr Lal PathLabs
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-300/80">Diagnostic Center & Research Lab</p>
                </div>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">E-Certified Digital Report</span>
                </span>
              </div>
            </div>
            
            <div className="text-right space-y-1">
              <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest opacity-80">Report Reference</div>
              <div className="text-xl font-mono font-bold text-white tracking-widest">{patient.labNo}</div>
            </div>
          </div>
        </header>

        {/* Patient Profile - UNIFORM FORM ATTENTION */}
        <section className="px-10 py-10 bg-gradient-to-b from-slate-50/50 to-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
            <InfoRow label="Patient Name" value={patient.name} />
            <InfoRow label="Reference By" value={patient.refBy} />
            <InfoRow label="Age / Gender" value={`${patient.age}Y / ${patient.gender}`} />
            <InfoRow label="A/C Status" value={patient.acStatus} />
            <InfoRow label="Date Collected" value={patient.collected} />
            <InfoRow label="Date Reported" value={patient.reported} />
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Location Details</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Collected At</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{patient.collectedAt}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Processed At</span>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{patient.processedAt}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Sections */}
        <div className="px-10 pb-20 space-y-16">
          
          {/* Section: Comprehensive Health Panel */}
          <section>
            <Header label="Comprehensive Health Panel" />
            <div className="mt-6 border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="py-4 px-6 font-black">Test Parameter</th>
                    <th className="py-4 px-4 text-center font-black">Observation</th>
                    <th className="py-4 px-4 text-center font-black">Units</th>
                    <th className="py-4 px-6 text-right font-black">Biological Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.map((item, idx) => <ResultRow key={idx} item={item} />)}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Lipid Profile */}
          <section>
            <Header label="Lipid Profile Analysis" secondary="Cardiovascular Screening" />
            <div className="mt-6 border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="py-4 px-6">Serum Measurement</th>
                    <th className="py-4 px-4 text-center">Value</th>
                    <th className="py-4 px-4 text-center">Units</th>
                    <th className="py-4 px-6 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {lipidScreen.map((item, idx) => <ResultRow key={idx} item={item} />)}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Risk Matrices */}
          <section>
            <Header label="Cardiovascular Risk Matrix" secondary="Indian Lipid Association Guidelines" />
            <div className="mt-6 border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white whitespace-nowrap">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest border-b border-slate-800">
                      <th rowSpan={2} className="py-4 px-6 text-left border-r border-white/10">Risk Category</th>
                      <th colSpan={2} className="py-2 px-6 text-center border-b border-white/10">Treatment Goal (mg/dL)</th>
                      <th colSpan={2} className="py-2 px-6 text-center border-b border-white/10">Consider Therapy (mg/dL)</th>
                    </tr>
                    <tr className="bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-tight">
                      <th className="py-2 px-4 border-r border-white/5">LDL-C</th>
                      <th className="py-2 px-4 border-r border-white/5">Non-HDL</th>
                      <th className="py-2 px-4 border-r border-white/5">LDL-C</th>
                      <th className="py-2 px-4">Non-HDL</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {riskTables.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-6 font-bold text-slate-700 bg-slate-50/50 border-r border-slate-100">{row.category}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900 border-r border-slate-100">{row.treatmentGoalLDL}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900 border-r border-slate-100">{row.treatmentGoalNonHDL}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900 border-r border-slate-100">{row.considerLDL}</td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-900">{row.considerNonHDL}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed italic">*For low risk patients, consider therapy after initial non-pharmacological intervention for at least 3 months.</p>
          </section>

          {/* Signature & End of Report */}
          <footer className="pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-6 flex-1">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Important Instructions</h4>
                  <div className="w-10 h-0.5 bg-indigo-500 rounded-full" />
                </div>
                <ul className="text-[10px] text-slate-500 font-medium space-y-2 max-w-lg leading-relaxed">
                  <li>• Laboratory investigations are a tool to facilitate diagnosis and should be clinically correlated by the Referring Physician.</li>
                  <li>• Certain tests may require further testing at additional cost for derivation of exact value.</li>
                  <li>• This is a computer generated medical diagnostic report validated by Authorized Medical Practitioner.</li>
                </ul>
              </div>
              
              <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 min-w-[240px]">
                <div className="italic text-2xl font-serif text-slate-800 mb-2 opacity-80">Dr. Pankaj Joshi</div>
                <div className="h-px bg-slate-200 mb-4" />
                <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">Dr. Pankaj Joshi</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 underline decoration-indigo-200 decoration-2 underline-offset-4">MD, Pathology • Chief of Lab</div>
              </div>
            </div>
            
            <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              <span>Report Generated: 07-04-2026</span>
              <span className="text-slate-400">Page 1 of 1 (Consolidated)</span>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

const Header = ({ label, secondary }: { label: string; secondary?: string }) => (
  <div className="flex items-end justify-between border-b-2 border-slate-900 pb-2">
    <div>
      <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{label}</h2>
      {secondary && <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">{secondary}</p>}
    </div>
    <div className="h-1.5 w-1.5 rounded-full bg-slate-900 mb-1.5" />
  </div>
);

export default MedicalReport;
