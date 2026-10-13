import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaCircleNotch } from "react-icons/fa";
import { googleLogin } from "../services/authService";

export default function GoogleAuthButton({ onError, mode = "signin" }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const isConfigured = Boolean(
        clientId &&
        clientId.trim() !== "" &&
        clientId !== "google-oauth-client-id" &&
        !clientId.includes("your-google-client-id")
    );

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            if (onError) onError("");

            const credential = credentialResponse.credential;
            const res = await googleLogin(credential);
            if (res.success) {
                navigate("/dashboard");
            } else {
                if (onError) onError(res.message || "Google authentication failed");
            }
        } catch (err) {
            console.error("Google authentication error:", err);
            const msg =
                err.response?.data?.message ||
                "Failed to authenticate with Google. Please try again.";
            if (onError) onError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error("Google OAuth canceled or failed");
        if (onError) {
            onError("Google sign-in was canceled or failed.");
        }
    };

    const handleUnconfiguredClick = () => {
        if (onError) {
            onError(
                "Google Client ID is not configured yet. Please add your VITE_GOOGLE_CLIENT_ID in Frontend_AI/.env and GOOGLE_CLIENT_ID in backend_AI/.env."
            );
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {loading && (
                <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
                    <FaCircleNotch className="animate-spin" />
                    <span>Signing in with Google...</span>
                </div>
            )}

            {isConfigured ? (
                <div className="w-full flex justify-center [&>div]:!w-full [&>div>iframe]:!w-full [&>div]:!flex [&>div]:!justify-center transition-transform hover:scale-[1.01] active:scale-[0.99]">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text={mode === "signup" ? "signup_with" : "signin_with"}
                        width="100%"
                    />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleUnconfiguredClick}
                    className="w-full bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 text-slate-200 font-semibold py-3 px-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
                    title="Click for configuration info"
                >
                    <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
                    <span className="text-sm">
                        {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                    </span>
                </button>
            )}
        </div>
    );
}
