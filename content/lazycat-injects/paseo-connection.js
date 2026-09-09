(() => {
  if (ctx.runtime.executedBefore) return;
  const password = ctx.params.password;
  const localHost = window.location.hostname;
  const tls = window.location.protocol === "https:";
  const localPort = window.location.port || (tls ? "443" : "80");
  const initialized = new WeakSet();
  const filled = new WeakSet();
  const setValue = (input, value) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
  function update() {
    const host = document.getElementById("direct-host-input");
    const port = document.getElementById("direct-port-input");
    const secret = document.getElementById("direct-password-input");
    const ssl = document.querySelector('[data-testid="direct-ssl-toggle"]');
    if (!host || !port || !secret || !ssl || host.disabled) return;
    if (!initialized.has(host)) {
      initialized.add(host);
      if (!host.value) {
        setValue(host, localHost);
        setValue(port, localPort);
        if ((ssl.getAttribute("aria-checked") === "true") !== tls) ssl.click();
      }
    }
    const local = host.value === localHost && port.value === localPort &&
      (ssl.getAttribute("aria-checked") === "true") === tls &&
      !document.getElementById("direct-host-uri-input");
    if (!local && filled.has(secret)) {
      if (secret.value === password) setValue(secret, "");
      filled.delete(secret);
    } else if (local && !secret.value && !filled.has(secret)) {
      filled.add(secret);
      setValue(secret, password);
    }
  }
  // Native input events run before React's delegated state handlers. Defer to
  // the next frame so all fields and checkbox state settle before autofilling.
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; update(); });
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true, subtree: true, attributes: true,
    attributeFilter: ["aria-checked", "disabled"],
  });
  document.addEventListener("input", schedule);
  document.addEventListener("change", schedule);
  schedule();
})();
