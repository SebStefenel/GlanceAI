function saveOptions() {
  const apiKey = document.getElementById('apiKey').value;
  const summaryFormat = document.getElementById('summaryFormat').value;
  chrome.storage.sync.set({ apiKey, summaryFormat }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => { status.textContent = ''; }, 1000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ apiKey: '', summaryFormat: 'concise' }, (items) => {
    document.getElementById('apiKey').value = items.apiKey;
    document.getElementById('summaryFormat').value = items.summaryFormat;

    if (!items.apiKey) {
      document.getElementById('status').textContent = 'Please enter your API key to get started.';
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
