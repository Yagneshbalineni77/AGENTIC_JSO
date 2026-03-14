import { Leaf } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-200 bg-slate-50 py-6 mt-12">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 relative">
                <div className="flex items-center gap-2">
                    <span>&copy; {new Date().getFullYear()} Career Intelligence Platform</span>
                </div>

                <div className="flex items-center gap-2 font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 shadow-sm">
                    <Leaf className="h-4 w-4" />
                    <span>Agentic JSO runs on serverless edge compute to minimize carbon footprint.</span>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="hover:text-slate-900 transition underline-offset-4 hover:underline">Privacy</a>
                    <a href="#" className="hover:text-slate-900 transition underline-offset-4 hover:underline">Terms</a>
                    <a href="#" className="hover:text-slate-900 transition underline-offset-4 hover:underline">AI Ethics Policy</a>
                </div>
            </div>
        </footer>
    );
}
