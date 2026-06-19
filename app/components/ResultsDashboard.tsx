"use client";

import { DiversificationResult } from "@/lib/portfolioCalculations";

interface ResultsDashboardProps {
  results: DiversificationResult;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-green-50";
  if (score >= 50) return "bg-yellow-50";
  return "bg-red-50";
}

function getScoreBarColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const totalValue = results.assets.reduce(
    (sum, asset) => sum + asset.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Diversification Score */}
      <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(results.score)} border-gray-200`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Diversification Score
        </h2>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-5xl font-bold ${getScoreColor(results.score)}`}>
            {results.score}%
          </p>
          <div className="text-right">
            {results.score >= 75 && (
              <p className="text-green-600 font-semibold">Excellent</p>
            )}
            {results.score >= 50 && results.score < 75 && (
              <p className="text-yellow-600 font-semibold">Good</p>
            )}
            {results.score < 50 && (
              <p className="text-red-600 font-semibold">Needs Work</p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${getScoreBarColor(results.score)}`}
            style={{ width: `${results.score}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-700 mt-4">{results.summary}</p>
      </div>

      {/* Portfolio Breakdown */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Portfolio Breakdown
        </h3>

        <div className="space-y-3">
          {results.assets.map((asset, index) => {
            const percentage = ((asset.amount / totalValue) * 100).toFixed(1);
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-gray-900">{asset.name}</p>
                  <p className="text-sm text-gray-600">
                    ${asset.amount.toFixed(2)} ({percentage}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900">
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommendations
        </h3>

        {results.recommendations.length === 0 ? (
          <p className="text-gray-600">No recommendations at this time.</p>
        ) : (
          <ul className="space-y-3">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 text-lg">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Asset Details Table */}
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Asset Details
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-semibold text-gray-900">
                  Asset Name
                </th>
                <th className="text-left py-2 px-2 font-semibold text-gray-900">
                  Type
                </th>
                <th className="text-right py-2 px-2 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-right py-2 px-2 font-semibold text-gray-900">
                  % of Portfolio
                </th>
              </tr>
            </thead>
            <tbody>
              {results.assets.map((asset, index) => {
                const percentage = ((asset.amount / totalValue) * 100).toFixed(
                  1
                );
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-2 text-gray-900">{asset.name}</td>
                    <td className="py-3 px-2 text-gray-600 capitalize">
                      {asset.type}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-900 font-medium">
                      ${asset.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-600">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
