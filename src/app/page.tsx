"use client";

import { useState } from "react";
import Header from "@/components/Header";
import CandidateDashboard from "@/components/CandidateDashboard";
import HRDashboard from "@/components/HRDashboard";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [view, setView] = useState<"candidate" | "hr">("candidate");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header view={view} setView={setView} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            {view === "candidate" ? <CandidateDashboard /> : <HRDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
