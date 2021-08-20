chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    console.log([tabId, changeInfo, changeInfo.url, tab])
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: changeInfo.url.includes("/routes/") ? 'getHeight' : '',
        url: changeInfo.url
      })
    }
  }
);
