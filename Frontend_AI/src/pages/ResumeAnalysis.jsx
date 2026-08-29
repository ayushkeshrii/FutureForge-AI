import { useState, useEffect } from "react";
import { FaTrash, FaArrowLeft, FaGraduationCap, FaChevronRight } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisCard from "../components/AnalysisCard";
import SkeletonCard from "../components/SkeletonCard";
import {
    uploadResume,
    getResumeHistory,
    deleteResume,
} from "../services/resumeService";

function ResumeAnalysis() {
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [loaderStep, setLoaderStep] = useState(0);

    const loadingSteps = [
        "Uploading resume to FutureForge AI processing node...",
        "Auditing semantic formatting, sections, and structural patterns...",
        "Cross-referencing listed skills against 10,000+ industry job specs...",
        "Synthesizing customized learning roadmap steps...",
        "Drafting targeted technical interview preparation questions...",
        "Finalizing your hireability score and insights report..."
    ];

    useEffect(() => {
        loadHistory();
    }, []);

    useEffect(() => {
        let interval;
        if (loading) {
            setLoaderStep(0);
            interval = setInterval(() => {
                setLoaderStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 1500);
        } else {
            setLoaderStep(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const loadHistory = async () => {
        setHistoryLoading(true);
        try {
            const data = await getResumeHistory();
            if (data.success) {
                setHistory(data.history || []);
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleDeleteResume = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this resume analysis from history?")) {
            return;
        }
        try {
            const data = await deleteResume(id);
            if (data.success) {
                loadHistory();
            } else {
                alert(data.message || "Failed to delete from history.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting resume analysis.");
        }
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        setLoading(true);
        setShowResult(false);
        setError("");

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const data = await uploadResume(formData);
            console.log(data);

            setResult(data);
            setShowResult(true);
            loadHistory();
        } catch (error) {
            console.error("Upload Error:", error);
            const errMsg = error.response?.data?.message || "Resume analysis failed. Please try again.";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-gray-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans">
            <Sidebar />

            <div className="flex-1 min-h-screen flex flex-col min-w-0 overflow-hidden">
                <Topbar />

                <div className="p-4 sm:p-8 flex-1 overflow-y-auto bg-grid-pattern max-h-[calc(100vh-64px)]">

                    {/* Header Details */}
                    <div className="mb-8 text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                            Resume Analysis
                        </h1>
                        <p className="text-slate-500 dark:text-slate-450 text-xs mt-1">Audit resume skill gaps, score alignments, and generate learning roadmaps instantly.</p>
                    </div>

                    {!showResult && (
                        <div className="space-y-10 animate-fade-in-up">

                            <ResumeUpload onFileSelect={handleFileSelect} />

                         
                            {loading && (
                                <div className="mt-10 max-w-2xl mx-auto bg-slate-900/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative text-center animate-fade-in">
                                 
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>
                                    
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                      
                                        <div className="relative w-20 h-20">
                                            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                                            <div className="absolute inset-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-purple-500/35 animate-pulse">
                                                🧠
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-xl font-bold text-white tracking-tight">FutureForge AI Synthesis Engine</h3>
                                            <p className="text-purple-400 text-sm font-semibold animate-pulse tracking-wide h-6">
                                                {loadingSteps[loaderStep]}
                                            </p>
                                        </div>

                                        {/* Segmented Progress bar */}
                                        <div className="flex gap-1.5 w-64 justify-center">
                                            {loadingSteps.map((_, idx) => (
                                                <span 
                                                    key={idx} 
                                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                                        idx <= loaderStep ? "bg-purple-500 w-8" : "bg-slate-800 w-3.5"
                                                    }`}
                                                ></span>
                                            ))}
                                        </div>

                                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                            This process takes a few seconds. Please wait while the AI parses and builds your complete profile roadmap.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Error Alert */}
                            {error && (
                                <div className="mb-6 p-4.5 bg-red-50 dark:bg-red-950/45 border border-red-200 dark:border-red-800/40 text-red-755 dark:text-red-300 rounded-2xl text-xs transition-all duration-300 text-left">
                                    {error}
                                </div>
                            )}

                            {/* Previous Resumes History Section */}
                            <div className="mt-12 text-left">
                                <h2 className="text-xl font-bold mb-6 text-slate-805 dark:text-slate-200 tracking-tight">
                                    Previous Analyses History
                                </h2>

                                {historyLoading ? (
                                    <div className="text-center py-12 bg-white dark:bg-slate-900/25 border border-slate-200 dark:border-slate-900 rounded-3xl backdrop-blur-md shadow-md">
                                        <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                                        <p className="text-slate-500 dark:text-slate-455 mt-4 font-medium text-sm">Loading historical records...</p>
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="text-center py-14 bg-white dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-900 rounded-3xl shadow-sm">
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">No previous resumes uploaded yet.</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Audit your first resume above to get started!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {history.map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => {
                                                    setResult(item);
                                                    setShowResult(true);
                                                }}
                                                className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 hover:border-purple-500/25 rounded-3xl p-6 shadow-md dark:shadow-xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 cursor-pointer flex justify-between items-center group relative overflow-hidden text-left"
                                            >
                                                {/* Action Button: Deletes history record */}
                                                <button
                                                    onClick={(e) => handleDeleteResume(e, item._id)}
                                                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 hover:bg-red-100/60 dark:hover:bg-red-950/40 p-2 rounded-xl transition-all cursor-pointer opacity-70 hover:opacity-100 z-10"
                                                    title="Delete analysis"
                                                >
                                                    <FaTrash size={11} />
                                                </button>

                                                <div className="flex-1 min-w-0 pr-4">
                                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
                                                        {item.fileName}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 flex items-center gap-1.5 font-medium">
                                                        Target Match: <span className="font-bold text-slate-700 dark:text-slate-200">{item.career}</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium">
                                                        Analyzed: {new Date(item.createdAt).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-2 shrink-0">
                                                    <div className="w-13 h-13 rounded-2xl bg-purple-50 dark:bg-purple-950/45 text-purple-705 dark:text-purple-400 flex items-center justify-center font-black text-base border border-purple-100 dark:border-purple-900/60 shadow-inner group-hover:scale-105 transition-transform">
                                                        {item.score}%
                                                    </div>
                                                    <span className="text-purple-605 dark:text-purple-400 text-xs font-bold hover:underline flex items-center gap-1">
                                                        Details
                                                        <FaChevronRight size={7} />
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Render Block */}
                    {showResult && result && (
                        <div className="space-y-8 animate-fade-in-up">

                            {/* Back Navigation trigger button */}
                            <button
                                onClick={() => {
                                    setShowResult(false);
                                    setResult(null);
                                }}
                                className="px-5 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-805 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-semibold flex items-center gap-2 cursor-pointer text-xs shadow-xs"
                            >
                                <FaArrowLeft size={10} />
                                Back to History & Upload
                            </button>

                            {/* Resume Score Card panel */}
                            <div className="relative overflow-hidden p-8 rounded-3xl bg-white dark:bg-slate-900/35 border border-slate-200 dark:border-slate-900 shadow-md dark:shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group text-left">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full filter blur-[80px] -z-10"></div>
                                <div className="space-y-3 z-10 text-left">
                                    <span className="text-[11px] font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                                        Resume score
                                    </span>
                                    <p className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-450 dark:to-pink-400 text-transparent bg-clip-text text-glow-purple tracking-tight leading-none">
                                        {result.score}%
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold pt-1">
                                        Target Career Pathway: <span className="text-purple-600 dark:text-purple-400 font-bold">{result.career}</span>
                                    </p>
                                </div>
                                <div className="hidden md:block opacity-35 text-purple-500 dark:text-purple-400 pr-4 shrink-0 pointer-events-none">
                                    <svg width="100" height="60" viewBox="0 0 100 60">
                                        <path d="M5,40 Q25,10 45,30 T85,10" fill="none" stroke="currentColor" strokeWidth="3" className="animate-draw-path" />
                                        <circle cx="85" cy="10" r="4" fill="currentColor" className="animate-pulse-dot" />
                                    </svg>
                                </div>
                            </div>

                            {/* Analysis Lists (3 Columns) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 perspective-1000">
                                <AnalysisCard
                                    title="Detected Skills"
                                    items={result.detectedSkills || result.skills || []}
                                />

                                <AnalysisCard
                                    title="Missing Skills"
                                    items={result.missingSkills || []}
                                />

                                <AnalysisCard
                                    title="Recommended Skills"
                                    items={result.recommendedCourses || []}
                                />
                            </div>

                            {/* Learning Roadmap timeline checkpoints */}
                            {result.roadmap && result.roadmap.length > 0 && (
                                <div className="mt-12 text-left">
                                    <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200 tracking-tight">
                                        Learning Roadmap Steps
                                    </h2>

                                    <div className="space-y-4">
                                        {result.roadmap.map((step, index) => (
                                            <div
                                                key={index}
                                                className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 rounded-2xl p-5 hover:border-purple-500/15 transition-all duration-300 flex items-center gap-4 text-left group shadow-xs hover:shadow-md dark:hover:shadow-lg"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/45 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-sm shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                                                    Step {typeof step === "object" && step.step ? step.step : index + 1}
                                                </div>

                                                <div className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                    {typeof step === "object" ? (
                                                        <span className="flex items-center flex-wrap gap-2">
                                                            <span className="text-purple-650 dark:text-purple-400 font-bold group-hover:text-purple-500 transition-colors">
                                                                {step.title || step.skill || ""}
                                                            </span>
                                                            {step.skill && step.title && (
                                                                <span className="text-slate-400 dark:text-slate-500 text-xs">
                                                                    ({step.skill})
                                                                </span>
                                                            )}
                                                        </span>
                                                    ) : (
                                                        step
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interview Questions lists */}
                            {result.interviewQuestions && result.interviewQuestions.length > 0 && (
                                <div className="mt-12 text-left">
                                    <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-200 tracking-tight">
                                        Interview Questions Preparation
                                    </h2>

                                    {result.interviewQuestions.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-slate-900/35 backdrop-blur-xl border border-slate-200 dark:border-slate-900 rounded-3xl p-6 mb-6 hover:border-purple-500/15 transition-all duration-300 shadow-md dark:shadow-2xl text-left"
                                        >
                                            <h3 className="font-bold text-base text-purple-650 dark:text-purple-400 tracking-tight mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                                {item.skill}
                                            </h3>

                                            <ul className="space-y-3">
                                                {item.questions?.map((question, qIndex) => (
                                                    <li
                                                        key={qIndex}
                                                        className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed flex items-start gap-2.5 group"
                                                    >
                                                        <span className="w-5 h-5 rounded-lg bg-purple-50 dark:bg-purple-950/45 border border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-inner group-hover:scale-105 transition-transform">
                                                            Q
                                                        </span>
                                                        <span className="group-hover:text-slate-850 dark:group-hover:text-slate-200 transition-colors">{question}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeAnalysis;