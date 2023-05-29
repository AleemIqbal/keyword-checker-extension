function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}
document.getElementById('keyword-checker-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const keywordsInput = document.getElementById('keywords');
  const missingKeywordsDiv = document.getElementById('missing-keywords');
  const presentKeywordsDiv = document.getElementById('present-keywords');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.scripting
      .executeScript({ target: { tabId: activeTab.id }, files: ['content.js'] })
      .then(() => {
        chrome.tabs.sendMessage(activeTab.id, { action: 'check_keywords', keywords: keywordsInput.value }, function (response) {
          if (chrome.runtime.lastError) {
            missingKeywordsDiv.innerHTML = 'Error: ' + chrome.runtime.lastError.message;
          } else {
            const missingKeywords = response.result.match(/Missing Keywords: (.+?)\. Present Keywords:/);
            const presentKeywords = response.result.match(/Present Keywords: (.+)/);
            if (missingKeywords) {
              missingKeywordsDiv.innerHTML = '<strong>Missing Keywords:</strong> ' + missingKeywords[1];
              copyToClipboard(missingKeywords[1]);
            }
            if (presentKeywords) {
              presentKeywordsDiv.innerHTML = '<strong>Present Keywords:</strong> ' + presentKeywords[1];
            }
          }
        });
      })
      .catch((error) => {
        missingKeywordsDiv.innerHTML = 'Error: ' + error.message;
      });
  });
});
