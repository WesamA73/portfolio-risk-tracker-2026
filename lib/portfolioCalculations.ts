export interface PortfolioAsset {
  id?: string;
  name: string;
  type: string;
  amount: number;
}

export interface DiversificationResult {
  score: number; // 0-100
  assets: PortfolioAsset[];
  recommendations: string[];
  summary: string;
}

// Asset type categorization
const ASSET_CATEGORIES = {
  stocks: ["stock", "equity", "share", "etf"],
  bonds: ["bond", "fixed income", "treasury"],
  realEstate: ["real estate", "reit", "property"],
  crypto: ["crypto", "bitcoin", "ethereum", "nft"],
  commodities: ["commodity", "gold", "oil", "silver"],
  cash: ["cash", "money market", "savings", "checking"],
};

function categorizeAsset(name: string, type: string): string {
  const combined = `${name} ${type}`.toLowerCase();

  for (const [category, keywords] of Object.entries(ASSET_CATEGORIES)) {
    if (keywords.some((keyword) => combined.includes(keyword))) {
      return category;
    }
  }

  return "other";
}

function calculateDiversificationScore(assets: PortfolioAsset[]): number {
  if (assets.length === 0) return 0;

  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  if (totalValue === 0) return 0;

  // Categorize assets and calculate weights
  const categoryWeights: Record<string, number> = {};

  assets.forEach((asset) => {
    const category = categorizeAsset(asset.name, asset.type);
    const weight = asset.amount / totalValue;
    categoryWeights[category] =
      (categoryWeights[category] || 0) + weight;
  });

  // Calculate Herfindahl-Hirschman Index (HHI) for diversification
  // HHI ranges from 0 to 10,000 (perfect concentration)
  const hhi = Object.values(categoryWeights).reduce(
    (sum, weight) => sum + weight * weight * 10000,
    0
  );

  // Convert HHI to diversification score (0-100)
  // Lower HHI = higher diversification
  // With 1 asset: HHI = 10000 → score = 0
  // With 5+ equal assets: HHI ≈ 2000 → score = 80
  const score = Math.max(0, Math.min(100, 100 - (hhi / 10000) * 100));

  return Math.round(score);
}

function generateRecommendations(
  assets: PortfolioAsset[],
  score: number
): string[] {
  const recommendations: string[] = [];

  if (assets.length === 0) {
    recommendations.push("Add assets to your portfolio to get started.");
    return recommendations;
  }

  // Categorize assets
  const categoryCount: Record<string, number> = {};
  const categoryWeight: Record<string, number> = {};
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);

  assets.forEach((asset) => {
    const category = categorizeAsset(asset.name, asset.type);
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    categoryWeight[category] =
      (categoryWeight[category] || 0) + asset.amount / totalValue;
  });

  // Diversification recommendations
  if (score < 40) {
    recommendations.push(
      "⚠️ Your portfolio has low diversification. Consider adding assets from different categories."
    );
  } else if (score < 65) {
    recommendations.push(
      "📊 Moderate diversification detected. You could benefit from adding more asset categories."
    );
  } else {
    recommendations.push(
      "✅ Good diversification across multiple asset categories."
    );
  }

  // Category-specific recommendations
  const categories = Object.keys(categoryWeight);

  if (categories.length === 1) {
    recommendations.push(
      `🎯 Currently concentrated in ${categories[0]}. Add 2-3 other asset types for balance.`
    );
  } else if (
    categoryWeight["stocks"] &&
    categoryWeight["stocks"] > 0.8
  ) {
    recommendations.push(
      "📈 Stock exposure is very high (>80%). Consider adding bonds or other stable assets."
    );
  }

  if (!categoryWeight["bonds"] && totalValue > 0) {
    recommendations.push(
      "🛡️ No bonds detected. Fixed income can provide stability and reduce volatility."
    );
  }

  if (!categoryWeight["cash"] && totalValue > 0) {
    recommendations.push(
      "💰 Consider keeping 5-10% in cash for emergency liquidity."
    );
  }

  // Number of assets recommendation
  if (assets.length < 5) {
    recommendations.push(
      `📝 You have ${assets.length} asset(s). Aim for 5-10 for better diversification.`
    );
  }

  return recommendations;
}

function generateSummary(assets: PortfolioAsset[], score: number): string {
  const totalValue = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const assetCount = assets.length;

  if (score >= 75) {
    return `Well-diversified portfolio with ${assetCount} asset(s) totaling $${totalValue.toFixed(2)}.`;
  } else if (score >= 50) {
    return `Moderately diversified portfolio with ${assetCount} asset(s). Room for improvement.`;
  } else {
    return `Portfolio with ${assetCount} asset(s) needs more diversification.`;
  }
}

export function calculatePortfolioDiversification(
  assets: PortfolioAsset[]
): DiversificationResult {
  const score = calculateDiversificationScore(assets);
  const recommendations = generateRecommendations(assets, score);
  const summary = generateSummary(assets, score);

  return {
    score,
    assets,
    recommendations,
    summary,
  };
}
