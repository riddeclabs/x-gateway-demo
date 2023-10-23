// eslint-disable-next-line func-names
(function () {
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

  setCopyValue("address-copy");
  setCopyValue("amount-copy");

  /**
   * Set timer
   */

  const countdownTime = new Date(Date.parse(new Date()) + 20 * 60 * 1000);
  let timerInterval;

  function setTimerValue() {
    const timer = document.getElementById("timer");

    const difTime = new Date(countdownTime - new Date());

    if (difTime <= 0) {
      window.clearInterval(timerInterval);
      document.location.href = "http://localhost:7000/expired";
      return;
    }

    const minutes = difTime.getMinutes();
    const seconds = difTime.getSeconds();

    if (minutes > 4) {
      timer.classList.add("text-success");
      timer.classList.remove("text-danger");
    } else {
      timer.classList.remove("text-success");
      timer.classList.add("text-danger");
    }

    timer.innerHTML = `${minutes}m ${seconds}s`;
  }

  setTimerValue();

  // eslint-disable-next-line func-names
  timerInterval = window.setInterval(() => {
    setTimerValue();
  }, 1000);
}());
