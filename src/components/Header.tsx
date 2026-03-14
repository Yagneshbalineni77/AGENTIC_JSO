import { BrainCircuit, Briefcase, ShieldCheck, Users } from "lucide-react";

interface HeaderProps {
    view: "candidate" | "hr";
    setView: (view: "candidate" | "hr") => void;
}

export default function Header({ view, setView }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200 text-white">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Agentic <span className="text-indigo-600">JSO</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-full bg-slate-100 p-1 shadow-sm">
                        <button
                            onClick={() => setView("candidate")}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${view === "candidate"
                                    ? "bg-white text-indigo-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <Briefcase className="h-4 w-4" />
                            Candidate View
                        </button>
                        <button
                            onClick={() => setView("hr")}
                            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${view === "hr"
                                    ? "bg-white text-indigo-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <Users className="h-4 w-4" />
                            HR/Agency View
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
