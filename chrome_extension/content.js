// content.js

document.addEventListener('mouseup', function() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
      // Save selected text to Chrome local storage
      chrome.storage.local.set({ selectedText: selectedText });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'plotlyInjectionSuccess') {
    console.log('Plotly was successfully injected into the page.');
    // You can now load and display the plot on the page
  } else if (message.action === 'plotlyInjectionFailed') {
    console.error('Plotly injection failed:', message.error);
  }
});