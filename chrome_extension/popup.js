// popup.js

chrome.storage.local.get(['selectedText'], function(result) {
    // Set the selected text from storage
    document.getElementById('selectedText').value = result.selectedText || '';
});

// You can add custom functionality to the buttons
document.getElementById('actionButton1').addEventListener('click', function() {
    console.log('Action 1 clicked');
    // You can add your action logic here
});

document.getElementById('actionButton2').addEventListener('click', function() {
    console.log('Action 2 clicked');
    // You can add your action logic here
});
