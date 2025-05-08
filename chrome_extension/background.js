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
  