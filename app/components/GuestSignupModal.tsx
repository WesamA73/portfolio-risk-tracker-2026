"use client";

import { DiversificationResult } from "@/lib/portfolioCalculations";

export interface GuestSignupModalProps {
  results: DiversificationResult;
  onContinueAsGuest: () => void;
  onSignUp: () => void;
}

export default function GuestSignupModal({
  results,
  onContinueAsGuest,
  onSignUp,
}: GuestSignupModalProps) {
  const handleSignUpClick = () => {
    // Store portfolio data in localStorage for signup flow
    localStorage.setItem("pending_portfolio", JSON.stringify(results));
    onSignUp();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Save Your Results?
        </h2>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Your Diversification Score:</span>
          </p>
          <p className="text-3xl font-bold text-blue-600">{results.score}%</p>
          <p className="text-xs text-gray-600 mt-2">{results.summary}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignUpClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign Up to Save Results
          </button>
          <p className="text-center text-sm text-gray-600">
            Keep your portfolio history and track changes over time
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <button
            onClick={onContinueAsGuest}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition"
          >
            Continue as Guest
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            View results now, nothing will be saved
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Your data is secure and private
        </p>
      </div>
    </div>
  );
}
