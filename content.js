document.addEventListener("mouseover", (e) => {
  const anchor = e.target.closest("a");
  if (anchor && anchor.href && anchor.closest('div#search')) {
    const query = new URLSearchParams(window.location.search).get("q");

    // Show loading tooltip immediately
    showTooltip(anchor, "⏳ Summarizing...");

    chrome.runtime.sendMessage({
      action: "summarize",
      url: anchor.href,
      query: query
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  console.log("📩 Received message from background:", message); // <-- Added debug log

  if (message.action === "displaySummary") {
    const link = document.querySelector(`a[href="${message.url}"]`);
    if (link) {
      showTooltip(link, message.summary);
    }
  }
});

function showTooltip(element, text) {
  let tooltip = document.querySelector(".ai-summary-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "ai-summary-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.background = "#fff";
    tooltip.style.border = "1px solid #ccc";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    tooltip.style.zIndex = "9999";
    tooltip.style.maxWidth = "300px";
    tooltip.style.fontSize = "14px";
    tooltip.style.lineHeight = "1.4";
    document.body.appendChild(tooltip);
  }

  tooltip.textContent = text;

  const rect = element.getBoundingClientRect();
  tooltip.style.top = `${window.scrollY + rect.top - 10}px`;
  tooltip.style.left = `${window.scrollX + rect.right + 10}px`;
}
