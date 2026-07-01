document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn     = document.getElementById('save');
  const activateBtn = document.getElementById('activate');
  const status      = document.getElementById('status');
  const warning     = document.getElementById('warning');

  chrome.storage.sync.get({ apiKey: '' }, (items) => {
    if (items.apiKey) {
      apiKeyInput.value = items.apiKey;
      status.textContent = '✓ API key saved';
    } else {
      warning.style.display = 'block';
    }
  });

  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    chrome.storage.sync.set({ apiKey: key }, () => {
      warning.style.display = key ? 'none' : 'block';
      status.textContent = key ? '✓ Key saved' : 'Key cleared';
    });
  });

  activateBtn.addEventListener('click', () => {
    chrome.storage.sync.get({ apiKey: '' }, (items) => {
      if (!items.apiKey) {
        status.textContent = '⚠ Save an API key first';
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) return;
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleMode" }, () => {
          if (chrome.runtime.lastError) {
            status.textContent = '⚠ Navigate to Google Search first';
          } else {
            window.close();
          }
        });
      });
    });
  });
});
