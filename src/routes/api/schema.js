const { object, string, z } = require("zod");

const baseCurrencies = require("../../utils/baseCurrencies");
const currencies = require("../../utils/currencies");

const reqExchangeRateSchema = object({
  query: object({
    amount: string(),
    direction: z.enum(["toSource", "toTarget"]),
    source: z.enum(baseCurrencies.map((item) => item.currency)),
    target: z.enum(currencies.map((item) => item.currency)),
  }),
});

const exchangeRateSchema = object({
  data: string(),
});

module.exports = { exchangeRateSchema, reqExchangeRateSchema };
