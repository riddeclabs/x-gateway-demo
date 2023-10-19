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
}());
