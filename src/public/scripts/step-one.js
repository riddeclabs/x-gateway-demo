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
   * Update dropdown view when new currency selected
   */

  function switchOnSelected(input) {
    const button = input.nextElementSibling;

    button.querySelector("span").innerText = input.value;

    const iconPrevious = button.querySelector("svg[selected]");

    if (iconPrevious) {
      iconPrevious.setAttribute("hidden", true);
      iconPrevious.removeAttribute("selected");
    }

    const iconNext = button.querySelector(
      `svg[svg-icon-name="${input.value}"]`,
    );

    iconNext.removeAttribute("hidden");
    iconNext.setAttribute("selected", true);
  }

  /**
   * Set baseCurrency dropdown input onchange behavior.
   * Update currency list depending on selected base currency
   */

  function updateCurrencyList(currency) {
    const currencyList = document.querySelectorAll(
      "#dropdown-currency .dropdown-item",
    );

    const nextCurrencyList = currencies
      .filter((item) => item.providerId === 0 || item.currency === currency)
      .map((item) => item.currency);

    currencyList.forEach((item) => {
      if (nextCurrencyList.includes(item.getAttribute("data-value"))) {
        item.removeAttribute("hidden");
        item.classList.add("d-flex");
      } else {
        item.setAttribute("hidden", true);
        item.classList.remove("d-flex");
      }
    });

    const input = document.getElementById("currency-input");
    input.value = currencies[0].name;
    input.dispatchEvent(new Event("change"));
  }

  /**
   * Request exchange/rate api. Change view - Set exchange rate.
   */
  async function getExchangeRateAsync() {
    const exchangeRate = document.querySelector("#exchange-rate");
    const exchangeRateSpinner = document.querySelector("#exchange-rate .spinner");
    const exchangeRateText = document.querySelector("#exchange-rate .text-content");

    try {
      const selected = document.querySelector("input[name='currency']").value;
      const selectedBase = document.querySelector("input[name='baseCurrency']").value;

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

      exchangeRateSpinner.classList.remove("spinner-border");

      if (selected === selectedBase) {
        exchangeRateText.innerHTML = "";
        exchangeRate.classList.add("invisible");
      } else {
        exchangeRateText.innerHTML = `1 ${selected} ≈ ${formatter(data)} ${selectedBase}`;
        exchangeRate.classList.remove("invisible");
      }

      exchangeRate.classList.remove("text-danger");

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = false;
    } catch (error) {
      if (error.message === "422") {
        exchangeRateText.innerHTML = "The exchange rate value is not valid.";
      } else {
        exchangeRateText.innerHTML = "The exchange rate is temporarily unavailable.";
      }

      exchangeRate.classList.add("text-danger");

      const submitButton = document.querySelector("button[type='submit']");
      submitButton.disabled = true;
    }
  }

  /**
   * Validate base amount value
   */

  function validateBaseAmount(value) {
    const baseAmount = value || document.querySelector("input[name='baseAmount']").value;

    const selectedBase = document.querySelector(
      "input[name='baseCurrency']",
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
      submitButton.classList.add("disabled");
      return;
    }

    validateBaseItem.setAttribute("hidden", "true");

    const submitButton = document.querySelector("button[type='submit']");
    submitButton.classList.remove("disabled");
  }

  /**
   * Request exchange/rate api. Change view - Set payment amount.
   */

  async function setPaymentAmountAsync(baseAmount) {
    const amountInput = document.querySelector("input[name='amount']");
    const selected = document.querySelector("input[name='currency']").value;
    const selectedBase = document.querySelector(
      "input[name='baseCurrency']",
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

  async function getExchange() {
    const exchangeRateSpinner = document.querySelector("#exchange-rate .spinner");
    const exchangeRateText = document.querySelector("#exchange-rate .text-content");

    exchangeRateSpinner.classList.add("spinner-border");
    exchangeRateText.innerHTML = "";

    const amountInput = document.querySelector("input[name='amount']");
    amountInput.setAttribute("value", "0.00");

    await getExchangeRateAsync();

    const amountBaseCurrency = document.querySelector(
      "input[name='baseAmount']",
    ).value
      ? document.querySelector("input[name='baseAmount']").value
      : document.querySelector("input[name='baseAmount']").defaultValue;

    validateBaseAmount(amountBaseCurrency);
    await setPaymentAmountAsync(amountBaseCurrency);
  }

  function dropdownHandler(inputId) {
    // eslint-disable-next-line func-names
    return function (event) {
      const value = event.target.closest("li").getAttribute("data-value");

      if (value) {
        const input = document.getElementById(inputId);
        input.value = value;
        input.dispatchEvent(new Event("change"));
      }
    };
  }

  let timeoutInput;

  function delayedChangeBaseAmount(value) {
    window.clearTimeout(timeoutInput);

    timeoutInput = window.setTimeout(() => {
      validateBaseAmount(value);
      setPaymentAmountAsync(value);
    }, 700);
  }

  document
    .getElementById("dropdown-base-currency")
    .addEventListener("click", dropdownHandler("base-currency-input"));

  document
    .querySelector("input[name='baseCurrency']")
    .addEventListener("change", async (event) => {
      switchOnSelected(event.target);
      updateCurrencyList(event.target.value);
      await getExchange();
    });

  document
    .getElementById("dropdown-currency")
    .addEventListener("click", dropdownHandler("currency-input"));

  document
    .querySelector("input[name='currency']")
    .addEventListener("change", async (event) => {
      switchOnSelected(event.target);
      await getExchange();
    });

  getExchangeRateAsync();

  document
    .querySelector("input[name='baseAmount']")
    .addEventListener("input", (e) => delayedChangeBaseAmount(e.target.value));
}());
