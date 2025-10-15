function saveOptions() {
  const apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({
    apiKey: apiKey
  }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({ apiKey: '' }, (items) => {
    const apiInput = document.getElementById('apiKey');
    const status = document.getElementById('status');

    apiInput.value = items.apiKey;

    if (!items.apiKey) {
      status.textContent = 'Please enter your API key to get started.';
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions); 
