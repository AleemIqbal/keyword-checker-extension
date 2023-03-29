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
  const resultDiv = document.getElementById('result');

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.executeScript(activeTab.id, { file: 'content.js' }, function () {
      if (chrome.runtime.lastError) {
        resultDiv.innerHTML = 'Error: ' + chrome.runtime.lastError.message;
      } else {
        chrome.tabs.sendMessage(activeTab.id, { action: 'check_keywords', keywords: keywordsInput.value }, function (response) {
          if (chrome.runtime.lastError) {
            resultDiv.innerHTML = 'Error: ' + chrome.runtime.lastError.message;
          } else {
            resultDiv.innerHTML = response.result;
            const missingKeywords = response.result.match(/Missing Keywords: (.+)/);
            if (missingKeywords) {
              copyToClipboard(missingKeywords[1]);
            }
          }
        });
      }
    });
  });
});
