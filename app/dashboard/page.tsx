"use client";

import { useState } from "react";
import Link from "next/link";

interface SavedPortfolio {
  id: string;
  name: string;
  diversificationScore: number;
  totalValue: number;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  // TODO: Fetch saved portfolios from Supabase
  const [portfolios] = useState<SavedPortfolio[]>([
    // Example data structure:
    // {
    //   id: "1",
    //   name: "My Portfolio",
    //   diversificationScore: 65,
    //   totalValue: 50000,
    //   assetCount: 5,
    //   createdAt: "2026-06-01",
    //   updatedAt: "2026-06-19",
    // },
  ]);

  const handleLogout = () => {
    // TODO: Implement logout with Supabase
    window.location.href = "/";
  };

  const handleDeletePortfolio = async (portfolioId: string) => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      // TODO: Implement delete API call
      console.log("Deleting portfolio:", portfolioId);
    } catch (error) {
      console.error("Failed to delete portfolio:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Portfolios</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-600 mb-4">
              Track and manage all your portfolio analyses in one place.
            </p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            + New Analysis
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No portfolios yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first portfolio analysis to get started
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Start Analyzing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {portfolio.name}
                </h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      Diversification Score
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {portfolio.diversificationScore}%
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${portfolio.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Assets</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {portfolio.assetCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2 text-xs text-gray-600">
                  <p>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <Link
                    href={`/portfolio/${portfolio.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                    className="w-full text-red-600 hover:text-red-800 font-semibold py-2 border border-red-600 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
