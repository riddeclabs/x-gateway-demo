const axios = require("axios");
const config = require("config");
const express = require("express");

// const { validate } = require("../../middleware/validate");
// const { invoiceAddressSchema, reqInvoiceAddressSchema } = require("../../schemas/invoice");

const router = express.Router();
const coreURL = config.get("coreURL");

router.post(
  "/channels",
  // validate(reqInvoiceAddressSchema),
  async (req, res, next) => {
    const { currency } = req.query;

    try {
      const { data } = await axios.get(`${coreURL}/invoice/address`, {
        params: { currency, customerId: "demo" },
      });

      // invoiceAddressSchema.parse(data);

      return res.status(200).json(data.data);
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;
