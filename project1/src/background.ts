chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scanText',
    title: 'Scan "%s"',
    contexts: ['selection']
  });
});

let popupWindowId: number | null = null;
let activePort: chrome.runtime.Port | null = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'popup-port') {
    activePort = port;
    port.onDisconnect.addListener(() => {
      activePort = null;
    });
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'scanText' && info.selectionText) {
    // Close existing popup if it exists
    if (popupWindowId !== null) {
      try {
        await chrome.windows.remove(popupWindowId);
      } catch (e) {
        console.error('Failed to close existing popup:', e);
      }
      popupWindowId = null;
    }

    // Create new popup window
    const popup = await chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 800,
      height: 600,
      focused: true
    });

    popupWindowId = popup.id || null;

    // Wait for port connection before sending message
    const sendMessageWhenConnected = () => {
      if (activePort) {
        activePort.postMessage({
          type: 'SCAN_TEXT',
          text: info.selectionText
        });
      } else {
        // Retry after a short delay if port isn't connected yet
        setTimeout(sendMessageWhenConnected, 100);
      }
    };

    sendMessageWhenConnected();
  }
});