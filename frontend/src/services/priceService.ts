/**
 * Price service for handling currency conversion and formatting
 */

export interface PriceConfig {
  exchangeRate: number; // USD to IDR
  currencySymbol: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export const DEFAULT_PRICE_CONFIG: PriceConfig = {
  exchangeRate: 15750, // 1 USD = 15,750 IDR (as of 2024)
  currencySymbol: 'Rp',
  decimalPlaces: 0,
  thousandsSeparator: '.',
  decimalSeparator: ',',
};

/**
 * Generate realistic perfume prices based on various factors
 */
export class PriceService {
  private static config: PriceConfig = DEFAULT_PRICE_CONFIG;

  /**
   * Update price configuration
   */
  static setConfig(config: Partial<PriceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  static getConfig(): PriceConfig {
    return { ...this.config };
  }

  /**
   * Convert USD price to IDR
   */
  static convertUSDToIDR(usdPrice: number): number {
    return Math.round(usdPrice * this.config.exchangeRate);
  }

  /**
   * Format price in Indonesian Rupiah format
   */
  static formatIDRPrice(price: number): string {
    const formattedPrice = price
      .toFixed(this.config.decimalPlaces)
      .replace(/\B(?=(\d{3})+(?!\d))/g, this.config.thousandsSeparator);

    return `${this.config.currencySymbol} ${formattedPrice}`;
  }

  /**
   * Generate realistic perfume price based on characteristics
   */
  static generateRealisticPrice(perfume: {
    brand: string;
    concentration: string;
    longevity: number;
    sillage: number;
    name?: string;
  }): number {
    // Base price ranges by concentration type
    const concentrationPrices = {
      'edt': { min: 300000, max: 800000 },     // Eau de Toilette: 300K-800K IDR
      'edp': { min: 500000, max: 1500000 },    // Eau de Parfum: 500K-1.5M IDR
      'parfum': { min: 1000000, max: 3000000 }, // Parfum: 1M-3M IDR
      'colognes': { min: 200000, max: 600000 }, // Colognes: 200K-600K IDR
      'after_shave': { min: 150000, max: 400000 }, // After shave: 150K-400K IDR
    };

    // Get base range for concentration
    const range = concentrationPrices[perfume.concentration.toLowerCase() as keyof typeof concentrationPrices] ||
                  concentrationPrices['edt'];

    // Brand premium calculation
    const brandPremium = this.calculateBrandPremium(perfume.brand);

    // Quality score based on longevity and sillage
    const qualityScore = (perfume.longevity + perfume.sillage) / 200; // Normalized to 0-1

    // Calculate final price
    const basePrice = range.min + (range.max - range.min) * qualityScore * brandPremium;
    const finalPrice = Math.round(basePrice);

    // Round to nearest 50,000 for more realistic pricing
    return Math.round(finalPrice / 50000) * 50000;
  }

  /**
   * Calculate brand premium multiplier
   */
  private static calculateBrandPremium(brand: string): number {
    const brandMultipliers: Record<string, number> = {
      // Luxury brands (1.5x - 2.0x)
      'creed': 2.0,
      'tom ford': 1.9,
      'byredo': 1.8,
      'le labo': 1.8,
      'maison margiela': 1.7,
      'diptyque': 1.6,
      'jo malone': 1.5,

      // Designer brands (1.2x - 1.5x)
      'dior': 1.5,
      'chanel': 1.5,
      'yves saint laurent': 1.4,
      'giorgio armani': 1.4,
      'versace': 1.3,
      'calvin klein': 1.3,
      'hugo boss': 1.2,

      // Popular/accessible brands (0.8x - 1.2x)
      'armaf': 1.1,
      'dumont': 1.0,
      'paco rabanne': 1.1,
      'jean paul gaultier': 1.2,

      // Mass market (0.7x - 1.0x)
      'davidoff': 0.9,
      'nautica': 0.8,
    };

    const lowerBrand = brand.toLowerCase();

    // Check for exact matches
    if (brandMultipliers[lowerBrand]) {
      return brandMultipliers[lowerBrand];
    }

    // Check for partial matches
    for (const [key, multiplier] of Object.entries(brandMultipliers)) {
      if (lowerBrand.includes(key) || key.includes(lowerBrand)) {
        return multiplier;
      }
    }

    // Default multiplier for unknown brands
    return 1.0;
  }

  /**
   * Create price ranges for filtering
   */
  static getPriceRanges(): Array<{ label: string; min: number; max: number }> {
    return [
      { label: 'Under 500K', min: 0, max: 500000 },
      { label: '500K - 1M', min: 500000, max: 1000000 },
      { label: '1M - 1.5M', min: 1000000, max: 1500000 },
      { label: '1.5M - 2M', min: 1500000, max: 2000000 },
      { label: '2M - 3M', min: 2000000, max: 3000000 },
      { label: 'Above 3M', min: 3000000, max: 10000000 },
    ];
  }

  /**
   * Get price range label for a given price
   */
  static getPriceRangeLabel(price: number): string {
    const ranges = this.getPriceRanges();
    const range = ranges.find(r => price >= r.min && price <= r.max);
    return range?.label || 'Custom';
  }

  /**
   * Calculate discount percentage
   */
  static calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  /**
   * Apply discount to price
   */
  static applyDiscount(price: number, discountPercentage: number): number {
    return Math.round(price * (1 - discountPercentage / 100));
  }
}