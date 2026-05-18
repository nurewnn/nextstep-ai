import React, { useState, useRef } from "react";
import { ActionBoard } from "./components/ActionBoard";
import { MeetingType, NextStepResponse } from "./types";
import { analyzeMeeting } from "./lib/gemini";
import { fileToBase64, cn } from "./lib/utils";
import { 
  Briefcase, 
  Users, 
  Lightbulb, 
  Presentation, 
  TrendingUp, 
  GraduationCap,
  Upload,
  X,
  Loader2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MEETING_TYPES: { type: MeetingType; icon: React.ElementType; theme: string; example: string }[] = [
  { type: "Team Update", icon: Users, theme: "blue", example: "Discussed Q3 goals. Marketing needs extra week. Sarah owns new campaign." },
  { type: "Product Sync", icon: Briefcase, theme: "indigo", example: "Release v2.4 blocked by auth bug. John fixing by Friday. Delay launch to Monday." },
  { type: "Brainstorming", icon: Lightbulb, theme: "orange", example: "Ideas for new onboarding: gamification, skip button, video tutorial." },
  { type: "Client Meeting", icon: Presentation, theme: "emerald", example: "Milan client liked the AI features but pricing too high. Send new quote." },
  { type: "Investor Meeting", icon: TrendingUp, theme: "slate", example: "Seed round pitch. Asked about CAC payback period. Need cohort data by next week." },
  { type: "Student Project", icon: GraduationCap, theme: "rose", example: "Biology poster due next week. Matt doing research, I'm doing design." },
];

export default function App() {
  const [meetingType, setMeetingType] = useState<MeetingType>("Team Update");
  const [textInput, setTextInput] = useState("");
  const [files, setFiles] = useState<{file: File, id: string}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NextStepResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTheme = MEETING_TYPES.find(m => m.type === meetingType)?.theme || "slate";
  
  const getThemeClasses = (element: "bg" | "text" | "border" | "ring" | "btn") => {
    const map: Record<string, Record<string, string>> = {
      blue: { bg: "bg-[#70D6FF]", text: "text-[#1A1A1A]", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#70D6FF] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A] hover:bg-[#5bc0e6] active:scale-95 transition-transform" },
      indigo: { bg: "bg-[#9B5DE5]", text: "text-[#1A1A1A]", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#9B5DE5] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-white hover:bg-[#854ac4] active:scale-95 transition-transform" },
      orange: { bg: "bg-[#FFD670]", text: "text-[#1A1A1A]", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#FFD670] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A] hover:bg-[#eac45f] active:scale-95 transition-transform" },
      emerald: { bg: "bg-[#00F5D4]", text: "text-[#1A1A1A]", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#00F5D4] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A] hover:bg-[#00e3c5] active:scale-95 transition-transform" },
      slate: { bg: "bg-[#1A1A1A]", text: "text-white", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#1A1A1A] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-white hover:bg-[#333] active:scale-95 transition-transform" },
      rose: { bg: "bg-[#FF70A6]", text: "text-[#1A1A1A]", border: "border-[#1A1A1A]", ring: "ring-[#1A1A1A]", btn: "bg-[#FF70A6] border-4 border-[#1A1A1A] shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A] hover:bg-[#ef5f95] active:scale-95 transition-transform" },
    };
    return map[activeTheme][element] || "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substring(7)
      }));
      setFiles(prev => [...prev, ...newFiles].slice(0, 5)); // max 5 files
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleAnalyze = async () => {
    if (!textInput.trim() && files.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const base64Files = await Promise.all(
        files.map(async ({file}) => ({
          mimeType: file.type,
          data: await fileToBase64(file)
        }))
      );
      
      const response = await analyzeMeeting(meetingType, textInput, base64Files);
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze meeting. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] font-sans flex flex-col md:flex-row overflow-hidden text-[#1A1A1A]">
      
      {/* Left Panel: Input Area */}
      <div className={cn("w-full md:w-[480px] lg:w-[500px] shrink-0 border-r-4 border-[#1A1A1A] flex flex-col h-screen overflow-y-auto transition-colors duration-500 z-10 p-10", getThemeClasses("bg"))}>
        <div className="pb-8">
          <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] mb-2 drop-shadow-sm" style={{ color: meetingType === "Investor Meeting" ? "#fff" : "#1A1A1A" }}>NextStep AI</h1>
          <p className="font-bold text-lg opacity-80" style={{ color: meetingType === "Investor Meeting" ? "#fff" : "#1A1A1A" }}>Convert messy meeting inputs into a clear execution plan.</p>
        </div>

        <div className="flex-1 space-y-8">
          
          {/* Meeting Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest block" style={{ color: meetingType === "Investor Meeting" || meetingType === "Product Sync" ? "#fff" : "#1A1A1A" }}>1. Select Meeting Type</label>
            <div className="grid grid-cols-2 gap-3">
              {MEETING_TYPES.map(({ type, icon: Icon, theme }) => (
                <button
                  key={type}
                  onClick={() => setMeetingType(type)}
                  className={cn(
                    "flex items-center gap-2 p-3 text-sm font-bold rounded-2xl border-4 text-left transition-all",
                    meetingType === type 
                      ? `border-[#1A1A1A] bg-[#FFFBEB] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A]` 
                      : "border-transparent bg-white/40 text-[#1A1A1A] hover:bg-white hover:border-[#1A1A1A] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="space-y-3 flex-1 flex flex-col">
            <label className="text-sm font-black uppercase tracking-widest block" style={{ color: meetingType === "Investor Meeting" || meetingType === "Product Sync" ? "#fff" : "#1A1A1A" }}>2. Input Notes or Images</label>
            
            <div className="relative flex-1 min-h-[240px] flex flex-col bg-[#FFFBEB] rounded-[24px] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] overflow-hidden focus-within:-translate-y-1 focus-within:-translate-x-1 focus-within:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all group">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Example: ${MEETING_TYPES.find(m => m.type === meetingType)?.example || "Paste meeting notes here..."}`}
                className="w-full flex-1 p-6 resize-none outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 bg-transparent font-medium"
              />
              
              {/* File Attachments Area */}
              {files.length > 0 && (
                <div className="p-4 border-t-4 border-[#1A1A1A] bg-white flex flex-wrap gap-2">
                  <AnimatePresence>
                    {files.map(f => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={f.id} 
                        className="flex items-center gap-2 bg-[#FFD670] border-2 border-[#1A1A1A] rounded-xl px-3 py-1.5 text-sm shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] max-w-[160px]"
                      >
                        <FileText className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                        <span className="truncate text-[#1A1A1A] font-bold">{f.file.name}</span>
                        <button onClick={() => removeFile(f.id)} className="p-0.5 hover:bg-white rounded-full text-[#1A1A1A] border-2 border-transparent hover:border-[#1A1A1A] transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="p-4 border-t-4 border-[#1A1A1A] flex justify-between items-center bg-[#FF70A6]">
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-black px-4 py-2 rounded-full border-2 border-transparent text-[#1A1A1A] hover:bg-white hover:border-[#1A1A1A] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                  ATTACH FILES
                </button>
                <span className="text-sm font-bold opacity-80">{textInput.length} chars</span>
              </div>
            </div>
            
            {error && <p className="text-rose-500 font-bold bg-white px-3 py-1 rounded-lg border-2 border-rose-500 w-fit">{error}</p>}
          </div>

          <div className="pt-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!textInput.trim() && files.length === 0)}
              className={cn(
                "w-full py-5 px-6 rounded-full font-black text-xl flex items-center justify-center gap-2 transition-all duration-200",
                isAnalyzing ? "opacity-70 cursor-not-allowed bg-white border-[#1A1A1A] border-4 text-[#1A1A1A]" : getThemeClasses("btn"),
                (!textInput.trim() && files.length === 0) && "opacity-50 cursor-not-allowed bg-white border-[#1A1A1A] border-4 text-[#1A1A1A] shadow-none hover:translate-y-0 hover:translate-x-0"
              )}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>TURN INTO NEXT STEPS</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Output Area */}
      <div className="flex-1 h-screen overflow-y-auto relative bg-[#FFFBEB]">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
            >
              <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center mb-8 border-4 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]", getThemeClasses("bg"), getThemeClasses("text"), getThemeClasses("border"))}>
                <Lightbulb className="w-16 h-16" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] mb-4">Ready for some fun?</h2>
              <p className="text-[#1A1A1A] font-bold opacity-80 max-w-md text-xl">Enter your meeting notes, or upload a whiteboard photo/PDF, and Gemini will generate a complete action plan.</p>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10"
            >
              <Loader2 className="w-16 h-16 animate-spin text-[#9B5DE5] mb-8" />
              <h2 className="text-3xl font-black tracking-tighter text-[#1A1A1A] mb-2">Architecting Action Plan...</h2>
              <p className="font-bold opacity-80 text-xl">Gemini is finding owners, risks, and next steps.</p>
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 w-full"
            >
              <ActionBoard data={result} theme={activeTheme} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
