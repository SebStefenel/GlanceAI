// Identify search result links and attach hover event
document.addEventListener("mouseover", (e) => {
  const anchor = e.target.closest("a");
  if (anchor && anchor.href && anchor.closest('div#search')) {
    const query = new URLSearchParams(window.location.search).get("q");

    chrome.runtime.sendMessage({
      action: "summarize",
      url: anchor.href,
      query: query
    });

    // Add placeholder tooltip while waiting
    showTooltip(anchor, "⏳ Summarizing...");
  }
});

// Listen for AI response from background script
chrome.runtime.onMessage.addListener((message) => {
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
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = text;

  const rect = element.getBoundingClientRect();
  tooltip.style.top = `${window.scrollY + rect.top - 10}px`;
  tooltip.style.left = `${window.scrollX + rect.right + 10}px`;
}
