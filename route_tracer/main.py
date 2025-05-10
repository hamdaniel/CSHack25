import time
import requests
from bs4 import BeautifulSoup
from serpapi import GoogleSearch
from fastapi import FastAPI, Query
from dotenv import load_dotenv
import os
import json
import re
from datetime import datetime
import random

# ============ DB ================

import json
import os

file_name = 'C:\\Users\\Daniel\\OneDrive\\Documents\\Technion\\Semester_#8\\CSHack\\CSHack25\\route_tracer\\data.json'

"""
url:{
	rating: float,
	num_ratings: int,
     
    scans:{
        scan_text:{
			url:{
                  connected_urls_list: [url1, url2, ...]}
            }

    graph:{
    
    url: [(url2, 0.8, )]
    
    }    


"""


load_dotenv()
app = FastAPI()


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

@app.get("/overview")
def get_rating(url):
    """Returns the rating for a given url."""
    import random
    value = random.gauss(0.6, 0.3)
    return max(0, min(1, value))  # Clamp to [0, 1]
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

# ================================

# ====== Configs ======
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")

MAX_URLS_PER_HOP = 5
MAX_SENTENCES_PER_PAGE = 10
INFLUENCE_THRESHOLD = 0

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# ====== Utils ======
def extract_text_from_url(url: str) -> str:
    try:
        resp = requests.get(url, timeout=5)
        soup = BeautifulSoup(resp.text, 'html.parser')
        for tag in soup(["script", "style"]):
            tag.decompose()
        return soup.get_text(separator=' ')
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return ""


# ====== LLM Influence Score ======
def llm_influence_score(source_text, target_text): # TODO: FIX PROMPT!
    prompt = f"""
You are a text comparison AI. Given the following two articles, assess whether the TARGET was influenced by the SOURCE. 
Your answer should strictly match JSON with this format:

{{
  "score": float between 0 and 1,
  "sentences": string with up to 3 influencing sentences from the target,
  "date": publish date in ISO format (YYYY-MM-DD) if known, else null
}}

Without any additional info.

SOURCE:
\"\"\"
{source_text}
\"\"\"

TARGET:
\"\"\"
{target_text}
\"\"\"
"""
    payload = {
        "model": "meta-llama/llama-4-maverick:free",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 300
    }

    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            try:
                data = json.loads(content)
                #score = float(data.get("score", 0.0))
                """score is random"""""
                value = random.gauss(0.6, 0.25)
                score = max(0, min(1, value))  # Clamp to [0, 1] 
                sentences = data.get("sentences", "")
                date_str = data.get("date")
                date = datetime.fromisoformat(date_str).date() if date_str else None
                return score, sentences, date
            except Exception as e:
                print(f"Failed to parse LLM response: {content}, error: {e}")
                return 0.0, "", None
        else:
            print("LLM Error:", response.status_code, response.text)
            return 0.0, "", None
    except Exception as e:
        print(f"LLM request failed: {e}")
        return 0.0, "", None

# ====== Search ======
def search_google(phrase: str):
    params = {
        "q": phrase,
        "api_key": SERPAPI_KEY,
        "engine": "google",
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        return [res["link"] for res in results.get("organic_results", [])][:MAX_URLS_PER_HOP]
    except Exception as e:
        print(f"Search failed: {e}")
        return []

# ====== Main Trace Function ======
@app.get("/search")
def trace_phrase(phrase: str = Query(...), hops: int = Query(3)):
    visited = set()
    queue = [(phrase, "Your Quote")]  # (search phrase, parent_url)
    trace_results = []
    graph = {"Your Quote" : []}

    for hop in range(hops):
        print(f"\n--- HOP {hop + 1} ---")
        new_items = []

        for phrase, parent_url in queue:
            urls = search_google(phrase)

            for url in urls:
                if url in visited:
                    continue
                visited.add(url)
                print(f"Scraping {url}")
                target_text = extract_text_from_url(url)

                score, influencing_sentences, date = (None, [], None)
            
                parent_text = phrase
                score, influencing_sentences, date = llm_influence_score(parent_text, target_text)
                print(f"Score: {score}, Date: {date}")
                if score < INFLUENCE_THRESHOLD:
                    continue

                trace_results.append({
                    "url": url,
                    "from": parent_url,
                    "score": score,
                    "date": str(date) if date else None,
                    "sentences": influencing_sentences,
                })
                graph[parent_url].append((url, score, get_rating(url)))
                graph[url] = []

                # Prioritize high-score sentences as new phrases
                new_items.append((influencing_sentences, url))

                time.sleep(1)

        queue = new_items

    # Sort final results by score then date
    trace_results.sort(key=lambda x: (x["score"] if x["score"] is not None else 0, x["date"] or "9999-12-31"), reverse=True)

    return {"graph": graph ,"trace": trace_results}
