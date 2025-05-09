chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanText',
    title: 'Scan Text',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'scanText' && info.selectionText) {
    chrome.runtime.sendMessage({
      type: 'SCAN_TEXT',
      text: info.selectionText
    });
    
    chrome.action.openPopup();
  }
});