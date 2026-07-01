// 'idle'   = waiting for shortcut
// 'active' = shortcut pressed, waiting for hover
// 'locked' = tooltip pinned, shortcut or Escape dismisses
let state = 'idle';

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleMode") {
    if (state === 'idle') {
      state = 'active';
      showIndicator();
    } else {
      hideTooltip();
      hideIndicator();
      state = 'idle';
    }
    return;
  }

  if (message.action === "displaySummary" && state === 'locked') {
    const link = document.querySelector(`a[href="${message.url}"]`);
    if (link) {
      showTooltip(link, message.summary);
    }
  }
});

document.addEventListener('mouseover', (e) => {
  if (state !== 'active') return;

  const anchor = e.target.closest("a");
  if (anchor && anchor.href && anchor.closest('div#search')) {
    state = 'locked';
    hideIndicator();
    const query = new URLSearchParams(window.location.search).get("q");
    showTooltip(anchor, "⏳ Summarizing...");

    chrome.runtime.sendMessage({
      action: "summarize",
      url: anchor.href,
      query: query
    });
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state !== 'idle') {
    hideTooltip();
    hideIndicator();
    state = 'idle';
  }
});

function showIndicator() {
  let indicator = document.getElementById('glance-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'glance-indicator';
    indicator.textContent = '🔍 GlanceAI active — hover a result';
    indicator.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4285f4;color:#fff;padding:8px 14px;border-radius:20px;font-size:13px;z-index:99999;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    document.body.appendChild(indicator);
  }
}

function hideIndicator() {
  const indicator = document.getElementById('glance-indicator');
  if (indicator) indicator.remove();
}

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
