chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action !== 'popupOpened') {
    return;
  }

  const tabId = message.tabId;
  console.log('Injecting Plotly into tab:', tabId);

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['plotly.min.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error injecting Plotly:', chrome.runtime.lastError);
      
      // Send failure response back to the sender
      chrome.tabs.sendMessage(tabId, {
        action: 'plotlyInjectionFailed',
        error: chrome.runtime.lastError.message
      });
    } else {
      console.log('Plotly script successfully injected into tab:', tabId);
      
      // Send success message back to the sender
      chrome.tabs.sendMessage(tabId, {
        action: 'plotlyInjectionSuccess'
      });
    }
  });

  // return true allows the response to be sent asynchronously
  return true;
});


chrome.runtime.onInstalled.addListener(() => {
    // Listen for the context menu option on the existing context menu
    chrome.contextMenus.create({
      id: 'scanText',
      title: 'Scan Selected Text',
      contexts: ['selection'],  // Only show when text is selected
    });
  });
  
  // Listen for clicks on the custom context menu item
  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'scanText') {
      const selectedText = info.selectionText;
  
      // Store the selected text in local storage
      chrome.storage.local.set({ selectedText }, function () {
        console.log('Selected text stored:', selectedText);
  
        // Optionally, open a popup or show any action
        chrome.action.openPopup(); // Open your popup here, if desired
      });
    }
  });
  