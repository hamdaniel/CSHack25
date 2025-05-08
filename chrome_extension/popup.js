// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function () {
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

            // Call the function to show the graph after text is selected
            displayGraph();
        }
    });
});

// Function to display the graph below the description
function displayGraph() {
    // Example graph data
    const scan_text = {
        title: "scan_text",
        url: {
            "https://example.com": {
                connected_urls_list: ["https://a.com", "https://b.com"]
            },
            "https://a.com": {
                connected_urls_list: ["https://b.com"]
            },
            "https://b.com": {
                connected_urls_list: []
            }
        }
    };

    const cy_div = document.querySelector('.cy'); // This is your container for Cytoscape

    // Build Cytoscape elements
    const elements = [];
    for (const url in scan_text.url) {
        elements.push({ data: { id: url } }); // No label here
        for (const dest of scan_text.url[url].connected_urls_list) {
            elements.push({ data: { source: url, target: dest } });
        }
    }

    // Initialize Cytoscape with Spread layout
    const cy = cytoscape({
        container: cy_div,
        elements: elements,
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#0074D9',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': 8,  // Smaller font size for nodes
                    'width': 40,
                    'height': 40,
                    'shape': 'round-rectangle', // Make it look like a button
                    'border-width': 2,
                    'border-color': '#fff',
                    'cursor': 'pointer',  // Change cursor to pointer for clickable nodes
                    'label': '' // No label text displayed
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],
        layout: {
            name: 'spread', // Use the spread layout instead of cose
            animate: true,
            minSeparation: 80 // Optional: adjust to control node spacing
        }
    });

    cy.resize(); // Resize the graph to fit the container
    cy.layout({ name: 'spread' }).run();

    // Add event listener for clicking nodes to open the URL
    cy.on('tap', 'node', function(event) {
        const node = event.target;
        const url = node.data('id');  // Get the URL from the node's ID

        // Open the URL in a new tab
        window.open(url, '_blank');
    });
}
