import json
import os

file_name = 'data.json'

"""
url:{
	rating: float,
	num_ratings: int,
    scans:{
        scan_text:{
			url:{
                  connected_urls_list: [url1, url2, ...]}
            }


"""


def read_json(file_path):
    """Reads and returns JSON data from a file."""
    if not os.path.exists(file_path):
        print(f"No file found at {file_path}. Returning empty dictionary.")
        return {}
    
    with open(file_path, 'r') as file:
        data = json.load(file)
        print("Data read from JSON:")
        print(json.dumps(data, indent=4))
        return data

def write_json(file_path, data):
    """Writes data to a JSON file."""
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
        print(f"Data written to {file_path}")

def get_rating(url):
    """Returns the rating for a given url."""
    data = read_json(file_name)
    if url in data:
          return data[url].get('rating', None)
    else:
        return None
    
def add_rating(url, rating):
    """Adds or updates the rating for a given url."""
    data = read_json(file_name)
    
    if url in data:
        current_rating = data[url].get('rating', 0)
        num_ratings = data[url].get('num_ratings', 0)

        new_rating = (current_rating * num_ratings + rating) / (num_ratings + 1)
        data[url]['rating'] = new_rating
        data[url]['num_ratings'] = num_ratings + 1
    else:
        data[url] = {'rating': rating, 'num_ratings': 1}
        
    write_json(file_name, data)


def get_scans(url):
    """Returns the scans for a given url."""
    data = read_json(file_name)
    
    if url in data:
        scans = data[url].get('scans', None)
        if scans is None:
            return None

        scan_texts = list(scans.keys()) if scans else None
        
        for scan_text in scan_texts:
            scan_graph = scans[scan_text]
            urls = list(scan_graph.keys()) if scan_graph else None
            if urls:
                for scan_url in urls:
                    scan_graph[scan_url]['rating'] = get_rating(scan_url)
        return scans
    else:
        return None

def upload_scan(url, scan_text, scan):
	"""Uploads a scan for a given url."""
	data = read_json(file_name)
	
	if url not in data:
		data[url] = {'scans': {}, 'rating': None, 'num_ratings': 0}
	
	if 'scans' not in data[url]:
		data[url]['scans'] = {}
	
	if scan_text not in data[url]['scans']:
		data[url]['scans'][scan_text] = {}
	
	data[url]['scans'][scan_text] = scan
	
	write_json(file_name, data)




def main():
    test_url = "http://example.com"
    test_scan_text = "test_scan"

    # Clean start: initialize empty JSON
    write_json(file_name, {})

    # Add a rating
    print("\nAdding rating...")
    add_rating(test_url, 4.0)

    # Add another rating (to test averaging)
    print("\nAdding another rating...")
    add_rating(test_url, 2.0)

    # Get and print rating
    print("\nGetting rating...")
    rating = get_rating(test_url)
    print(f"Rating for {test_url}: {rating}")

    # Upload a scan
    print("\nUploading scan...")
    upload_scan(test_url, test_scan_text, scan={test_url:{},"http://IHATECS.com":{}})  # `scan` is unused in your current implementation

    # Retrieve scans (should include the URL with rating)
    print("\nGetting scans...")
    scans = get_scans(test_url)
    print("Scans retrieved:")
    print(json.dumps(scans, indent=4))


if __name__ == "__main__":
    main()
