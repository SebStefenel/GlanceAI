// 'idle'   = ready to trigger on Ctrl+Alt + hover
// 'locked' = tooltip is pinned, Ctrl+Alt dismisses it
let state = 'idle';

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.altKey && state === 'locked') {
    hideTooltip();
    state = 'idle';
  }
});

document.addEventListener('mouseover', (e) => {
  if (!e.ctrlKey || !e.altKey || state !== 'idle') return;

  const anchor = e.target.closest("a");
  if (anchor && anchor.href && anchor.closest('div#search')) {
    state = 'locked';
    const query = new URLSearchParams(window.location.search).get("q");
    showTooltip(anchor, "⏳ Summarizing...");

    chrome.runtime.sendMessage({
      action: "summarize",
      url: anchor.href,
      query: query
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  console.log("📩 Received message from background:", message);

  if (message.action === "displaySummary" && state === 'locked') {
    const link = document.querySelector(`a[href="${message.url}"]`);
    if (link) {
      showTooltip(link, message.summary);
    }
  }
});

function hideTooltip() {
  const tooltip = document.querySelector(".ai-summary-tooltip");
  if (tooltip) tooltip.remove();
}

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
