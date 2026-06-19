"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Get email from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const urlEmail = params.get("email") || localStorage.getItem("signup_email") || "";
    setEmail(urlEmail);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!code.trim()) {
      setError("Please enter the verification code");
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement with Supabase:
      // const { data, error } = await supabase.auth.verifyOtp({
      //   email,
      //   token: code,
      //   type: 'signup',
      // });

      // For now, simulate verification
      setSuccess(true);
      setTimeout(() => {
        // After verification, redirect to dashboard or save portfolio
        const portfolioData = localStorage.getItem("pending_portfolio");
        if (portfolioData) {
          localStorage.removeItem("pending_portfolio");
          // TODO: Save portfolio to Supabase
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }, 2000);
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");

    try {
      // TODO: Implement with Supabase:
      // const { error } = await supabase.auth.resend({
      //   type: 'signup',
      //   email,
      // });

      // For now, simulate resend
      setResendCountdown(60);
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {success ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-4">
              Your account is ready. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Verify Email
            </h1>
            <p className="text-center text-gray-600 mb-8">
              We've sent a verification code to:
            </p>
            <p className="text-center font-semibold text-gray-900 mb-8">
              {email || "your email"}
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXX"
                  maxLength={6}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest disabled:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">
                Didn't receive a code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={loading || resendCountdown > 0}
                className="w-full text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : "Resend Code"}
              </button>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="text-center text-sm text-gray-600 hover:text-gray-900 block"
              >
                ← Back to Portfolio Tracker
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
