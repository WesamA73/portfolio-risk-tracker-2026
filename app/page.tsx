"use client";

import { useState } from "react";
import PortfolioForm from "./components/PortfolioForm";
import ResultsDashboard from "./components/ResultsDashboard";
import GuestSignupModal from "./components/GuestSignupModal";
import {
  PortfolioAsset,
  DiversificationResult,
  calculatePortfolioDiversification,
} from "@/lib/portfolioCalculations";

type AppState = "form" | "results" | "guest-view";

export default function Home() {
  const [state, setState] = useState<AppState>("form");
  const [results, setResults] = useState<DiversificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (assets: PortfolioAsset[]) => {
    setIsLoading(true);

    // Simulate processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const calculatedResults = calculatePortfolioDiversification(assets);
    setResults(calculatedResults);
    setState("results");
    setIsLoading(false);
  };

  const handleContinueAsGuest = () => {
    setState("guest-view");
  };

  const handleSignUp = () => {
    // Store results for signup flow
    if (results) {
      localStorage.setItem("pending_portfolio", JSON.stringify(results));
    }
    // TODO: Implement signup flow with Supabase
    window.location.href = "/auth/signup";
  };

  const handleReset = () => {
    setState("form");
    setResults(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Portfolio Risk Tracker
          </h1>
          <p className="text-lg text-gray-700">
            Understand your portfolio diversification and get actionable insights
          </p>
        </div>

        {/* Form Step */}
        {state === "form" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <PortfolioForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* Results with Modal */}
        {(state === "results" || state === "guest-view") && results && (
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <ResultsDashboard results={results} />

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="mt-8 w-full bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 rounded-lg transition"
              >
                Analyze Another Portfolio
              </button>
            </div>

            {/* Guest/Signup Modal */}
            {state === "results" && (
              <GuestSignupModal
                results={results}
                onContinueAsGuest={handleContinueAsGuest}
                onSignUp={handleSignUp}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
