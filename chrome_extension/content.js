// content.js

document.addEventListener('mouseup', function() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
      // Save selected text to Chrome local storage
      chrome.storage.local.set({ selectedText: selectedText }, function() {
          console.log('Selected text saved:', selectedText);
      });
  }
});
