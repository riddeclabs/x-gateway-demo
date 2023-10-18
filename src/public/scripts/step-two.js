(function stepTwo() {
  const script = document.getElementById("script");

  const amount = script.getAttribute("data-amount");
  const baseCurrency = script.getAttribute("data-base-currency");
  const selected = script.getAttribute("data-currency");
  const currencies = JSON.parse(script.getAttribute("data-currencies"));

  const scriptElements = document.querySelectorAll(".script-only");
  scriptElements.forEach((item) => item.removeAttribute("hidden"));

  /**
   * Format numbers
   */
  function formatter(value, currency = null, { locale } = { locale: "en-US" }) {
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

    const currenciesFiat = ["EUR", "USD", "INR", "JPY", "KES"];

    if (currenciesFiat.includes(currency)) {
      return new Intl.NumberFormat(locale, {
        currency,
        maximumFractionDigits: 6,
        roundingMode: "floor",
      }).format(value);
    }

    return new Intl.NumberFormat(locale).format(value);
  }

  /**
   * Enable bootstrap tooltips
   */
  const tooltipTriggerList = document.querySelectorAll(
    "[data-bs-toggle='tooltip']",
  );
  // eslint-disable-next-line no-unused-vars
  const tooltipList = [...tooltipTriggerList].map(
    // eslint-disable-next-line no-undef
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
  );

  /**
   * Set copy value on tooltip onclick action.
   */
  function setCopyValue(id, value) {
    const tooltip = document.getElementById(`${id}`);

    if (value) {
      tooltip.setAttribute("data-copy", `${value}`);
    }

    tooltip.onclick = async function setCopy() {
      await navigator.clipboard.writeText(tooltip.getAttribute("data-copy"));

      // eslint-disable-next-line no-undef
      const instance = bootstrap.Tooltip.getInstance(`#${id}`);
      instance.setContent({ ".tooltip-inner": "Copied" });

      setTimeout(() => {
        instance.hide();
      }, 3000);

      tooltip.addEventListener("hidden.bs.tooltip", () => {
        instance.setContent({ ".tooltip-inner": "Copy to clipboard" });
      });
    };
  }

  /**
   * Request exchange/convert api. Change view - Set exchange rate.
   */
  async function getExchangeRate() {
    const exchangeRate = document.getElementById("exchange-rate");

    try {
      const params = new URLSearchParams({
        amount: 1,
        source: baseCurrency,
        target: selected.includes("tUSD")
          ? selected.replace("tUSD", "USD")
          : selected,
      }).toString();

      const response = await fetch(`/api/exchange/convert?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      const currencyName = currencies.find((item) => item.currency === selected).name;

      exchangeRate.innerHTML = `1 ${currencyName} ≈ ${formatter(
        data,
        baseCurrency,
      )} ${baseCurrency}`;
      exchangeRate.classList.remove("text-danger");
    } catch (error) {
      if (error.message === "422") {
        exchangeRate.innerHTML = "The exchange rate value is not valid.";
      } else {
        exchangeRate.innerHTML = "The exchange rate is temporarily unavailable.";
      }

      exchangeRate.classList.add("text-danger");
    }
  }

  /**
   * Request exchange/rate api. Change view - Set exchange value.
   */
  async function getExchangeValue() {
    const exchangeValue = document.getElementById("exchange-value");

    try {
      const params = new URLSearchParams({
        amount,
        source: baseCurrency,
        target: selected.includes("tUSD")
          ? selected.replace("tUSD", "USD")
          : selected,
      }).toString();

      const response = await fetch(`/api/exchange/rate?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      const currencyItem = currencies.find(
        (item) => item.currency === selected,
      );

      exchangeValue.innerHTML = `${formatter(data, selected)} ${
        currencyItem.name
      }`;
      exchangeValue.classList.remove("text-danger");
      exchangeValue.classList.remove("fs-6");

      setCopyValue("exchange-copy", formatter(data, selected));
    } catch (error) {
      if (error.message === "422") {
        exchangeValue.innerHTML = "The exchange value is not valid.";
      } else {
        exchangeValue.innerText = "The exchange value is temporarily unavailable.";
      }
      exchangeValue.classList.add("text-danger");
      exchangeValue.classList.add("fs-5");

      setCopyValue("exchange-copy", null);
    }
  }

  setCopyValue("address-copy");

  document.getElementById("amount").innerText = formatter(amount);

  getExchangeRate();
  getExchangeValue();

  /**
    * Set setInterval on exchange rates.
   */
  setInterval(() => {
    getExchangeRate();
    getExchangeValue();
  }, 900000);
}());
