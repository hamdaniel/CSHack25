import networkx as nx
import matplotlib.pyplot as plt

# Your graph data
graph = {
    "title": "scan_text",
    "https://example.com": [("https://a.com", 0.8), ("https://b.com", 0.5)],
    "https://a.com": [("https://b.com", 0.9)],
    "https://b.com": []
}

# Create an undirected graph
G = nx.Graph()

# Add edges with weights, avoiding duplicates
added_edges = set()
for src, connections in graph.items():
    if src == "title":
        continue
    for dst, score in connections:
        edge = tuple(sorted((src, dst)))
        if edge not in added_edges:
            G.add_edge(src, dst, weight=score)
            added_edges.add(edge)

# Draw the graph
plt.figure(figsize=(10, 7))
pos = nx.spring_layout(G, seed=42)

# Draw nodes and labels
nx.draw(G, pos, with_labels=True, node_color='lightblue', node_size=3500, font_size=8)

# Draw edge labels with weights
edge_labels = {(u, v): f"{d['weight']:.2f}" for u, v, d in G.edges(data=True)}
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_color='gray')

plt.title(graph["title"])
plt.tight_layout()
plt.show()
