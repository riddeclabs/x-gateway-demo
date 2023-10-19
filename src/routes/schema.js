const { object, string } = require("zod");

const postAddressSchema = object({
  body: object({
    amount: string(),
    "base-amount": string(),
    "base-currency": string(),
    currency: string(),
  }),
});

const addressSchema = object({
  data: object({
    address: string(),
    qrCodeURL: string(),
  }),
});

const exchangeRateSchema = object({
  data: string(),
});

module.exports = { postAddressSchema, addressSchema, exchangeRateSchema };
