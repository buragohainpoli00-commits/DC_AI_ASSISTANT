import React from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Coins, 
  Home, 
  CalendarDays, 
  FileText, 
  Award, 
  PhoneCall 
} from "lucide-react";

interface QuickLinksProps {
  onSelectQuery: (query: string) => void;
}

interface LinkItem {
  label: string;
  query: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor: string;
}

const ITEMS: LinkItem[] = [
  {
    label: "Admissions Guide",
    query: "How can I apply for online admission at Dhemaji College and what are the steps?",
    description: "Required documents, forms, and timelines",
    icon: GraduationCap,
    color: "bg-emerald-50 hover:bg-emerald-100/70 border-emerald-100",
    textColor: "text-emerald-700",
  },
  {
    label: "Courses Offered",
    query: "What undergraduate and higher secondary courses are available?",
    description: "Arts, Science, and computer certificates",
    icon: BookOpen,
    color: "bg-amber-50 hover:bg-amber-100/70 border-amber-100",
    textColor: "text-amber-800",
  },
  {
    label: "Fees & Waiver",
    query: "What is the fee structure and the Assam Govt fee waiver eligibility?",
    description: "HS & degree fees, waiver income limits",
    icon: Coins,
    color: "bg-teal-50 hover:bg-teal-100/70 border-teal-100",
    textColor: "text-teal-700",
  },
  {
    label: "Hostel Lodging",
    query: "What are the hostel facilities and how to apply for hostel admission?",
    description: "Boys' & Girls' hostel seats and selection",
    icon: Home,
    color: "bg-rose-50 hover:bg-rose-100/70 border-rose-100",
    textColor: "text-rose-700",
  },
  {
    label: "Academic Calendar",
    query: "Show me the academic calendar and semester duration.",
    description: "Sessional exams, Dibrugarh University terms",
    icon: CalendarDays,
    color: "bg-sky-50 hover:bg-sky-100/70 border-sky-100",
    textColor: "text-sky-700",
  },
  {
    label: "Required Documents",
    query: "What documents must be uploaded for admission verification?",
    description: "Marksheets, Aadhaar, Caste certificate rules",
    icon: FileText,
    color: "bg-purple-50 hover:bg-purple-100/70 border-purple-100",
    textColor: "text-purple-700",
  },
  {
    label: "NSS & NCC Wings",
    query: "Tell me about the NSS, NCC, and sports facilities at the college.",
    description: "Co-curricular activities and campus life",
    icon: Award,
    color: "bg-orange-50 hover:bg-orange-100/70 border-orange-100",
    textColor: "text-orange-700",
  },
  {
    label: "Contact & Address",
    query: "Provide the official email, phone number, location, and office timings.",
    description: "Directions, rediffmail contact, and map details",
    icon: PhoneCall,
    color: "bg-slate-100 hover:bg-slate-200/70 border-slate-200",
    textColor: "text-slate-700",
  },
];

export default function QuickLinks({ onSelectQuery }: QuickLinksProps) {
  return (
    <div id="dc-quick-links" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-slate-800 text-lg tracking-tight">
          Explore College Topics
        </h2>
        <span className="text-xs font-medium text-slate-400">
          Click any card to ask
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
        {ITEMS.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectQuery(item.query)}
              className={`text-left p-3 rounded-2xl border ${item.color} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer flex flex-col justify-between h-28`}
            >
              <div className={`${item.textColor} p-1.5 bg-white/80 rounded-xl w-fit shadow-sm`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 leading-tight">
                  {item.label}
                </h3>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
