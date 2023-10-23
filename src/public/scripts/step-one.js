// eslint-disable-next-line func-names
(function () {
  const script = document.getElementById("script");

  const baseCurrencies = JSON.parse(
    script.getAttribute("data-base-currencies"),
  );
  const currencies = JSON.parse(script.getAttribute("data-currencies"));

  /**
   * Format numbers
   */
  function formatter(value, noGroup, { locale } = { locale: "en-US" }) {
    if (Number.isNaN(value)) {
      return null;
    }

    if (noGroup) {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 6,
        roundingMode: "floor",
        useGrouping: false,
      }).format(value);
    }

    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  /**
   * Request exchange/rate api. Change view - Set exchange rate.
   */

  async function getExchangeRateAsync() {
    const exchangeRate = document.getElementById("exchange-rate");

    try {
      const selected = document.querySelector("input[name='currency']").value;
      const selectedBase = document.querySelector(
        "input[name='base-currency']",
      ).value;

      const params = new URLSearchParams({
        amount: 1,
        direction: "toSource",
        source: selectedBase,
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

      if (selected === selectedBase) {
        exchangeRate.classList.add("invisible");
      } else {
        exchangeRate.innerHTML = `1 ${selected} ≈ ${formatter(
          data,
        )} ${selectedBase}`;

        exchangeRate.classList.remove("invisible");
      }

      exchangeRate.classList.remove("text-danger");

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = false;
    } catch (error) {
      if (error.message === "422") {
        exchangeRate.innerHTML = "The exchange rate value is not valid.";
      } else {
        exchangeRate.innerHTML = "The exchange rate is temporarily unavailable.";
      }

      exchangeRate.classList.add("text-danger");

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = true;
    }
  }

  /**
   * Request exchange/rate api. Change view - Set payment amount.
   */

  async function setPaymentAmountAsync(baseAmount) {
    const amountInput = document.querySelector("input[name='amount']");
    const selected = document.querySelector("input[name='currency']").value;
    const selectedBase = document.querySelector(
      "input[name='base-currency']",
    ).value;

    try {
      const params = new URLSearchParams({
        amount: baseAmount,
        direction: "toTarget",
        source: selectedBase,
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

      amountInput.setAttribute("value", formatter(data, true));
    } catch (error) {
      amountInput.setAttribute("value", "0.00");
    }
  }

  /**
   * Validate base amount value
   */

  function validateBaseAmount(value) {
    const baseAmount = value || document.querySelector("input[name='base-amount']").value;

    const selectedBase = document.querySelector(
      "input[name='base-currency']",
    ).value;

    const { maxDeposit, minDeposit } = baseCurrencies.find(
      (item) => item.currency === selectedBase,
    );
    const validateBaseItem = document.getElementById("validate-base");

    if (baseAmount < minDeposit || (maxDeposit && baseAmount > maxDeposit)) {
      if (maxDeposit) {
        validateBaseItem.innerHTML = `Amount should be in between ${selectedBase} ${minDeposit} and ${selectedBase} ${maxDeposit}`;
      } else {
        validateBaseItem.innerHTML = `Amount should be more than ${selectedBase} ${minDeposit}`;
      }

      validateBaseItem.removeAttribute("hidden");

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = true;
      return;
    }

    validateBaseItem.setAttribute("hidden", "true");

    const submitButton = document.querySelector("button[type='submit']");
    submitButton.disabled = false;
  }
  /**
   * Set base-currency and currency dropdown change behavior.
   * Updates base amount validation, exchange rate and payment amount value
   */

  async function switchSelectedCurrencyDropdown(value, attribute, array) {
    const iconPrevious = document.querySelector(
      `#${attribute}-selected svg[selected]`,
    );

    if (iconPrevious) {
      iconPrevious.setAttribute("hidden", true);
      iconPrevious.removeAttribute("selected");
    }

    const iconNext = document.querySelector(
      `#${attribute}-selected svg[svg-icon-name='${value}']`,
    );

    iconNext.removeAttribute("hidden");
    iconNext.setAttribute("selected", true);

    const currencyItem = array.find((currency) => currency.currency === value);

    document.querySelector(
      `#${attribute}-selected span`,
    ).innerText = `${currencyItem.currency}`;
  }

  /**
   * Set onclick action on dropdown list elements.
   */

  function setDropdownHandler(attribute) {
    const list = document.querySelectorAll(`[data-${attribute}]`);

    list.forEach((item) => {
      const newItem = item;

      newItem.onclick = function async() {
        const inputCurrency = document.querySelector(
          `input[name='${attribute}']`,
        );

        inputCurrency.value = item.getAttribute(`data-${attribute}`);
        inputCurrency.dispatchEvent(new Event("change"));
      };

      return newItem;
    });
  }

  /**
   * Set base-currency input onchange behavior.
   * Update currency list depending on selected base currency
   */

  async function changeBaseCurrency(currency) {
    const currencyList = document.querySelectorAll(
      "#currency-list .dropdown-item",
    );

    const nextCurrencyList = currencies
      .filter((item) => item.providerId === 0 || item.currency === currency)
      .map((item) => item.currency);

    currencyList.forEach((item) => {
      if (nextCurrencyList.includes(item.getAttribute("data-currency"))) {
        item.removeAttribute("hidden");
        item.classList.add("d-flex");
      } else {
        item.setAttribute("hidden", true);
        item.classList.remove("d-flex");
      }
    });

    switchSelectedCurrencyDropdown(currency, "base-currency", baseCurrencies);

    switchSelectedCurrencyDropdown(currencies[0].name, "currency", currencies);

    document.querySelector("input[name='currency']").value = currencies[0].currency;

    await getExchangeRateAsync();

    const amountBaseCurrency = document.querySelector(
      "input[name='base-amount']",
    ).value
      ? document.querySelector("input[name='base-amount']").value
      : document.querySelector("input[name='base-amount']").defaultValue;

    validateBaseAmount(amountBaseCurrency);
    await setPaymentAmountAsync(amountBaseCurrency);
  }

  async function changeSelectedCurrency(currency) {
    switchSelectedCurrencyDropdown(currency, "currency", currencies);

    await getExchangeRateAsync();

    const amountBaseCurrency = document.querySelector(
      "input[name='base-amount']",
    ).value
      ? document.querySelector("input[name='base-amount']").value
      : document.querySelector("input[name='base-amount']").defaultValue;

    validateBaseAmount(amountBaseCurrency);
    await setPaymentAmountAsync(amountBaseCurrency);
  }

  getExchangeRateAsync();

  const submitButton = document.querySelector("button[type='submit']");
  submitButton.disabled = true;

  let timeoutInput;

  function delayedChangeBaseAmount(value) {
    window.clearTimeout(timeoutInput);

    timeoutInput = window.setTimeout(() => {
      validateBaseAmount(value);
      setPaymentAmountAsync(value);
    }, 1000);
  }

  const selectedBaseCurrencyInput = document.querySelector(
    "input[name='base-currency']",
  );
  selectedBaseCurrencyInput.addEventListener("change", (e) => changeBaseCurrency(e.target.value));

  const selectedCurrencyInput = document.querySelector(
    "input[name='currency']",
  );
  selectedCurrencyInput.addEventListener("change", (e) => changeSelectedCurrency(e.target.value));

  setDropdownHandler("base-currency");
  setDropdownHandler("currency");

  const baseAmountInput = document.querySelector("input[name='base-amount']");
  baseAmountInput.addEventListener("input", (e) => delayedChangeBaseAmount(e.target.value));
}());
