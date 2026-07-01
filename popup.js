document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput  = document.getElementById('apiKey');
  const saveBtn      = document.getElementById('save');
  const activateBtn  = document.getElementById('activate');
  const formatSelect = document.getElementById('summaryFormat');
  const warning      = document.getElementById('warning');
  const statusOpts   = document.getElementById('status-options');
  const statusKey    = document.getElementById('status-apikey');

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Load saved settings
  chrome.storage.sync.get({ apiKey: '', summaryFormat: 'concise' }, (items) => {
    apiKeyInput.value  = items.apiKey;
    formatSelect.value = items.summaryFormat;

    if (items.apiKey) {
      statusKey.textContent = '✓ API key saved';
    } else {
      warning.style.display = 'block';
    }
  });

  // Auto-save format when changed
  formatSelect.addEventListener('change', () => {
    chrome.storage.sync.set({ summaryFormat: formatSelect.value }, () => {
      statusOpts.textContent = '✓ Saved';
      setTimeout(() => { statusOpts.textContent = ''; }, 1200);
    });
  });

  // Save API key
  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    chrome.storage.sync.set({ apiKey: key }, () => {
      warning.style.display = key ? 'none' : 'block';
      statusKey.textContent = key ? '✓ Key saved' : 'Key cleared';
    });
  });

  // Activate on current tab
  activateBtn.addEventListener('click', () => {
    chrome.storage.sync.get({ apiKey: '' }, (items) => {
      if (!items.apiKey) {
        statusOpts.textContent = '⚠ Save an API key first';
        return;
      }
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) return;
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleMode" }, () => {
          if (chrome.runtime.lastError) {
            statusOpts.textContent = '⚠ Navigate to Google Search first';
          } else {
            window.close();
          }
        });
      });
    });
  });
});
