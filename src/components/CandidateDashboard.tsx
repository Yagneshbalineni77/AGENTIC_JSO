"use client";

import { useState } from "react";
import { currentUser, jobs, calculateFitScore, Job, FitScoreResult } from "@/lib/mockData";
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, ArrowRight, X, BrainCircuit, UploadCloud, RefreshCw, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CandidateDashboard() {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [showModal, setShowModal] = useState<"success" | "intervention" | "parsing" | null>(null);
    const [currentScoreResult, setCurrentScoreResult] = useState<FitScoreResult | null>(null);
    const [parsingStep, setParsingStep] = useState(0);

    const handleApply = (job: Job) => {
        const result = calculateFitScore(currentUser.skills, job.requiredSkills, currentUser.experienceYears, job.minExperienceYears);
        setSelectedJob(job);
        setCurrentScoreResult(result);
        if (result.score >= 50) {
            setShowModal("success");
        } else {
            setShowModal("intervention");
        }
    };

    const simulateParsing = () => {
        setShowModal("parsing");
        setParsingStep(0);

        setTimeout(() => setParsingStep(1), 1200); // Extracting nodes
        setTimeout(() => setParsingStep(2), 2500); // Semantic synonym matching
        setTimeout(() => {
            setParsingStep(3);
            setTimeout(() => setShowModal(null), 1000); // Done
        }, 4000);
    };

    const getBetterMatches = () => {
        return jobs
            .map(job => ({ job, scoreResult: calculateFitScore(currentUser.skills, job.requiredSkills, currentUser.experienceYears, job.minExperienceYears) }))
            .filter(entry => entry.scoreResult.score >= 50 && entry.job.id !== selectedJob?.id)
            .slice(0, 3);
    };

    const closeModal = () => {
        if (showModal === "parsing") return; // Prevent closing while parsing
        setShowModal(null);
        setSelectedJob(null);
        setCurrentScoreResult(null);
    };

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 relative">
            <div className="mb-8 grid gap-6 md:grid-cols-3">
                {/* Profile Summary Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-1 h-fit sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
                    </div>
                    <div className="mb-6 flex flex-col items-center">
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold mb-3 shadow-inner">
                            {currentUser.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
                        <p className="text-sm font-medium text-slate-500">{currentUser.title} • {currentUser.experienceYears} Years Exp.</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Extracted Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentUser.skills.map(skill => (
                                <span key={skill} className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={simulateParsing}
                        className="w-full mb-6 flex items-center justify-center gap-2 rounded-xl border-1.5 border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer"
                    >
                        <UploadCloud className="h-4 w-4" />
                        Upload Updated CV
                    </button>

                    <div className="rounded-xl bg-slate-50 p-4 flex items-start gap-3 border border-slate-200 shadow-sm">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">Blind Audition Enabled</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Your demographic data is stripped automatically to ensure unbiased ethical hiring.</p>
                        </div>
                    </div>
                </div>

                {/* Jobs Feed */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">AI Recommended Feed</h2>
                            <p className="text-sm text-slate-500 font-medium">Auto-scored based on core requirements and experience.</p>
                        </div>
                        <div className="flex w-fit items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm cursor-help font-semibold" title="Scores consider core vs bonus skills and exact semantic matches.">
                            <BrainCircuit className="h-4 w-4" />
                            Advanced Engine V2
                        </div>
                    </div>

                    {jobs.map(job => {
                        const result = calculateFitScore(currentUser.skills, job.requiredSkills, currentUser.experienceYears, job.minExperienceYears);
                        const isHighMatch = result.score >= 50;

                        return (
                            <div key={job.id} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{job.title}</h3>
                                        <span className="text-xs font-bold text-slate-400 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">Min {job.minExperienceYears}y exp</span>
                                    </div>

                                    <p className="text-sm font-semibold text-slate-500 mb-4">{job.company} • {job.salary}</p>

                                    <div className="mb-4">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Stack</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.requiredSkills.map(req => {
                                                const isMatched = result.matchedSkills.includes(req.name);
                                                return (
                                                    <span key={req.name} className={`rounded-md px-2.5 py-1 text-xs font-bold border shadow-sm ${isMatched
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-white text-slate-600 border-slate-200"
                                                        }`}>
                                                        {req.name} {req.isCore && <span className="opacity-50 ml-0.5">*</span>}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {result.synonymMatches.length > 0 && (
                                        <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50/50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 border border-indigo-100">
                                            <BrainCircuit className="h-3 w-3" />
                                            AI equated {result.synonymMatches.map(s => `'${s.original}' as '${s.matchedAs}'`).join(", ")}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto shrink-0">
                                    <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-slate-50 shadow-inner">
                                        <svg className="absolute top-0 left-0 h-full w-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 36 36">
                                            <path
                                                className="text-slate-200"
                                                strokeWidth="3.5"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path
                                                className={isHighMatch ? "text-emerald-500" : "text-rose-500"}
                                                strokeDasharray={`${result.score}, 100`}
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                stroke="currentColor"
                                                fill="none"
                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className={`text-xl font-black tracking-tighter ${isHighMatch ? "text-emerald-600" : "text-rose-600"}`}>
                                                {result.score}
                                                <span className="text-sm font-bold align-top mt-0.5 inline-block">%</span>
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleApply(job)}
                                        className="w-full sm:w-[120px] rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-600 hover:shadow-indigo-200 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={closeModal}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5"
                        >
                            {showModal !== "parsing" && (
                                <button
                                    onClick={closeModal}
                                    className="absolute right-4 top-4 z-10 text-slate-400 hover:text-slate-600 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}

                            {/* SUCCESS MODAL */}
                            {showModal === "success" && selectedJob && currentScoreResult && (
                                <div className="p-8 text-center">
                                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 shadow-inner">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                                    </div>
                                    <h3 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Application Fast-Tracked!</h3>
                                    <p className="mb-6 text-slate-600 font-medium leading-relaxed">
                                        Successfully applied for <span className="font-bold text-slate-900">{selectedJob.title}</span> at {selectedJob.company}.
                                    </p>

                                    <div className="mb-8 rounded-xl bg-slate-50 p-5 border border-slate-200 text-sm text-left shadow-sm">
                                        <p className="font-bold text-slate-900 mb-2">What HR sees:</p>
                                        <ul className="space-y-2 text-slate-600 font-medium text-xs">
                                            <li className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Bias-free profile (demographics hidden)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <BrainCircuit className="h-4 w-4 text-indigo-500" /> <span className="font-bold text-emerald-600">{currentScoreResult.score}% Match Score</span> attached to resume
                                            </li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}

                            {/* AI INTERVENTION MODAL */}
                            {showModal === "intervention" && selectedJob && currentScoreResult && (
                                <div className="p-8">
                                    <div className="mb-6 flex gap-4 items-start">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-100 shadow-inner mt-1">
                                            <AlertTriangle className="h-7 w-7 text-rose-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Intervention</h3>
                                            <p className="text-slate-600 mt-1.5 text-sm font-medium leading-relaxed">
                                                Wait. Our Agentic AI calculated a low <span className="font-bold text-rose-600 bg-rose-50 px-1 rounded">{currentScoreResult.score}% fit</span> for this role. Based on historical data, applications below 50% are typically auto-rejected by ATS systems.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Skill Gap Analysis</h4>

                                        <div className="space-y-3">
                                            {/* Required vs Candidate Comparison Bars */}
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                                    <span className="text-slate-700">Core Requirements Met</span>
                                                    <span className="text-slate-900">{currentScoreResult.matchedSkills.length}/{selectedJob.requiredSkills.filter(s => s.isCore).length}</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-rose-500 rounded-full"
                                                        style={{ width: `${(currentScoreResult.matchedSkills.length / Math.max(1, selectedJob.requiredSkills.filter(s => s.isCore).length)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 shadow-sm">
                                            <p className="text-xs text-rose-800 mb-2 font-bold uppercase tracking-wider">Missing Core Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentScoreResult.missingSkills.length > 0
                                                    ? currentScoreResult.missingSkills.map(skill => (
                                                        <span key={skill} className="rounded-md bg-white border border-rose-200 px-2.5 py-1 text-xs font-bold text-rose-700 shadow-sm">
                                                            {skill}
                                                        </span>
                                                    ))
                                                    : <span className="text-xs font-semibold text-rose-600">None! You are missing experience years instead.</span>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-6 border-slate-200 border-dashed" />

                                    <div className="mb-4">
                                        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <BrainCircuit className="h-4 w-4 text-indigo-600" />
                                            Redirecting to high-probability matches:
                                        </h4>
                                        <div className="space-y-3">
                                            {getBetterMatches().map(({ job, scoreResult }) => (
                                                <div key={job.id} className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer" onClick={() => handleApply(job)}>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{job.title}</p>
                                                        <p className="text-xs font-semibold text-slate-500">{job.company}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{scoreResult.score}%</span>
                                                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                                        >
                                            Acknowledge
                                        </button>
                                        <button
                                            onClick={() => {
                                                alert("Application forced despite AI warning. Note: This action may negatively impact your overall platform score.");
                                                closeModal();
                                            }}
                                            className="flex-1 rounded-xl bg-slate-100 text-slate-400 px-4 py-3.5 text-sm font-bold hover:bg-rose-50 hover:text-rose-600 transition"
                                        >
                                            Apply Anyway
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CV PARSING SIMULATION MODAL */}
                            {showModal === "parsing" && (
                                <div className="p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                                    <div className="relative h-24 w-24 mb-6">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="absolute inset-0 rounded-full border-[3px] border-indigo-100 border-t-indigo-600"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {parsingStep === 0 && <FileText className="h-8 w-8 text-indigo-400" />}
                                            {parsingStep === 1 && <BrainCircuit className="h-8 w-8 text-indigo-500" />}
                                            {parsingStep === 2 && <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />}
                                            {parsingStep === 3 && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-2">Agentic Processing</h3>

                                    <div className="h-6 overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.p
                                                key={parsingStep}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="text-sm font-semibold text-slate-500"
                                            >
                                                {parsingStep === 0 && "Reading document nodes..."}
                                                {parsingStep === 1 && "Extracting semantic tokens..."}
                                                {parsingStep === 2 && "Mapping custom synonyms via AI..."}
                                                {parsingStep === 3 && "Profile Successfully Calibrated!"}
                                            </motion.p>
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
