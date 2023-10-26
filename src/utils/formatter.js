function formatNumber(
  value,
  currency = null,
  { locale } = { locale: "en-US" },
) {
  if (Number.isNaN(value)) {
    return null;
  }

  if (currency === null) {
    return new Intl.NumberFormat(locale).format(value);
  }

  if (currency === "BTC") {
    return new Intl.NumberFormat(locale, {
      currency: "BTC",
      maximumFractionDigits: 8,
      roundingMode: "floor",
    }).format(value);
  }

  if (currency === "ETH") {
    return new Intl.NumberFormat(locale, {
      currency: "ETH",
      maximumFractionDigits: 18,
      roundingMode: "floor",
    }).format(value);
  }

  if (currency === "tUSDC") {
    return new Intl.NumberFormat(locale, {
      currency: "TRX",
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  if (currency === "tUSDT") {
    return new Intl.NumberFormat(locale, {
      currency: "TRX",
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  if (currency === "USDC") {
    return new Intl.NumberFormat(locale, {
      currency: "ETH",
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  if (currency === "USDT") {
    return new Intl.NumberFormat(locale, {
      currency: "ETH",
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  const currenciesFiat = ["EUR", "USD", "INR", "JPY", "KES", "UZS", "BDT"];

  if (currenciesFiat.includes(currency)) {
    return new Intl.NumberFormat(locale, {
      currency,
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  return new Intl.NumberFormat(locale).format(value);
}

module.exports = { formatNumber };
