const baseCurrencies = [
  {
    currency: "EUR",
    minDeposit: 20,
    name: "Euro",
  },
  {
    currency: "USD",
    minDeposit: 22,
    name: "US Dollar",
  },
  {
    currency: "JPY",
    maxDeposit: 300_000,
    minDeposit: 1000,
    name: "Japanese Yen",
  },
  {
    currency: "INR",
    maxDeposit: 200_000,
    minDeposit: 1000,
    name: "Indian Rupee",
  },
  {
    currency: "KES",
    minDeposit: 1000,
    name: "Kenyan Shilling",
  },
  {
    currency: "UZS",
    minDeposit: 25_000,
    name: "Uzbekistani Som",
  },
  {
    currency: "BDT",
    maxDeposit: 25_000,
    minDeposit: 300,
    name: "Bangladeshi Taka",
  },
];

module.exports = baseCurrencies;
