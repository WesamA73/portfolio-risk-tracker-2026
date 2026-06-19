"use client";

import { PortfolioAsset } from "@/lib/portfolioCalculations";
import { useState } from "react";

interface PortfolioFormProps {
  onSubmit: (assets: PortfolioAsset[]) => void;
  isLoading?: boolean;
}

export default function PortfolioForm({
  onSubmit,
  isLoading = false,
}: PortfolioFormProps) {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
  });

  const addAsset = () => {
    if (
      formData.name.trim() &&
      formData.type.trim() &&
      formData.amount.trim() &&
      parseFloat(formData.amount) > 0
    ) {
      const newAsset: PortfolioAsset = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        amount: parseFloat(formData.amount),
      };

      setAssets([...assets, newAsset]);
      setFormData({ name: "", type: "", amount: "" });
    }
  };

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assets.length > 0) {
      onSubmit(assets);
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asset Name (e.g., Apple Stock, ETF)
        </label>
        <input
          type="text"
          placeholder="e.g., Apple Stock, Bitcoin, Corporate Bonds"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Asset Type
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        >
          <option value="">Select a type...</option>
          <option value="stock">Stock / Equity</option>
          <option value="bond">Bond / Fixed Income</option>
          <option value="real estate">Real Estate / REIT</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="commodity">Commodity</option>
          <option value="cash">Cash</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount ($)
        </label>
        <input
          type="number"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
          step="0.01"
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
      </div>

      <button
        type="button"
        onClick={addAsset}
        disabled={isLoading}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        + Add Asset
      </button>

      {/* Asset List */}
      {assets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Your Assets ({assets.length})
          </h3>
          <div className="space-y-2">
            {assets.map((asset, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{asset.name}</p>
                  <p className="text-sm text-gray-600">
                    {asset.type} •{" "}
                    <span className="font-semibold">
                      ${asset.amount.toFixed(2)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeAsset(index)}
                  disabled={isLoading}
                  className="ml-4 text-red-600 hover:text-red-800 font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Total Portfolio Value:</span>
            </p>
            <p className="text-2xl font-bold text-blue-600">
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={assets.length === 0 || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Portfolio"}
      </button>
    </form>
  );
}
