import { useState, useEffect, useMemo, FormEvent, MouseEvent } from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Pill, 
  Stethoscope, 
  Newspaper, 
  Database, 
  Droplet, 
  Heart, 
  Check, 
  Clock, 
  Trash2, 
  Plus, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  User, 
  Download 
} from 'lucide-react';

// Structured TypeScript Interfaces
export interface GlucoseReading {
  id: number;
  value: number;
  timeOfDay: string;
  mealContext: string;
  date: string;
  notes?: string;
}

export interface BloodPressureReading {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  timeOfDay: string;
  date: string;
  notes?: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  morning: boolean;
  evening: boolean;
  active: boolean;
}

export interface UploadedDocument {
  id: number;
  name: string;
  type: string;
  category: string;
  size: string;
  date: string;
  status: string;
  extracted: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  category: string;
  summary: string;
  date: string;
  source: string;
  readTime: string;
  content: string;
  bookmarked: boolean;
}

// Static News Feed Database
const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "Metformin for Longevity: The TAME Trial & Cellular Rejuvenation",
    category: "Longevity Science",
    summary: "Can a 60-year-old diabetes medication delay aging? Researchers explain the cellular mechanisms of Metformin in mimicking caloric restriction and suppressing AMPK-induced aging pathways.",
    date: "June 12, 2026",
    source: "Longevity Medicine Review",
    readTime: "6 min read",
    content: "Metformin is historically a glucose-lowering drug. However, the upcoming Targeting Aging with Metformin (TAME) trial seeks to prove it delays chronic diseases. Its mechanism involves activating AMPK (AMP-activated protein kinase) and enhancing mitochondrial efficiency, thereby suppressing inflammation and systemic aging.",
    bookmarked: false
  },
  {
    id: 2,
    title: "The Great CGM Revolution: Beyond Diabetes with Dexcom Stelo",
    category: "Health Technology",
    summary: "Dexcom's FDA-approved over-the-counter Stelo glucose monitor opens metabolic health tracking to everyone. How non-diabetics are using glucose trends to optimize energy, focus, and longevity.",
    date: "June 14, 2026",
    source: "Digital Health Insider",
    readTime: "5 min read",
    content: "Continuous Glucose Monitors (CGMs) like the Dexcom Stelo are transforming wellness. By tracking glucose in real-time, users can identify insulin spikes, optimize food sequencing (eating fiber/protein before carbs), and improve physical endurance without the need for a prescription.",
    bookmarked: false
  },
  {
    id: 3,
    title: "Blood Pressure & Sodium Sensitivity Debate: New Guidelines",
    category: "Cardio Health",
    summary: "Is restricting salt beneficial for everyone? Emerging clinical debates show sodium sensitivity varies heavily by genetics, suggesting highly personalized hydration and potassium-to-sodium ratios instead.",
    date: "May 28, 2026",
    source: "American Heart Forum",
    readTime: "8 min read",
    content: "For decades, universal salt restriction was the primary defense against hypertension. Modern cardiovascular research suggests only 50% of hypertensive individuals are genuinely salt-sensitive. Balancing sodium with adequate dietary potassium (ideal ratio 1:2) is showing superior clinical outcomes for arterial elasticity.",
    bookmarked: false
  },
  {
    id: 4,
    title: "Rapamycin vs. Metformin: Comparing the Giants of Anti-Aging",
    category: "Longevity Science",
    summary: "A head-to-head comparison of MTOR inhibition vs. AMPK activation. Longevity clinical trials are debating whether combination therapy yields exponential protective gains or increases side effects.",
    date: "June 10, 2026",
    source: "Geroscience Journal",
    readTime: "7 min read",
    content: "Rapamycin acts as a highly selective inhibitor of mTOR (mechanistic target of rapamycin), promoting autophagy and cellular cleanup. Metformin acts as an insulin sensitizer. Together, they represent a double-edged sword: Rapamycin suppresses growth signals while Metformin optimizes energy. Combining low doses shows highly protective synergy in murine studies, with human trials starting soon.",
    bookmarked: true
  }
];

// Initial baseline mock data
const INITIAL_GLUCOSE: GlucoseReading[] = [
  { id: 1, value: 98, timeOfDay: 'Morning', mealContext: 'Fasting', date: '2026-06-17', notes: 'Fasting sugar looking very stable.' },
  { id: 2, value: 135, timeOfDay: 'Afternoon', mealContext: 'After Meal', date: '2026-06-16', notes: 'Post lunch. Had a small carb serving.' },
  { id: 3, value: 104, timeOfDay: 'Evening', mealContext: 'Before Meal', date: '2026-06-16', notes: 'Before dinner. Walked 15 mins.' },
  { id: 4, value: 92, timeOfDay: 'Morning', mealContext: 'Fasting', date: '2026-06-16', notes: 'Woke up feeling refreshed.' },
  { id: 5, value: 112, timeOfDay: 'Evening', mealContext: 'After Meal', date: '2026-06-15', notes: '2h post light dinner.' },
  { id: 6, value: 101, timeOfDay: 'Morning', mealContext: 'Fasting', date: '2026-06-15', notes: 'Steady sleep baseline.' }
];

const INITIAL_BP: BloodPressureReading[] = [
  { id: 1, systolic: 118, diastolic: 79, pulse: 68, timeOfDay: 'Morning', date: '2026-06-17', notes: 'Optimal pressure, hydrated.' },
  { id: 2, systolic: 121, diastolic: 81, pulse: 72, timeOfDay: 'Evening', date: '2026-06-16', notes: 'Slightly elevated post evening workout.' },
  { id: 3, systolic: 116, diastolic: 78, pulse: 65, timeOfDay: 'Morning', date: '2026-06-16', notes: 'Felt very relaxed.' },
  { id: 4, systolic: 124, diastolic: 82, pulse: 70, timeOfDay: 'Evening', date: '2026-06-15', notes: 'Slightly stressed after work.' },
  { id: 5, systolic: 119, diastolic: 77, pulse: 66, timeOfDay: 'Morning', date: '2026-06-15', notes: 'Good sleep recovery.' }
];

const INITIAL_MEDICATIONS: Medication[] = [
  { id: 1, name: 'Metformin', dosage: '500mg', morning: true, evening: true, active: true },
  { id: 2, name: 'Lisinopril', dosage: '10mg', morning: true, evening: false, active: true },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', morning: false, evening: true, active: true },
  { id: 4, name: 'Omega-3 Fish Oil', dosage: '1000mg', morning: true, evening: true, active: true },
  { id: 5, name: 'CoQ10', dosage: '100mg', morning: true, evening: false, active: true }
];

const INITIAL_ADHERENCE: Record<string, { morning: number[]; evening: number[] }> = {
  '2026-06-17': { morning: [1, 2, 4, 5], evening: [] }, 
  '2026-06-16': { morning: [1, 2, 4, 5], evening: [1, 3, 4] }, 
  '2026-06-15': { morning: [1, 2, 4], evening: [1, 3, 4] } 
};

const INITIAL_DOCS: UploadedDocument[] = [
  { id: 1, name: 'Stelo_CGM_Weekly_Trend_2026-06-15.png', type: 'image/png', category: 'Stelo CGM Screenshot', size: '2.1 MB', date: '2026-06-15', status: 'Parsed Successfully', extracted: 'Avg Glucose: 104 mg/dL. Time-in-range: 96%.' },
  { id: 2, name: 'Full_Lipid_Panel_QuestLabs.pdf', type: 'application/pdf', category: 'Lipid Panel', size: '1.4 MB', date: '2026-05-10', status: 'Parsed Successfully', extracted: 'Total Cholesterol: 195 mg/dL, HDL: 48, LDL: 121, Triglycerides: 130.' },
  { id: 3, name: 'Thyroid_TSH_Screening.pdf', type: 'application/pdf', category: 'Thyroid Panel', size: '940 KB', date: '2026-04-12', status: 'Parsed Successfully', extracted: 'TSH: 1.85 mIU/L (Within Optimal Reference 0.45 - 4.5).' }
];

const INITIAL_CHAT: ChatMessage[] = [
  { sender: 'ai', text: 'Hello Mikail! I am Dr. AI, your private, secure medical co-pilot. I have analyzed your health tracker profile: you are 46 years old (born July 23, 1979). I see your active daily medications (Metformin, Lisinopril, Atorvastatin, Omega-3, CoQ10), your latest blood pressure (118/79 mmHg), and your latest glucose readings via the Dexcom Stelo CGM (averaging 104 mg/dL).\n\nHow can I help you today? You can ask about your glucose trends, the interaction of your medications, or your latest Lipid/Thyroid lab results.' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'meds' | 'drai' | 'news' | 'export'>('dashboard');
  const [glucose, setGlucose] = useState<GlucoseReading[]>([]);
  const [bp, setBp] = useState<BloodPressureReading[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [adherence, setAdherence] = useState<Record<string, { morning: number[]; evening: number[] }>>({});
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Initialize state from local storage securely inside useEffect to avoid hydration bugs in Next.js
  useEffect(() => {
    setGlucose(JSON.parse(localStorage.getItem('ht_glucose') || JSON.stringify(INITIAL_GLUCOSE)));
    setBp(JSON.parse(localStorage.getItem('ht_bp') || JSON.stringify(INITIAL_BP)));
    setMedications(JSON.parse(localStorage.getItem('ht_medications') || JSON.stringify(INITIAL_MEDICATIONS)));
    setAdherence(JSON.parse(localStorage.getItem('ht_adherence') || JSON.stringify(INITIAL_ADHERENCE)));
    setDocuments(JSON.parse(localStorage.getItem('ht_docs') || JSON.stringify(INITIAL_DOCS)));
    setChatHistory(JSON.parse(localStorage.getItem('ht_chat') || JSON.stringify(INITIAL_CHAT)));
    setNews(JSON.parse(localStorage.getItem('ht_news') || JSON.stringify(NEWS_ARTICLES)));
  }, []);

  // Sync state mutations to local storage
  useEffect(() => {
    if (glucose.length > 0) localStorage.setItem('ht_glucose', JSON.stringify(glucose));
  }, [glucose]);

  useEffect(() => {
    if (bp.length > 0) localStorage.setItem('ht_bp', JSON.stringify(bp));
  }, [bp]);

  useEffect(() => {
    if (medications.length > 0) localStorage.setItem('ht_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    if (Object.keys(adherence).length > 0) localStorage.setItem('ht_adherence', JSON.stringify(adherence));
  }, [adherence]);

  useEffect(() => {
    if (documents.length > 0) localStorage.setItem('ht_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    if (chatHistory.length > 0) localStorage.setItem('ht_chat', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    if (news.length > 0) localStorage.setItem('ht_news', JSON.stringify(news));
  }, [news]);

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { label: 'Low', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' };
    if (value <= 110) return { label: 'Optimal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    if (value <= 140) return { label: 'Pre-Meal Target', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'High', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' };
  };

  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated', color: 'text-amber-500 bg-amber-50/50 border-amber-200', dot: 'bg-amber-400' };
    if (sys <= 139 || dia <= 89) return { label: 'Hypertension S1', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
    return { label: 'Hypertension S2', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' };
  };

  const latestGlucose = glucose[0] || { value: 104, date: '2026-06-17', notes: '', mealContext: 'Fasting', timeOfDay: 'Morning' };
  const latestBP = bp[0] || { systolic: 118, diastolic: 79, pulse: 68, date: '2026-06-17', notes: '' };

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to reset all data to default values?")) {
      localStorage.clear();
      setGlucose(INITIAL_GLUCOSE);
      setBp(INITIAL_BP);
      setMedications(INITIAL_MEDICATIONS);
      setAdherence(INITIAL_ADHERENCE);
      setDocuments(INITIAL_DOCS);
      setChatHistory(INITIAL_CHAT);
      setNews(NEWS_ARTICLES);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800 bg-slate-950">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg font-bold text-lg">
            HT
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Healty Tracker</h1>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Workspace</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button onClick={() => { setActiveTab('dashboard'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button onClick={() => { setActiveTab('upload'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <UploadCloud className="w-5 h-5" />
            <span>Upload & Logs</span>
          </button>
          <button onClick={() => { setActiveTab('meds'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'meds' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Pill className="w-5 h-5" />
            <span>Medications</span>
          </button>
          <button onClick={() => { setActiveTab('drai'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'drai' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Stethoscope className="w-5 h-5" />
            <span className="flex items-center justify-between w-full">
              <span>Dr. AI Agent</span>
              <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">Online</span>
            </span>
          </button>
          <button onClick={() => { setActiveTab('news'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'news' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Newspaper className="w-5 h-5" />
            <span>Longevity & News</span>
          </button>
          <button onClick={() => { setActiveTab('export'); setSelectedNews(null); }} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'export' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
            <Database className="w-5 h-5" />
            <span>Data & Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Technical Status</div>
          <div className="flex items-center justify-between">
            <span>Prisma Schema Ready</span>
            <span className="text-indigo-400 font-medium">v1.1</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT PORTAL */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-24 md:pb-0 h-screen">
        
        {/* TOP INTEGRATED BANNER */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-md relative overflow-hidden flex-shrink-0">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-200">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                <span>Personal Longevity Hub</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Healty Tracker</h1>
              <p className="text-slate-300 text-sm md:text-base max-w-xl">
                Precision tracking for glucose, blood pressure, split-dose daily medication compliance, and AI coaching.
              </p>
            </div>

            {/* MIKAIL PROFILE CARD */}
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-xl w-full md:w-auto flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-indigo-500 border-2 border-indigo-400 overflow-hidden flex-shrink-0">
                <img 
                  src="/mikail_kocak.png" 
                  alt="Mikail Kocak" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                  }}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">Mikail KOCAK</h2>
                <div className="flex flex-col gap-0.5 mt-0.5 text-xs text-indigo-100">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" /> DOB: 23 July 1979
                  </span>
                  <span className="flex items-center font-semibold text-emerald-300">
                    <User className="w-3.5 h-3.5 mr-1" /> Age: 46 (Longevity Focus)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE SCREEN CONTENT PANEL */}
        <div className="p-4 md:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView 
              glucose={glucose} 
              bp={bp} 
              medications={medications}
              adherence={adherence}
              setAdherence={setAdherence}
              getGlucoseStatus={getGlucoseStatus}
              getBPStatus={getBPStatus}
              latestGlucose={latestGlucose}
              latestBP={latestBP}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'upload' && (
            <UploadView 
              glucose={glucose} 
              setGlucose={setGlucose} 
              bp={bp} 
              setBp={setBp}
              documents={documents}
              setDocuments={setDocuments}
            />
          )}

          {activeTab === 'meds' && (
            <MedicationsView 
              medications={medications}
              setMedications={setMedications}
              adherence={adherence}
              setAdherence={setAdherence}
            />
          )}

          {activeTab === 'drai' && (
            <DrAIView 
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              glucose={glucose}
              bp={bp}
              medications={medications}
            />
          )}

          {activeTab === 'news' && (
            <NewsView 
              news={news}
              setNews={setNews}
              selectedNews={selectedNews}
              setSelectedNews={setSelectedNews}
            />
          )}

          {activeTab === 'export' && (
            <DataExportView 
              glucose={glucose}
              bp={bp}
              medications={medications}
              handleClearAllData={handleClearAllData}
            />
          )}
        </div>

      </main>

      {/* MOBILE NAV BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-slate-400 z-50 flex justify-around py-3 px-2 shadow-2xl">
        <button onClick={() => { setActiveTab('dashboard'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => { setActiveTab('upload'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'upload' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <UploadCloud className="w-5 h-5" />
          <span className="text-[10px]">Upload</span>
        </button>
        <button onClick={() => { setActiveTab('meds'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'meds' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Pill className="w-5 h-5" />
          <span className="text-[10px]">Meds</span>
        </button>
        <button onClick={() => { setActiveTab('drai'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'drai' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Stethoscope className="w-5 h-5" />
          <span className="text-[10px]">Dr. AI</span>
        </button>
        <button onClick={() => { setActiveTab('news'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'news' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Newspaper className="w-5 h-5" />
          <span className="text-[10px]">News</span>
        </button>
        <button onClick={() => { setActiveTab('export'); setSelectedNews(null); }} className={`flex flex-col items-center space-y-1 ${activeTab === 'export' ? 'text-indigo-400' : 'text-slate-500'}`}>
          <Database className="w-5 h-5" />
          <span className="text-[10px]">Data</span>
        </button>
      </nav>

    </div>
  );
}

/* 1. DASHBOARD COMPONENT */
interface DashboardProps {
  glucose: GlucoseReading[];
  bp: BloodPressureReading[];
  medications: Medication[];
  adherence: Record<string, { morning: number[]; evening: number[] }>;
  setAdherence: React.Dispatch<React.SetStateAction<Record<string, { morning: number[]; evening: number[] }>>>;
  getGlucoseStatus: (val: number) => { label: string; color: string; dot: string };
  getBPStatus: (sys: number, dia: number) => { label: string; color: string; dot: string };
  latestGlucose: any;
  latestBP: any;
  setActiveTab: (tab: any) => void;
}

function DashboardView({ glucose, bp, medications, adherence, setAdherence, getGlucoseStatus, getBPStatus, latestGlucose, latestBP, setActiveTab }: DashboardProps) {
  const todayStr = '2026-06-17';
  const activeMedsCount = medications.filter(m => m.active).length;
  const morningMeds = medications.filter(m => m.active && m.morning);
  const eveningMeds = medications.filter(m => m.active && m.evening);

  const todayAdherence = adherence[todayStr] || { morning: [], evening: [] };
  const totalMedsSlots = morningMeds.length + eveningMeds.length;
  const takenSlots = todayAdherence.morning.length + todayAdherence.evening.length;
  const compliancePct = totalMedsSlots > 0 ? Math.round((takenSlots / totalMedsSlots) * 100) : 100;

  const handleToggleQuickAdherence = (medId: number, timeOfDay: 'morning' | 'evening') => {
    const currentDay = todayAdherence;
    let newTimeList = [...currentDay[timeOfDay]];
    
    if (newTimeList.includes(medId)) {
      newTimeList = newTimeList.filter(id => id !== medId);
    } else {
      newTimeList.push(medId);
    }

    setAdherence(prev => ({
      ...prev,
      [todayStr]: {
        ...currentDay,
        [timeOfDay]: newTimeList
      }
    }));
  };

  const avgGlucose = useMemo(() => {
    if (glucose.length === 0) return 0;
    return Math.round(glucose.reduce((sum, r) => sum + Number(r.value), 0) / glucose.length);
  }, [glucose]);

  const optimalGlucoseCount = useMemo(() => {
    return glucose.filter(g => getGlucoseStatus(Number(g.value)).label === 'Optimal').length;
  }, [glucose, getGlucoseStatus]);

  const timeInOptimalRange = glucose.length > 0 
    ? Math.round((optimalGlucoseCount / glucose.length) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* GLUCOSE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Glucose (Stelo CGM)</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                {latestGlucose.value || '--'} <span className="text-sm font-medium text-slate-400">mg/dL</span>
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Droplet className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getGlucoseStatus(Number(latestGlucose.value)).dot}`}></span>
              <span className="text-xs font-bold text-slate-700">{getGlucoseStatus(Number(latestGlucose.value)).label}</span>
            </div>
            <span className="text-[11px] text-slate-400 italic">
              {latestGlucose.timeOfDay ? `${latestGlucose.timeOfDay} • ${latestGlucose.mealContext}` : 'No readings'}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Weekly Avg: <strong>{avgGlucose} mg/dL</strong></span>
            <span className="text-emerald-600 font-semibold">TIR: {timeInOptimalRange}%</span>
          </div>
        </div>

        {/* BLOOD PRESSURE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Blood Pressure Vitals</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                {latestBP.systolic}/{latestBP.diastolic} <span className="text-xs font-medium text-slate-400">mmHg</span>
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${getBPStatus(Number(latestBP.systolic), Number(latestBP.diastolic)).dot}`}></span>
              <span className="text-xs font-bold text-slate-700">{getBPStatus(Number(latestBP.systolic), Number(latestBP.diastolic)).label}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Pulse: <strong>{latestBP.pulse}</strong> bpm
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Target: <strong>&lt; 120/80 mmHg</strong></span>
            <span className="text-slate-400">{latestBP.date}</span>
          </div>
        </div>

        {/* MED COMPLIANCE */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Medications Adherence</span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
                {takenSlots}/{totalMedsSlots} <span className="text-xs font-medium text-slate-400">taken</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <Pill className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
              <span>Today's Completion</span>
              <span className="font-bold text-indigo-600">{compliancePct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${compliancePct}%` }}></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Active Regimens: <strong>{activeMedsCount}</strong></span>
            <button onClick={() => setActiveTab('meds')} className="text-indigo-600 font-bold hover:underline flex items-center space-x-1">
              <span>Manage Meds</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TIME PATTERNS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">Time-of-Day Pattern Analysis</h4>
                <p className="text-xs text-slate-400 mt-0.5">Historical averages segmented by meal timings.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                <Clock className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">Morning</div>
                <div className="text-xl font-black text-slate-800 mt-1">96 mg/dL</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                <Clock className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">Afternoon</div>
                <div className="text-xl font-black text-slate-800 mt-1">118 mg/dL</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                <Clock className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                <div className="text-xs font-bold text-slate-400 uppercase">Evening</div>
                <div className="text-xl font-black text-slate-800 mt-1">108 mg/dL</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-4">Recent Vitals Log Entries</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-2">Date / Time</th>
                    <th className="pb-2">Glucose Level</th>
                    <th className="pb-2">Meal Context</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {glucose.slice(0, 4).map((g) => {
                    const status = getGlucoseStatus(Number(g.value));
                    return (
                      <tr key={g.id}>
                        <td className="py-2.5 font-semibold text-slate-600">{g.date} ({g.timeOfDay})</td>
                        <td className="py-2.5 font-extrabold text-slate-800">{g.value} mg/dL</td>
                        <td className="py-2.5"><span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium text-[10px]">{g.mealContext}</span></td>
                        <td className="py-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status.color}`}>{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MED CHECKLIST */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h4 className="text-base font-bold text-slate-900 mb-4">Today's Quick Med Intake</h4>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1.5">☀️ Morning Day Routine</span>
                {morningMeds.map(med => {
                  const taken = todayAdherence.morning.includes(Number(med.id));
                  return (
                    <div 
                      key={`m-${med.id}`}
                      onClick={() => handleToggleQuickAdherence(Number(med.id), 'morning')}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer mb-1.5 ${taken ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <span className="text-xs font-semibold text-slate-700">{med.name} ({med.dosage})</span>
                      {taken && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500 block mb-1.5">🌙 Evening Night Routine</span>
                {eveningMeds.map(med => {
                  const taken = todayAdherence.evening.includes(Number(med.id));
                  return (
                    <div 
                      key={`e-${med.id}`}
                      onClick={() => handleToggleQuickAdherence(Number(med.id), 'evening')}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer mb-1.5 ${taken ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <span className="text-xs font-semibold text-slate-700">{med.name} ({med.dosage})</span>
                      {taken && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* 2. UPLOAD VIEW */
interface UploadProps {
  glucose: GlucoseReading[];
  setGlucose: React.Dispatch<React.SetStateAction<GlucoseReading[]>>;
  bp: BloodPressureReading[];
  setBp: React.Dispatch<React.SetStateAction<BloodPressureReading[]>>;
  documents: UploadedDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<UploadedDocument[]>>;
}

function UploadView({ glucose, setGlucose, bp, setBp, documents, setDocuments }: UploadProps) {
  const [glValue, setGlValue] = useState('105');
  const [glTime, setGlTime] = useState('Morning');
  const [glContext, setGlContext] = useState('Fasting');
  const [glNotes, setGlNotes] = useState('');

  const [bpSys, setBpSys] = useState('118');
  const [bpDia, setBpDia] = useState('78');
  const [bpPulse, setBpPulse] = useState('68');
  const [bpTime, setBpTime] = useState('Morning');

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAddGlucose = (e: FormEvent) => {
    e.preventDefault();
    const newR: GlucoseReading = {
      id: Date.now(),
      value: parseInt(glValue),
      timeOfDay: glTime,
      mealContext: glContext,
      date: '2026-06-17',
      notes: glNotes
    };
    setGlucose([newR, ...glucose]);
    setGlNotes('');
    alert('Logged successfully!');
  };

  const handleAddBP = (e: FormEvent) => {
    e.preventDefault();
    const newR: BloodPressureReading = {
      id: Date.now(),
      systolic: parseInt(bpSys),
      diastolic: parseInt(bpDia),
      pulse: parseInt(bpPulse),
      timeOfDay: bpTime,
      date: '2026-06-17',
      notes: ''
    };
    setBp([newR, ...bp]);
    alert('Logged successfully!');
  };

  const triggerSteloUpload = () => {
    setSelectedFile({ name: 'Stelo_CGM_Screenshot_June_17.png', size: '1.2 MB' });
    setIsUploading(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isUploading && progress < 100) {
      const timer = setTimeout(() => setProgress(prev => prev + 25), 300);
      return () => clearTimeout(timer);
    } else if (isUploading && progress === 100) {
      const timer = setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        
        const newD: UploadedDocument = {
          id: Date.now(),
          name: 'Stelo_CGM_Screenshot_June_17.png',
          type: 'image/png',
          category: 'Stelo CGM Screenshot',
          size: '1.2 MB',
          date: '2026-06-17',
          status: 'Parsed Successfully',
          extracted: 'Avg Glucose: 105 mg/dL. Fasting state normal.'
        };
        setDocuments([newD, ...documents]);

        setGlucose([{
          id: Date.now() + 1,
          value: 105,
          timeOfDay: 'Morning',
          mealContext: 'Fasting',
          date: '2026-06-17',
          notes: 'Extracted from Stelo CGM screenshot OCR.'
        }, ...glucose]);
        alert('Stelo Screenshot parsed and metrics added successfully!');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUploading, progress]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <UploadCloud className="text-indigo-600" />
          <span>OCR Laboratory PDF / Stelo Screenshot</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Upload report files or click below to simulate an instantaneous OCR read from a Stelo CGM screenshot.
        </p>

        <div className="border-2 border-dashed border-slate-200 p-6 text-center bg-slate-50/50 rounded-2xl flex flex-col items-center">
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-slate-700">Drag images or PDF reports here</span>
          <button onClick={triggerSteloUpload} className="mt-3 px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-xl text-indigo-600 hover:bg-slate-50">
            Simulate Stelo Upload
          </button>
        </div>

        {isUploading && (
          <div className="bg-slate-900 text-white rounded-xl p-3 text-xs font-mono">
            <div>OCR Status: Parsing files... {progress}%</div>
            <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700">Uploaded Documents</h4>
          {documents.map(doc => (
            <div key={doc.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-800">{doc.name}</span>
                <p className="text-[10px] text-slate-400">{doc.category} • {doc.size}</p>
                <p className="text-[10px] italic text-slate-600 mt-1">{doc.extracted}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[10px] font-bold">PARSED</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Droplet className="text-indigo-600" />
            <span>Manually Log Glucose</span>
          </h3>
          <form onSubmit={handleAddGlucose} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-500">Value (mg/dL)</label>
                <input type="number" required value={glValue} onChange={e => setGlValue(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl text-sm font-bold focus:outline-indigo-500" />
              </div>
              <div>
                <label className="font-semibold text-slate-500">Time frame</label>
                <select value={glTime} onChange={e => setGlTime(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl font-semibold focus:outline-indigo-500 bg-white">
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-500">Meal Context</label>
                <select value={glContext} onChange={e => setGlContext(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl font-semibold focus:outline-indigo-500 bg-white">
                  <option value="Fasting">Fasting</option>
                  <option value="Before Meal">Before Meal</option>
                  <option value="After Meal">After Meal</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-500">Notes</label>
                <input type="text" value={glNotes} onChange={e => setGlNotes(e.target.value)} placeholder="Feelings, food triggers" className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl focus:outline-indigo-500" />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700">
              Save Glucose reading
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Heart className="text-red-500" />
            <span>Manually Log BP</span>
          </h3>
          <form onSubmit={handleAddBP} className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-500">Systolic</label>
                <input type="number" required value={bpSys} onChange={e => setBpSys(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl text-sm font-bold focus:outline-indigo-500" />
              </div>
              <div>
                <label className="font-semibold text-slate-500">Diastolic</label>
                <input type="number" required value={bpDia} onChange={e => setBpDia(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl text-sm font-bold focus:outline-indigo-500" />
              </div>
              <div>
                <label className="font-semibold text-slate-500">Pulse</label>
                <input type="number" required value={bpPulse} onChange={e => setBpPulse(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl text-sm font-bold focus:outline-indigo-500" />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-500">Timing</label>
              <select value={bpTime} onChange={e => setBpTime(e.target.value)} className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl font-semibold focus:outline-indigo-500 bg-white">
                <option value="Morning">Morning (Fasting)</option>
                <option value="Evening">Evening (Resting)</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700">
              Save BP vital
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}

/* 3. MEDICATIONS VIEW */
interface MedsProps {
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  adherence: Record<string, { morning: number[]; evening: number[] }>;
  setAdherence: React.Dispatch<React.SetStateAction<Record<string, { morning: number[]; evening: number[] }>>>;
}

function MedicationsView({ medications, setMedications }: MedsProps) {
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medMorning, setMedMorning] = useState(true);
  const [medEvening, setMedEvening] = useState(true);

  const handleAddMed = (e: FormEvent) => {
    e.preventDefault();
    if (!medName || !medDosage) return;

    const newMed: Medication = {
      id: Date.now(),
      name: medName,
      dosage: medDosage,
      morning: medMorning,
      evening: medEvening,
      active: true
    };
    setMedications([...medications, newMed]);
    setMedName('');
    setMedDosage('');
    alert('Medication added!');
  };

  const toggleMed = (id: number) => {
    setMedications(medications.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Current Medications</h3>
        <div className="space-y-2">
          {medications.map(m => (
            <div key={m.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-800">{m.name} ({m.dosage})</span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Timings: {m.morning ? '☀️ Morning' : ''} {m.evening ? '🌙 Evening' : ''}
                </p>
              </div>
              <button onClick={() => toggleMed(m.id)} className={`px-2 py-1 rounded text-[10px] font-bold ${m.active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'}`}>
                {m.active ? 'Active' : 'Paused'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Register Medication</h3>
        <form onSubmit={handleAddMed} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-500">Medication Name</label>
            <input type="text" required value={medName} onChange={e => setMedName(e.target.value)} placeholder="Metformin" className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl focus:outline-indigo-500" />
          </div>
          <div>
            <label className="font-semibold text-slate-500">Dosage</label>
            <input type="text" required value={medDosage} onChange={e => setMedDosage(e.target.value)} placeholder="500mg" className="w-full mt-1 border border-slate-200 p-2.5 rounded-xl focus:outline-indigo-500" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={medMorning} onChange={e => setMedMorning(e.target.checked)} className="rounded" />
              <span>☀️ Morning</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={medEvening} onChange={e => setMedEvening(e.target.checked)} className="rounded" />
              <span>🌙 Evening</span>
            </label>
          </div>
          <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700">
            Save Medication
          </button>
        </form>
      </div>
    </div>
  );
}

/* 4. DR. AI CHAT */
interface ChatProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  glucose: GlucoseReading[];
  bp: BloodPressureReading[];
  medications: Medication[];
}

function DrAIView({ chatHistory, setChatHistory, glucose, bp, medications }: ChatProps) {
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userText = userInput;
    const currentHist = [...chatHistory, { sender: 'user', text: userText } as ChatMessage];
    setChatHistory(currentHist);
    setUserInput('');
    setIsThinking(true);

    setTimeout(() => {
      let aiReply = '';
      const q = userText.toLowerCase();

      if (q.includes('sugar') || q.includes('glucose') || q.includes('stelo')) {
        aiReply = `Hello Mikail! Your current Dexcom Stelo CGM reads an average baseline of **${glucose[0]?.value || 104} mg/dL**. This is optimal for metabolic longevity. Since you take Metformin daily, your insulin sensitivity is highly supported.`;
      } else if (q.includes('bp') || q.includes('blood pressure')) {
        aiReply = `Hi Mikail. Regarding blood pressure: your last logged reading is **${bp[0]?.systolic || 118}/${bp[0]?.diastolic || 79} mmHg**. This falls into the **Normal** range. Your Lisinopril protocol is showing excellent clinical control.`;
      } else {
        aiReply = `Hello Mikail Kocak! I am analyzing your comprehensive health dossier (Age 46, latest BP: ${bp[0]?.systolic || 118}/${bp[0]?.diastolic || 79} mmHg, Stelo Glucose: ${glucose[0]?.value || 104} mg/dL). How can I help you optimize your metabolic longevity today?`;
      }

      aiReply += `\n\n*Disclaimer: I am Dr. AI, your digital health advisor. Always discuss clinical findings with your actual primary physician.*`;

      setChatHistory([...currentHist, { sender: 'ai', text: aiReply }]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[500px]">
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-bold">Dr. AI Consultation Agent</span>
        </div>
        <span className="text-[10px] bg-indigo-500 px-2 py-0.5 rounded-full uppercase">Synced Context</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && <div className="text-xs text-slate-400 animate-pulse">Dr. AI is analyzing...</div>}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Ask Dr. AI..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none" />
        <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold">
          Send
        </button>
      </form>
    </div>
  );
}

/* 5. NEWS VIEW */
interface NewsProps {
  news: NewsArticle[];
  setNews: React.Dispatch<React.SetStateAction<NewsArticle[]>>;
  selectedNews: NewsArticle | null;
  setSelectedNews: React.Dispatch<React.SetStateAction<NewsArticle | null>>;
}

function NewsView({ news, setNews, selectedNews, setSelectedNews }: NewsProps) {
  const handleToggleBookmark = (id: number, e: MouseEvent) => {
    e.stopPropagation();
    setNews(news.map(art => art.id === id ? { ...art, bookmarked: !art.bookmarked } : art));
  };

  return (
    <div className="space-y-4">
      {selectedNews ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-4">
          <button onClick={() => setSelectedNews(null)} className="px-3 py-1 bg-slate-100 text-xs font-bold rounded-xl text-slate-700">← Back</button>
          <h3 className="text-xl font-black">{selectedNews.title}</h3>
          <p className="text-xs text-slate-500">{selectedNews.source} • {selectedNews.date}</p>
          <div className="text-xs text-slate-700 leading-relaxed pt-3 border-t border-slate-100 whitespace-pre-line font-medium">{selectedNews.content}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map(art => (
            <div key={art.id} onClick={() => setSelectedNews(art)} className="bg-white p-4 rounded-3xl border border-slate-200/80 cursor-pointer space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">{art.category}</span>
                <span onClick={e => handleToggleBookmark(art.id, e)} className="text-xs">{art.bookmarked ? '★' : '☆'}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{art.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{art.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 6. DATA EXPORT VIEW */
interface ExportProps {
  glucose: GlucoseReading[];
  bp: BloodPressureReading[];
  medications: Medication[];
  handleClearAllData: () => void;
}

function DataExportView({ glucose, bp, medications, handleClearAllData }: ExportProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Health Record Report</h3>
          <span className="text-xs text-slate-400">DOB: 23-July-1979 • Mikail KOCAK</span>
        </div>
        <button onClick={() => window.print()} className="px-3 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700">
          Print or Save PDF
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <h4 className="font-bold text-slate-800 uppercase mb-2">1. Blood Glucose History</h4>
          <table className="w-full text-left bg-slate-50 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-100 text-slate-500 font-bold">
                <th className="p-2">Date</th>
                <th className="p-2">Value</th>
                <th className="p-2">Context</th>
              </tr>
            </thead>
            <tbody>
              {glucose.map(g => (
                <tr key={g.id} className="border-t border-slate-100">
                  <td className="p-2">{g.date}</td>
                  <td className="p-2 font-bold">{g.value} mg/dL</td>
                  <td className="p-2">{g.timeOfDay} • {g.mealContext}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 uppercase mb-2">2. Blood Pressure History</h4>
          <table className="w-full text-left bg-slate-50 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-100 text-slate-500 font-bold">
                <th className="p-2">Date</th>
                <th className="p-2">BP Reading</th>
                <th className="p-2">Pulse</th>
              </tr>
            </thead>
            <tbody>
              {bp.map(b => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="p-2">{b.date}</td>
                  <td className="p-2 font-bold">{b.systolic}/{b.diastolic} mmHg</td>
                  <td className="p-2">{b.pulse} bpm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button onClick={handleClearAllData} className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl hover:bg-rose-100">
          Reset all local storage data
        </button>
      </div>
    </div>
  );
}
