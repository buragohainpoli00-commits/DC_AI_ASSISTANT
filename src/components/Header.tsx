import React from "react";
import { GraduationCap, ShieldCheck, Clock } from "lucide-react";

export default function Header() {
  return (
    <header id="dc-header" className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-400 p-2.5 rounded-xl shadow-inner text-emerald-950">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight leading-none text-amber-300">
                DHEMAJI COLLEGE
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-800/80 text-emerald-200 border border-emerald-700/50">
                ESTD. 1965
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium">
              Official Virtual AI Assistant Portal
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-200 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>Official Information System</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-amber-200 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60">
            <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Available 24/7</span>
          </div>
        </div>
      </div>
    </header>
  );
}
