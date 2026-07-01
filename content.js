// 'idle'   = waiting for shortcut
// 'active' = shortcut pressed, waiting for hover
// 'locked' = tooltip pinned, shortcut or Escape dismisses
let state = 'idle';
let activeAnchor = null; // direct reference so we don't need to re-query by URL

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleMode") {
    if (state === 'idle') {
      state = 'active';
      showIndicator();
    } else {
      hideTooltip();
      hideIndicator();
      activeAnchor = null;
      state = 'idle';
    }
    return;
  }

  if (message.action === "displaySummary" && state === 'locked' && activeAnchor) {
    showTooltip(activeAnchor, message.summary);
  }
});

document.addEventListener('mouseover', (e) => {
  if (state !== 'active') return;

  const anchor = e.target.closest("a");
  if (anchor && anchor.href && anchor.closest('div#search')) {
    state = 'locked';
    activeAnchor = anchor;
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
    activeAnchor = null;
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
    tooltip.style.cssText = 'position:fixed;background:#fff;border:1px solid #ccc;padding:8px 12px;border-radius:6px;box-shadow:0 4px 8px rgba(0,0,0,0.2);z-index:99999;max-width:300px;font-size:14px;line-height:1.4;';
    document.body.appendChild(tooltip);
  }

  tooltip.textContent = text;

  const rect = element.getBoundingClientRect();
  const top = rect.top - 10;
  const left = rect.right + 10;

  // Keep tooltip on screen
  tooltip.style.top = `${Math.max(8, top)}px`;
  tooltip.style.left = `${Math.min(left, window.innerWidth - 320)}px`;
}
