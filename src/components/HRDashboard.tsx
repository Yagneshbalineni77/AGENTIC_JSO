"use client";

import { useState, useMemo } from "react";
import { jobs, hrCandidates, calculateFitScore } from "@/lib/mockData";
import { EyeOff, ChevronDown, ListFilter, BrainCircuit, Activity, SlidersHorizontal, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HRDashboard() {
    const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0].id);
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
    const [autoRejectThreshold, setAutoRejectThreshold] = useState<number>(40);

    const selectedJob = jobs.find(j => j.id === selectedJobId);

    // Sort candidates by fit score descending
    const candidatesWithScores = useMemo(() => {
        if (!selectedJob) return [];

        return hrCandidates.map(candidate => {
            const result = calculateFitScore(candidate.skills, selectedJob.requiredSkills, candidate.experienceYears, selectedJob.minExperienceYears);
            return { ...candidate, result };
        }).sort((a, b) => b.result.score - a.result.score);
    }, [selectedJobId, selectedJob]);

    // Separate visually by threshold
    const activeCandidates = candidatesWithScores.filter(c => c.result.score >= autoRejectThreshold);
    const rejectedCandidates = candidatesWithScores.filter(c => c.result.score < autoRejectThreshold);

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">

            {/* Header & Controls */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Applicant Tracking System</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 shadow-sm">
                            <EyeOff className="h-3.5 w-3.5 text-emerald-600" />
                            Blind Audition Active
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100 shadow-sm">
                            <BrainCircuit className="h-3.5 w-3.5 text-indigo-600" />
                            Agentic Parsing V2
                        </span>
                    </div>
                </div>

                <div className="relative w-full sm:w-72 shrink-0">
                    <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Active Position Dropdown</label>
                    <div className="relative">
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-bold text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all"
                        >
                            {jobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
                {/* Required Skills for context */}
                <div className="md:col-span-3 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-3">Required Algorithm Baseline</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedJob?.requiredSkills.map(req => (
                            <span key={req.name} className={`rounded-md border px-2.5 py-1 text-xs font-bold shadow-sm ${req.isCore ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200"}`}>
                                {req.name} {req.isCore && <span className="text-slate-400 font-normal ml-1">Core</span>}
                            </span>
                        ))}
                        <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-sm">
                            {selectedJob?.minExperienceYears}y Min Exp.
                        </span>
                    </div>
                </div>

                {/* Auto Reject Slider Feature V2 */}
                <div className="md:col-span-1 rounded-2xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-indigo-300 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 drop-shadow-sm group-hover:opacity-20 transition-opacity">
                        <SlidersHorizontal className="h-16 w-16 text-indigo-900" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-1.5">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">AI Auto-Reject</p>
                            <span className="text-xs font-bold bg-rose-50 text-rose-600 px-1.5 rounded">&lt; {autoRejectThreshold}%</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="90"
                            step="5"
                            value={autoRejectThreshold}
                            onChange={(e) => setAutoRejectThreshold(parseInt(e.target.value))}
                            className="w-full accent-rose-500 cursor-ew-resize mb-2 h-1.5 bg-slate-100 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <p className="text-[10px] text-slate-400 font-semibold leading-tight">Candidates below this AI Fit Score are sent to the hidden rejected pool.</p>
                    </div>
                </div>
            </div>

            {/* Applicant List */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-slate-700 text-sm tracking-tight">
                        <ListFilter className="h-4 w-4 text-indigo-500" />
                        Active AI-Ranked Pool ({activeCandidates.length})
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {activeCandidates.map((candidate, index) => {
                        const isHighMatch = candidate.result.score >= 50;
                        const isExpanded = expandedLogId === candidate.id;

                        return (
                            <div key={candidate.id} className="p-6 transition hover:bg-slate-50/50">
                                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                                    {/* Rank & Match Score */}
                                    <div className="flex items-center gap-4 min-w-[140px]">
                                        <span className="text-3xl font-black text-slate-200 tracking-tighter w-10">#{index + 1}</span>
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100">
                                            <svg className="absolute top-0 left-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                                                <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                <path
                                                    className={isHighMatch ? "text-emerald-500" : "text-rose-500"}
                                                    strokeDasharray={`${candidate.result.score}, 100`}
                                                    strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                />
                                            </svg>
                                            <span className={`text-sm font-black ${isHighMatch ? "text-emerald-600" : "text-rose-600"}`}>
                                                {candidate.result.score}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 shadow-inner">
                                                <EyeOff className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{candidate.blindName}</h3>
                                            <span className="ml-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold text-slate-600 shadow-sm">
                                                {candidate.experienceYears}y exp
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 mb-3">{candidate.title}</p>

                                        <div className="flex flex-wrap gap-1.5">
                                            {candidate.skills.map(skill => (
                                                <span key={skill} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                        <button
                                            onClick={() => setExpandedLogId(isExpanded ? null : candidate.id)}
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold shadow-sm transition ${isExpanded
                                                    ? "bg-slate-100 border-slate-200 text-slate-600"
                                                    : "bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                                }`}
                                        >
                                            <BrainCircuit className="h-4 w-4" />
                                            {isExpanded ? "Hide AI Reasoning" : "View AI Reasoning"}
                                        </button>
                                        {isHighMatch && (
                                            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition">
                                                Advance to Review
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Advanced Audit Log V2 */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-6 rounded-2xl bg-indigo-50/30 p-6 border-2 border-indigo-100/50 relative">
                                                <div className="absolute top-6 right-6 opacity-5">
                                                    <Activity className="h-24 w-24 text-indigo-900" />
                                                </div>

                                                <div className="flex items-center gap-2 mb-4">
                                                    <BrainCircuit className="h-5 w-5 text-indigo-500" />
                                                    <h4 className="text-base font-black text-slate-900 tracking-tight">Agentic AI Scoring Rationale</h4>
                                                </div>
                                                <p className="text-sm font-medium text-slate-700 mb-6 max-w-2xl leading-relaxed bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                                    {candidate.result.auditLog}
                                                </p>

                                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                                        <p className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                                                            ✅ Requirements Met
                                                        </p>
                                                        <div className="flex flex-col gap-2">
                                                            {candidate.result.matchedSkills.length > 0 ? candidate.result.matchedSkills.map(s => {
                                                                const isCore = selectedJob?.requiredSkills.find(r => r.name === s)?.isCore;
                                                                const synonymMatch = candidate.result.synonymMatches.find(sm => sm.matchedAs === s);

                                                                return (
                                                                    <div key={s} className="flex flex-col">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-bold text-slate-800 text-sm">{s}</span>
                                                                            {isCore && <span className="bg-slate-900 text-white text-[10px] uppercase font-bold px-1.5 rounded">Core (+3)</span>}
                                                                            {!isCore && <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-1.5 rounded">Bonus (+1)</span>}
                                                                        </div>
                                                                        {synonymMatch && (
                                                                            <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1 mt-0.5 ml-2">
                                                                                <ArrowRight className="h-3 w-3" /> Auto-matched via synonym '{synonymMatch.original}'
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )
                                                            }) : <span className="text-xs font-semibold text-slate-500">None matched</span>}
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-xl p-4 border border-rose-100 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-1 bg-rose-500 h-full" />
                                                        <p className="text-xs font-black text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-rose-100 pb-2">
                                                            ❌ Gaps Detected
                                                        </p>
                                                        <div className="flex flex-col gap-2">
                                                            {candidate.result.missingSkills.length > 0 ? candidate.result.missingSkills.map(s => {
                                                                const isCore = selectedJob?.requiredSkills.find(r => r.name === s)?.isCore;
                                                                return (
                                                                    <div key={s} className="flex items-center gap-2">
                                                                        <span className="font-bold text-slate-800 text-sm line-through decoration-rose-300">{s}</span>
                                                                        {isCore && <span className="border border-rose-200 text-rose-600 text-[10px] uppercase font-bold px-1.5 rounded bg-rose-50">-3 Points</span>}
                                                                        {!isCore && <span className="border border-slate-200 text-slate-500 text-[10px] uppercase font-bold px-1.5 rounded bg-slate-50">-1 Point</span>}
                                                                    </div>
                                                                )
                                                            }) : <span className="text-xs font-semibold text-emerald-600">No missing requirements!</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Auto Rejected Pool */}
            {rejectedCandidates.length > 0 && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/30 overflow-hidden opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                    <div className="border-b border-rose-100/50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-rose-700 text-sm">
                            <Trash2 className="h-4 w-4" />
                            Auto-Rejected by AI Threshold ({rejectedCandidates.length})
                        </div>
                        <span className="text-xs font-semibold text-rose-500">Score &lt; {autoRejectThreshold}%</span>
                    </div>

                    <div className="p-4 flex gap-2 overflow-x-auto">
                        {rejectedCandidates.map(c => (
                            <div key={c.id} className="bg-white border border-rose-100 rounded-xl p-3 shrink-0 w-48 shadow-sm">
                                <p className="text-xs font-black text-rose-600 mb-1">{c.result.score}% Match</p>
                                <p className="text-sm font-bold text-slate-800 truncate">{c.blindName}</p>
                                <p className="text-xs font-semibold text-slate-500 truncate">{c.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
