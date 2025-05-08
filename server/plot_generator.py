import networkx as nx
import plotly.graph_objects as go
import random
import os

# Create a random graph
G = nx.erdos_renyi_graph(n=10, p=0.3, seed=random.randint(0, 10000))

# Get positions for nodes using spring layout
pos = nx.spring_layout(G, seed=42)

# Extract edge coordinates
edge_x = []
edge_y = []
for edge in G.edges():
    x0, y0 = pos[edge[0]]
    x1, y1 = pos[edge[1]]
    edge_x += [x0, x1, None]
    edge_y += [y0, y1, None]

# Create edge trace
edge_trace = go.Scatter(
    x=edge_x, y=edge_y,
    line=dict(width=1, color="#888"),
    hoverinfo='none',
    mode='lines')

# Extract node coordinates and text
node_x = []
node_y = []
node_text = []
for node in G.nodes():
    x, y = pos[node]
    node_x.append(x)
    node_y.append(y)
    node_text.append(f'Node {node}')

# Create node trace
node_trace = go.Scatter(
    x=node_x, y=node_y,
    mode='markers+text',
    text=[str(i) for i in G.nodes()],
    textposition="bottom center",
    hovertext=node_text,
    marker=dict(
        showscale=False,
        color='blue',
        size=20,
        line=dict(width=2, color='DarkSlateGrey'))
)

# Create figure with no title and full-screen size
fig = go.Figure(data=[edge_trace, node_trace],
                layout=go.Layout(
                    showlegend=False,
                    hovermode='closest',
                    margin=dict(b=0, l=0, r=0, t=0),  # Remove margins
                    xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                    yaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                    width=1920,  # Set width to full screen
                    height=1080,  # Set height to full screen
                    dragmode="pan",  # Disables the ability to drag and pan
                ))

# Save the figure as an HTML file with PlotlyJS and a custom callback function
output_file = "plot.html"
fig.write_html(output_file, include_plotlyjs="cdn", full_html=False, config={
    'displayModeBar': False,  # Removes the mode bar
    'scrollZoom': False,      # Disables zooming by scrolling
    'responsive': True        # Make the plot responsive to window resizing
})

# Adding custom JavaScript to handle the click event
html_content = f"""
<html>
    <head>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    </head>
    <body>
        <div id="graph"></div>
        <script>
            var plotData = {fig.to_json()};
            Plotly.newPlot('graph', plotData.data, plotData.layout);

            var nodes = {list(G.nodes())};  // Node IDs

            document.getElementById('graph').on('plotly_click', function(eventData) {{
                var pointIndex = eventData.points[0].pointIndex;
                var nodeID = nodes[pointIndex];
                alert('Node ' + nodeID + ' clicked!');
            }});
        </script>
    </body>
</html>
"""

# Write the HTML content to the output file
with open(output_file, 'w') as f:
    f.write(html_content)

print(f"Network graph saved to {os.path.abspath(output_file)}")
