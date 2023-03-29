chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'check_keywords') {
    const bodyContent = document.body.innerText.toLowerCase();
    const keywords = request.keywords.split(',');
    let missingKeywords = [];

    keywords.forEach((keyword) => {
      const trimmedKeyword = keyword.trim().toLowerCase();
      if (trimmedKeyword && !bodyContent.includes(trimmedKeyword)) {
        missingKeywords.push(trimmedKeyword);
      }
    });

    let result;
    if (missingKeywords.length > 0) {
      result = 'Missing Keywords: ' + missingKeywords.join(', ');
    } else {
      result = 'All keywords are present in the content.';
    }
    sendResponse({ result: result });
  }
  return true;
});
