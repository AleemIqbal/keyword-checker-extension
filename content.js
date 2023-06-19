chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'check_keywords') {
    const bodyContent = document.body.innerText.toLowerCase();
    const keywords = request.keywords.split(',');
    let missingKeywords = [];
    let presentKeywords = {};

    keywords.forEach((keyword) => {
      const trimmedKeyword = keyword.trim().toLowerCase();
      const keywordOccurrences = bodyContent.match(new RegExp('\\b' + trimmedKeyword + '\\b', 'g'));
      if (trimmedKeyword && keywordOccurrences) {
        presentKeywords[trimmedKeyword] = keywordOccurrences.length;
      } else if (trimmedKeyword) {
        missingKeywords.push(trimmedKeyword);
      }
    });

    let result = '';
    if (missingKeywords.length > 0) {
      result += 'Missing Keywords: ' + missingKeywords.join(', ') + '. ';
    }
    result += 'Present Keywords: ' + Object.entries(presentKeywords).map(([keyword, count]) => `${keyword} (${count} times)`).join(', ') + '.';
    sendResponse({ result: result });
  }
  return true;
});
