(function stepOne() {
  const script = document.getElementById("script");

  const baseCurrencies = JSON.parse(
    script.getAttribute("data-base-currencies"),
  );

  const currencies = JSON.parse(script.getAttribute("data-currencies"));

  /**
   * Format numbers
   */
  function formatter(value, { locale } = { locale: "en-US" }) {
    if (Number.isNaN(value)) {
      return null;
    }

    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 6,
      roundingMode: "floor",
    }).format(value);
  }

  /**
   * Request exchange/rate api. Change view - Set exchange rate.
   */

  async function getExchangeRate() {
    const exchangeRate = document.getElementById("exchange-rate");

    try {
      const selectedBase = document.querySelector(
        "input[name='base-currency']",
      ).value;
      const selected = document.querySelector("input[name='currency']").value;

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

      exchangeRate.innerHTML = `1 ${selected} ≈ ${formatter(
        data,
        selectedBase,
      )} ${selectedBase}`;

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

  getExchangeRate();

  /**
   * Request exchange/rate api. Change view - Set payment amount.
   */

  async function getExchangeValue(amount) {
    const amountCurrencyInput = document.querySelector(
      "input[name='currency-input-amount']",
    );
    const selectedBase = document.querySelector(
      "input[name='base-currency']",
    ).value;
    const selected = document.querySelector("input[name='currency']").value;

    try {
      const params = new URLSearchParams({
        amount,
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

      amountCurrencyInput.setAttribute("value", formatter(data, selected));
    } catch (error) {
      amountCurrencyInput.setAttribute("value", "0.00");
    }
  }
  /**
   * Set base-currency-input onchange behavior.
   */

  function changeSelectedCurrency(value, attribute, array) {
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

    getExchangeRate();

    const amountBaseCurrency = document.querySelector(
      "input[name='base-currency-input-amount']",
    ).value
      ? document.querySelector("input[name='base-currency-input-amount']").value
      : document.querySelector("input[name='base-currency-input-amount']")
        .defaultValue;

    getExchangeValue(amountBaseCurrency);
  }

  /**
   * Set onclick action on dropdown list elements.
   */

  function setDropdownHandler(attribute) {
    const list = document.querySelectorAll(`[data-${attribute}-item]`);

    list.forEach((item) => {
      const newItem = item;

      newItem.onclick = function async() {
        const inputCurrency = document.querySelector(
          `input[name='${attribute}']`,
        );

        inputCurrency.value = item.getAttribute(`data-${attribute}-item`);
        inputCurrency.dispatchEvent(new Event("change"));
      };

      return newItem;
    });
  }

  let timeoutInput;

  function delayedSetAmount(value) {
    window.clearTimeout(timeoutInput);

    timeoutInput = window.setTimeout(() => {
      getExchangeValue(value);
    }, 1500);
  }

  function setBaseCurrency(currency) {
    const currencyList = document.querySelectorAll(
      "#currency-list .dropdown-item",
    );

    const nextCurrencyList = currencies.filter(
      (item) => item.providerId === 0 || item.currency === currency,
    ).map((item) => item.currency);

    currencyList.forEach((item) => {
      if (nextCurrencyList.includes(item.getAttribute("data-currency-item"))) {
        item.removeAttribute("hidden");
        item.classList.add("d-flex");
      } else {
        item.setAttribute("hidden", true);
        item.classList.remove("d-flex");
      }
    });

    changeSelectedCurrency(currency, "base-currency", baseCurrencies);
  }

  const selectedBaseCurrencyInput = document.querySelector(
    "input[name='base-currency']",
  );
  selectedBaseCurrencyInput.addEventListener("change", (e) => setBaseCurrency(e.target.value));

  const selectedCurrencyInput = document.querySelector(
    "input[name='currency']",
  );
  selectedCurrencyInput.addEventListener("change", (e) => changeSelectedCurrency(e.target.value, "currency", currencies));

  setDropdownHandler("base-currency");
  setDropdownHandler("currency");

  const amountBaseCurrencyInput = document.querySelector(
    "input[name='base-currency-input-amount']",
  );
  amountBaseCurrencyInput.addEventListener("input", (e) => delayedSetAmount(e.target.value));
}());
