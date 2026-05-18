import React, { useState, useEffect } from "react";
import { NextStepResponse } from "../types";
import { 
  CheckCircle2, 
  Calendar, 
  Mail, 
  AlertTriangle, 
  Lightbulb, 
  FileQuestion,
  UserCircle2,
  Clock,
  ThumbsUp,
  Activity,
  Edit2,
  Save
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface ActionBoardProps {
  data: NextStepResponse;
  theme: string;
}

export function ActionBoard({ data, theme }: ActionBoardProps) {
  const [tasks, setTasks] = useState(data.taskBoard);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setTasks(data.taskBoard);
    setEditingIndex(null);
  }, [data.taskBoard]);

  const handleTaskChange = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const getThemePalette = () => {
    const themes: Record<string, string> = {
      blue: "bg-[#70D6FF]",
      indigo: "bg-[#9B5DE5]",
      orange: "bg-[#FFD670]",
      emerald: "bg-[#00F5D4]",
      slate: "bg-[#1A1A1A] text-white",
      rose: "bg-[#FF70A6]",
    };
    return themes[theme] || "bg-[#70D6FF]";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-[#00F5D4] text-[#1A1A1A]";
    if (score >= 50) return "bg-[#FFD670] text-[#1A1A1A]";
    return "bg-[#FF70A6] text-[#1A1A1A]";
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return "bg-[#FF70A6] border-2 border-[#1A1A1A] text-[#1A1A1A]";
      case 'medium': return "bg-[#FFD670] border-2 border-[#1A1A1A] text-[#1A1A1A]";
      case 'low': return "bg-[#00F5D4] border-2 border-[#1A1A1A] text-[#1A1A1A]";
      default: return "bg-white border-2 border-[#1A1A1A]";
    }
  };

  const scoreClass = getScoreColor(data.executionReadinessScore);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-20">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
      >
        <div className="space-y-4 flex-1">
          <div className="inline-block px-4 py-1.5 rounded-full border-4 border-[#1A1A1A] bg-white font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            {data.meetingType || "Meeting Overview"}
          </div>
          <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A] drop-shadow-sm">
            Action Board
          </h2>
          <p className="text-[#1A1A1A] font-bold text-xl opacity-80 max-w-2xl leading-relaxed">{data.summary}</p>
        </div>
        
        <div className={cn("shrink-0 flex flex-col items-center justify-center p-6 border-4 border-[#1A1A1A] rounded-[32px] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] min-w-[200px] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all", scoreClass)}>
          <div className="font-bold uppercase tracking-widest text-sm mb-2 opacity-80">Readiness</div>
          <div className="text-7xl font-black tracking-tighter mb-2">{data.executionReadinessScore}</div>
          <div className="font-bold text-sm text-center max-w-[160px]">{data.scoreReason}</div>
        </div>
      </motion.div>

      {/* Decisions */}
      {data.decisions && data.decisions.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn("rounded-[32px] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] p-8", getThemePalette())}
        >
          <div className="flex items-center gap-3 mb-6">
            <ThumbsUp className="w-8 h-8" />
            <h3 className="text-2xl font-black tracking-tight uppercase">Key Decisions</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.decisions.map((decision, idx) => (
              <li key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-white border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-[#1A1A1A]">
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                <span className="font-bold text-lg">{decision}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {/* Task Board */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3 text-[#1A1A1A] px-2">
          <Activity className="w-8 h-8" />
          <h3 className="text-3xl font-black tracking-tight uppercase">Task Board</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, idx) => {
            const isEditing = editingIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-[24px] border-4 border-[#1A1A1A] p-6 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] transition-all flex flex-col relative group">
                <button 
                  onClick={() => setEditingIndex(isEditing ? null : idx)}
                  className="absolute top-4 right-4 p-2 rounded-full border-2 border-transparent hover:border-[#1A1A1A] hover:bg-[#FFFBEB] text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:border-[#1A1A1A]"
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>

                <div className="flex justify-between items-start mb-6 pr-10">
                  {isEditing ? (
                    <select 
                      value={task.priority} 
                      onChange={(e) => handleTaskChange(idx, 'priority', e.target.value)}
                      className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg border-2 border-[#1A1A1A] bg-white outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                    >
                      <option value="High">HIGH</option>
                      <option value="Medium">MEDIUM</option>
                      <option value="Low">LOW</option>
                    </select>
                  ) : (
                    <span className={cn("text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full", getPriorityClasses(task.priority))}>
                      {task.priority}
                    </span>
                  )}

                  {isEditing ? (
                    <select 
                      value={task.status} 
                      onChange={(e) => handleTaskChange(idx, 'status', e.target.value)}
                      className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg border-2 border-[#1A1A1A] bg-white outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                    >
                      <option value="To Do">TO DO</option>
                      <option value="In Progress">IN PROGRESS</option>
                      <option value="Done">DONE</option>
                    </select>
                  ) : (
                    <span className="text-xs font-black uppercase tracking-widest bg-[#1A1A1A] text-white px-3 py-1.5 rounded-full">
                      {task.status}
                    </span>
                  )}
                </div>
                
                {isEditing ? (
                  <textarea 
                    value={task.task}
                    onChange={(e) => handleTaskChange(idx, 'task', e.target.value)}
                    className="font-bold text-lg text-[#1A1A1A] mb-6 flex-1 w-full border-2 border-[#1A1A1A] rounded-xl p-2 outline-none focus:ring-2 focus:ring-[#1A1A1A] resize-none min-h-[100px]"
                  />
                ) : (
                  <h4 className="font-bold text-xl text-[#1A1A1A] mb-8 leading-snug flex-1">{task.task}</h4>
                )}

                <div className="flex flex-col gap-3 text-sm border-t-4 border-[#1A1A1A] pt-4 mt-auto">
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <UserCircle2 className="w-5 h-5 opacity-80" />
                    {isEditing ? (
                      <input 
                        value={task.owner}
                        onChange={(e) => handleTaskChange(idx, 'owner', e.target.value)}
                        className="flex-1 w-full border-2 border-[#1A1A1A] rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#1A1A1A] font-bold"
                      />
                    ) : (
                      <span className="font-black uppercase tracking-widest">{task.owner}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[#1A1A1A]">
                    <Clock className="w-5 h-5 opacity-80" />
                    {isEditing ? (
                      <input 
                        value={task.deadline}
                        onChange={(e) => handleTaskChange(idx, 'deadline', e.target.value)}
                        className="flex-1 w-full border-2 border-[#1A1A1A] rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#1A1A1A] font-bold"
                      />
                    ) : (
                      <span className={cn("font-bold", task.deadline.toLowerCase() === 'not specified' ? 'text-rose-500' : '')}>
                        {task.deadline}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Action Plan */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[32px] border-4 border-[#1A1A1A] p-10 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] bg-white"
      >
        <div className="flex items-center gap-3 text-[#1A1A1A] mb-10">
          <h3 className="text-3xl font-black tracking-tight uppercase">Step-by-Step Action Plan</h3>
        </div>
        <div className="space-y-4 md:pl-4">
          {data.stepByStepActionPlan.map((step, idx) => (
            <div key={idx} className="relative flex gap-6 group">
              <div className="flex flex-col items-center z-10 pt-2">
                <div className="w-12 h-12 rounded-[16px] bg-[#1A1A1A] text-white flex items-center justify-center font-black text-xl shrink-0 border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(255,214,112,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(112,214,255,1)] transition-colors">
                  {step.step}
                </div>
                {idx !== data.stepByStepActionPlan.length - 1 && (
                  <div className="w-1 h-full absolute top-14 left-5.5 bg-[#1A1A1A]" />
                )}
              </div>
              <div className="pb-10 flex-1">
                <div className="bg-[#FFFBEB] rounded-2xl border-4 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] transition-all">
                  <h4 className="text-xl font-black text-[#1A1A1A]">{step.title}</h4>
                  <p className="font-bold text-lg mt-2 text-[#1A1A1A]/80 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Risk, Missing Info, Solutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-[32px] border-4 border-[#1A1A1A] bg-[#FF70A6] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] flex flex-col text-[#1A1A1A]"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-7 h-7" />
            <h3 className="text-xl font-black uppercase">Risks & Issues</h3>
          </div>
          <ul className="space-y-4 flex-1">
            {data.issuesDetected.map((issue, idx) => (
              <li key={idx} className="bg-white rounded-2xl p-5 border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-lg leading-tight">{issue.issue}</h4>
                  {issue.severity === 'High' && <span className="flex w-4 h-4 rounded-full bg-rose-500 mt-1 shrink-0 border-2 border-[#1A1A1A]" />}
                </div>
                <p className="font-bold opacity-80 leading-snug">{issue.whyItMatters}</p>
              </li>
            ))}
            {data.issuesDetected.length === 0 && (
              <p className="font-bold text-xl p-4 bg-white/50 rounded-2xl border-4 border-[#1A1A1A] text-center">No significant risks detected.</p>
            )}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-[32px] border-4 border-[#1A1A1A] bg-[#FFD670] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] flex flex-col text-[#1A1A1A]"
        >
          <div className="flex items-center gap-3 mb-6">
            <FileQuestion className="w-7 h-7" />
            <h3 className="text-xl font-black uppercase">Missing Info</h3>
          </div>
          <ul className="space-y-4 flex-1">
            {data.missingInformation.map((info, idx) => (
              <li key={idx} className="flex items-start gap-3 font-bold text-lg bg-white p-5 rounded-2xl border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <span className="text-[#9B5DE5] text-2xl leading-none mt-0">&bull;</span>
                <span className="leading-snug">{info}</span>
              </li>
            ))}
            {data.missingInformation.length === 0 && (
              <p className="font-bold text-xl p-4 bg-white/50 rounded-2xl border-4 border-[#1A1A1A] text-center">No missing information noted.</p>
            )}
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-[32px] border-4 border-[#1A1A1A] bg-[#70D6FF] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] flex flex-col text-[#1A1A1A]"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-7 h-7" />
            <h3 className="text-xl font-black uppercase">Alternatives</h3>
          </div>
          <div className="space-y-5 flex-1">
            {data.alternativeSolutions.map((alt, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 border-4 border-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                <h4 className="font-black text-lg mb-3 pb-3 border-b-4 border-[#1A1A1A] leading-tight">For: {alt.issue}</h4>
                <ul className="space-y-3">
                  {alt.solutions.map((sol, i) => (
                    <li key={i} className="font-bold flex items-start gap-3">
                      <span className="text-xl leading-none mt-0">&rarr;</span> <span className="leading-relaxed">{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {data.alternativeSolutions.length === 0 && (
              <p className="font-bold text-xl p-4 bg-white/50 rounded-2xl border-4 border-[#1A1A1A] text-center">No alternative solutions suggested.</p>
            )}
          </div>
        </motion.div>

      </div>

      {/* Communications Drafts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-[32px] border-4 border-[#1A1A1A] overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] flex flex-col">
          <div className="border-b-4 border-[#1A1A1A] px-8 py-5 flex justify-between items-center bg-[#00F5D4] text-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <h3 className="font-black text-xl uppercase">Email Draft</h3>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(`Subject: ${data.followUpEmailDraft.subject}\n\n${data.followUpEmailDraft.body}`)}
              className="text-sm font-black uppercase tracking-widest border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-xl transition-colors active:scale-95"
            >
              Copy
            </button>
          </div>
          <div className="p-8 flex-1 text-[#1A1A1A]">
            <div className="mb-6 pb-6 border-b-4 border-[#1A1A1A]">
              <span className="text-sm font-black uppercase tracking-widest block mb-1 opacity-60">Subject</span>
              <p className="text-xl font-bold">{data.followUpEmailDraft.subject}</p>
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-widest block mb-3 opacity-60">Body</span>
              <p className="text-lg font-bold whitespace-pre-wrap leading-relaxed">{data.followUpEmailDraft.body}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border-4 border-[#1A1A1A] overflow-hidden shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] flex flex-col">
          <div className="border-b-4 border-[#1A1A1A] px-8 py-5 flex justify-between items-center bg-[#9B5DE5] text-white">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <h3 className="font-black text-xl uppercase">Calendar Event</h3>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(`Title: ${data.calendarEventDraft.title}\nDate: ${data.calendarEventDraft.suggestedDate}\nAgenda:\n${data.calendarEventDraft.agenda.map(a => '- ' + a).join('\n')}`)}
              className="text-sm font-black uppercase tracking-widest border-2 border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-xl transition-colors active:scale-95 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            >
              Copy
            </button>
          </div>
          <div className="p-8 flex-1 text-[#1A1A1A]">
            <div className="mb-6 pb-6 border-b-4 border-[#1A1A1A]">
              <span className="text-sm font-black uppercase tracking-widest block mb-1 opacity-60">Title</span>
              <p className="text-xl font-bold">{data.calendarEventDraft.title}</p>
            </div>
            <div className="mb-6 pb-6 border-b-4 border-[#1A1A1A]">
              <span className="text-sm font-black uppercase tracking-widest block mb-1 opacity-60">Suggested Date</span>
              <p className="text-xl font-bold">{data.calendarEventDraft.suggestedDate}</p>
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-widest block mb-3 opacity-60">Agenda</span>
              <ul className="list-none text-lg font-bold space-y-3">
                {data.calendarEventDraft.agenda.map((item, idx) => (
                  <li key={idx} className="leading-snug flex items-start gap-3">
                    <span className="text-[#FF70A6] text-2xl mt-0.5 leading-none">&bull;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
