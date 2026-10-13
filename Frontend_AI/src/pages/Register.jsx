import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaCircleNotch, FaArrowLeft } from "react-icons/fa";
import { registerUser } from "../services/authService";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = await registerUser(name, email, password);
            if (data.success) {
                setSuccess("Registration successful! Redirecting to login page...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to connect to the server. Please check if the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-y-auto py-16 px-4 font-sans bg-grid-pattern">
            {/* Ambient Spinning backdrop circles */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[120px] animate-spin-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full filter blur-[120px] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
            </div>

            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition-all hover:-translate-x-0.5"
            >
                <FaArrowLeft size={12} />
                Back to Home
            </Link>

            {/* 3D Perspective Card Tilt Container */}
            <div className="w-full max-w-md mx-4 z-10 perspective-1000">
                <div className="tilt-card p-8 bg-slate-900/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-800 hover:border-purple-500/40 rounded-3xl shadow-2xl relative">
                    {/* Glow light effect inside card */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-[50px] pointer-events-none"></div>

                    {/* Logo / Title */}
                    <div className="text-center mb-8 translate-z-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
                            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-300">
                                F
                            </span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 tracking-tight">
                                FutureForge AI
                            </span>
                        </Link>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            Create Account
                        </h2>
                        <p className="text-slate-450 mt-1 text-xs">
                            Start your personalized learning journey today.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-950/45 border border-red-800/40 text-red-300 rounded-2xl text-xs transition-all duration-300">
                            {error}
                        </div>
                    )}

                    {/* Success Banner */}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-950/45 border border-emerald-800/40 text-emerald-300 rounded-2xl text-xs transition-all duration-300">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 translate-z-20">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block">
                                Full Name
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaUser />
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 placeholder-slate-650 transition-all text-sm shadow-inner"
                                    placeholder="Piyush Kumar"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block">
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaEnvelope />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 placeholder-slate-650 transition-all text-sm shadow-inner"
                                    placeholder="name@domain.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider block">
                                Password
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                                    <FaLock />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-100 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 placeholder-slate-650 transition-all text-sm shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-purple-950/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-5 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <FaCircleNotch className="animate-spin text-lg" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    Get Started
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Or continue with
                        </span>
                        <div className="flex-grow border-t border-slate-800"></div>
                    </div>

                    {/* Google OAuth Button */}
                    <GoogleAuthButton onError={setError} mode="signup" />

                    {/* Footer Login Link */}
                    <div className="mt-8 text-center text-sm text-slate-450 translate-z-10">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;