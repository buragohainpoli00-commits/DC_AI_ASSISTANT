import React from "react";
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  FileCheck2, 
  HelpCircle,
  Award,
  BookOpen
} from "lucide-react";

const STATS = [
  { label: "Established", value: "1965", desc: "Oldest College in Dhemaji", icon: Building2 },
  { label: "Affiliation", value: "Dibrugarh", desc: "Recognized by UGC", icon: BookOpen },
  { label: "Accreditation", value: "NAAC B++", desc: "National Assessment", icon: Award },
];

export default function InfoSidebar() {
  return (
    <div id="dc-info-sidebar" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-6 flex flex-col h-full">
      {/* College Profile Summary */}
      <div>
        <h2 className="font-display font-bold text-slate-800 text-lg tracking-tight mb-3">
          College Quick Profile
        </h2>
        
        <div className="grid grid-cols-3 gap-2.5">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-100 text-center flex flex-col items-center">
                <Icon className="h-4 w-4 text-emerald-700 mb-1" />
                <span className="text-sm font-extrabold text-slate-800 leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-none font-medium truncate w-full">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Leadership & Administration details */}
      <div className="border-t border-slate-100 pt-5 space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Administration Desk
        </h3>
        <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-2xl p-4 flex items-start space-x-3.5">
          <div className="bg-emerald-850 text-white h-11 w-11 rounded-xl font-display font-bold flex items-center justify-center shadow-md shrink-0">
            DN
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Dr. Dipak Kumar Neog
            </h4>
            <p className="text-[10px] text-emerald-800 font-medium">
              Principal, Dhemaji College
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 italic leading-normal">
              "Providing high-quality affordable higher education to the tribal and rural youths of Dhemaji and Assam."
            </p>
          </div>
        </div>
      </div>

      {/* Office timings & Contact Info */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Contact & Coordinates
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="bg-slate-50 p-1.5 rounded-lg text-slate-500 shrink-0 mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Location</p>
              <p className="text-xs text-slate-500">
                College Road, Dhemaji, Assam, PIN - 787057
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-slate-50 p-1.5 rounded-lg text-slate-500 shrink-0 mt-0.5">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Office Timings</p>
              <p className="text-xs text-slate-500">
                10:00 AM – 5:00 PM (Mon – Sat)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-slate-50 p-1.5 rounded-lg text-slate-500 shrink-0 mt-0.5">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Official Email</p>
              <a 
                href="mailto:dhemajicollege@rediffmail.com" 
                className="text-xs text-emerald-700 hover:underline font-medium"
              >
                dhemajicollege@rediffmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-slate-50 p-1.5 rounded-lg text-slate-500 shrink-0 mt-0.5">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">College Phone</p>
              <p className="text-xs text-slate-500">03753-224411 (Fax/Office)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful downloads card */}
      <div className="border-t border-slate-100 pt-5 flex-1 flex flex-col justify-end">
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileCheck2 className="h-5 w-5 text-emerald-800 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">College Prospectus</h4>
              <p className="text-[10px] text-slate-400">View eligibility criteria</p>
            </div>
          </div>
          <a
            href="https://www.dhemajicollege.in/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-xs hover:shadow-xs transition-all select-none text-center"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
}
