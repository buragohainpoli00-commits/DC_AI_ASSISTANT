import React from "react";
import { Megaphone, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { Notice } from "../types";

interface NoticeBoardProps {
  onSelectNotice: (title: string) => void;
}

const STATIC_NOTICES: Notice[] = [
  {
    id: "1",
    title: "FYUGP (NEP 2020) 4-Year BA/BSc Admission Circular 2026-27",
    date: "July 12, 2026",
    category: "Admission",
    important: true,
  },
  {
    id: "2",
    title: "HS Arts & Science Merit List & Document Verification Schedule",
    date: "July 10, 2026",
    category: "Admission",
    important: true,
  },
  {
    id: "3",
    title: "Sessional Internal Examination Dates for UG 3rd & 5th Semesters",
    date: "July 08, 2026",
    category: "Exam",
    important: false,
  },
  {
    id: "4",
    title: "Assam Govt Fee Waiver Scheme: Income Certificate Submission Notice",
    date: "July 05, 2026",
    category: "General",
    important: true,
  },
  {
    id: "5",
    title: "Dhemaji College Boys' and Girls' Hostel New Allotment Criteria",
    date: "July 02, 2026",
    category: "General",
    important: false,
  },
  {
    id: "6",
    title: "National Cadet Corps (NCC) and NSS New Cadets Enrollment Drive",
    date: "June 28, 2026",
    category: "Event",
    important: false,
  }
];

export default function NoticeBoard({ onSelectNotice }: NoticeBoardProps) {
  const getCategoryBadge = (category: Notice["category"]) => {
    switch (category) {
      case "Admission":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Exam":
        return "bg-rose-50 text-rose-700 border-rose-100";
      case "Event":
        return "bg-sky-50 text-sky-700 border-sky-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div id="dc-notice-board" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-800">
            <Megaphone className="h-4 w-4" />
          </div>
          <h2 className="font-display font-semibold text-slate-800">
            College Notices & Bulletins
          </h2>
        </div>
        <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          Official Circulars
        </span>
      </div>

      <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[380px] lg:max-h-[none]">
        {STATIC_NOTICES.map((notice) => (
          <div
            key={notice.id}
            onClick={() => onSelectNotice(notice.title)}
            className="group relative bg-white hover:bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200/60 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {notice.important && (
              <div className="absolute top-0 right-12 translate-y-[-50%] bg-amber-400 text-[9px] font-bold text-emerald-950 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 uppercase tracking-wider">
                <Sparkles className="h-2 w-2" /> Urgent
              </div>
            )}
            
            <div className="flex items-start justify-between gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getCategoryBadge(notice.category)}`}>
                {notice.category}
              </span>
              <span className="flex items-center text-[11px] font-mono text-slate-400 gap-1">
                <Calendar className="h-3 w-3" />
                {notice.date}
              </span>
            </div>

            <h3 className="mt-2 text-sm font-semibold text-slate-700 leading-snug group-hover:text-emerald-800 transition-colors">
              {notice.title}
            </h3>

            <div className="mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-end text-xs font-semibold text-emerald-700 group-hover:text-emerald-850 opacity-0 group-hover:opacity-100 transition-all">
              <span className="flex items-center gap-1">
                Ask AI Assistant <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-50/50 p-3.5 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 leading-normal">
          Click any bulletin above. Our College AI will scan current records and summarize the eligibility, criteria, and dates for you.
        </p>
      </div>
    </div>
  );
}
