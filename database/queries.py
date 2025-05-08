import json
import os

file_name = 'data.json'

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

def get_rating(key):
    """Returns the rating for a given key."""
    data = read_json(file_name)
    if key in data:
          return data[key].get('rating', None)
    else:
        return None
    

def add_rating(key, rating):
	"""Adds or updates the rating for a given key."""
	data = read_json(file_name)
	if key in data:
		data[key]['rating'] = (data[key]['rating']*data[key]['num_ratings'] + rating) / (data[key]['num_ratings'] + 1)
		data[key]['num_ratings'] += 1
	else:
		data[key] = {'rating': rating, 'num_ratings': 1}
	write_json(file_name, data)

def get_scan(key):
	"""Returns the scan for a given key."""
	data = read_json(file_name)
	if key in data:
		return data[key].get('scan', None)
	else:
		return None

def get_scan_ratings(key):
	"""Returns the scan ratings for a given key."""
	data = read_json(file_name)
	if key in data:
		return data[key].get('scan_ratings', None)
	else:
		return None

# scan field is a dictionary where the key is a url link and the value is a dictionary where the key is a the hop num and the value is a list of tuples of url link and its rating


def main():
    file_path = 'data.json'
    
    # Read existing data
    data = read_json(file_path)
    
    # Modify or add new data
    data['new_key'] = 'new_value'
    
    # Write updated data
    write_json(file_path, data)

if __name__ == "__main__":
    main()
