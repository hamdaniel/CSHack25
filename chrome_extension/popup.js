	// Wait for DOM content to load
	document.addEventListener('DOMContentLoaded', function () {
		// Query the active tab to get its tabId
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			if (tabs.length > 0) {
				const tabId = tabs[0].id; // Get the tabId of the active tab
				
				// Send a message to the background script indicating that the popup is opened
				chrome.runtime.sendMessage({ action: 'popupOpened', tabId: tabId }, (response) => {
					if (chrome.runtime.lastError) {
					console.error('Error communicating with background:', chrome.runtime.lastError.message);
					return;
					}
				
					if (response?.success) {
					console.log('Plotly was successfully injected into the tab!');
					// You can now proceed to inject your plotting code
					} else {
					console.error('Plotly injection failed:', response?.error);
					}
				});
			} else {
				console.error('No active tab found');
			}
		});

		// Listen for a context menu or a selected text trigger
		document.addEventListener('mouseup', function () {
			const selectedText = window.getSelection().toString().trim();

			if (selectedText) {
				// Store the selected text
				chrome.storage.local.set({ selectedText: selectedText });

				// Populate the modal with the selected text
				const modalDescription = document.querySelector('.modal__description');
				if (modalDescription) {
					modalDescription.textContent = selectedText || 'No text selected.';
				}
				displayGraph();
			}
		});
	});

	function displayGraph() {
		fetch(chrome.runtime.getURL('plot.html'))
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.text();
			})
			.then(html => {
				const plotDiv = document.getElementById('plot');
				if (plotDiv) {
					plotDiv.innerHTML = html;
				} else {
					console.error('Plot div not found');
				}
			})
			.catch(error => {
				console.error('Failed to load plot.html:', error);
			});

	}

	document.addEventListener('DOMContentLoaded', function () {
		const button = document.querySelector('.modal__btn');
		if (button) {
			button.addEventListener('click', displayGraph);
		} else {
			console.error('Button not found');
		}
	});