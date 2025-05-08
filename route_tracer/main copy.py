import time
import requests
from bs4 import BeautifulSoup
import tldextract
from serpapi import GoogleSearch
import json
from fastapi import FastAPI, Query
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# ====== Configs ======

SERPAPI_KEY = os.getenv("SERPAPI_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# ====== LLM Influence Score ======

def llm_influence_score(source_text, target_text) -> float:
    prompt = f"""
Given the following two text snippets, is the second one likely derived from or influenced by the first? Respond with a score between 0 (not at all) to 1 (completely).

SOURCE:
{source_text}

TARGET:
{target_text}
"""
    payload = {
        "model": "meta-llama/llama-4-maverick:free",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 100
    }

    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            try:
                score = float(content.strip())
                return score
            except ValueError:
                print(f"Could not parse score: {content}")
                return 0.0
        else:
            print("LLM Error:", response.status_code, response.text)
            return 0.0
    except Exception as e:
        print(f"LLM request failed: {e}")
        return 0.0

# ====== Web Helpers ======

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

def extract_keywords(text: str):
    words = list(set(text.split()))
    return words[:10]

def search_google(phrase: str):
    
    params = {
        "q": phrase,
        "api_key": SERPAPI_KEY,
        "engine": "google",
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
        return [res["link"] for res in results.get("organic_results", [])]
    except Exception as e:
        print(f"Search failed: {e}")
        return []

# ====== Main Trace Function ======

@app.get("/search")
def trace_phrase(phrase: str = Query(...), hops: int = Query(3)):
    visited = set()
    queue = [(phrase, None)]  # (phrase, parent_url)
    trace_results = []

    for hop in range(hops):
        print(f"\n--- HOP {hop + 1} ---")
        new_items = []

        for phrase, parent_url in queue:
            print(f"\nSearching for phrase: {phrase}")
            urls = search_google(phrase)
            print(f'urls are: {urls}')
            for url in urls:
                if url in visited:
                    continue
                visited.add(url)
                print(f"Checking URL: {url}")

                text = extract_text_from_url(url)

                if parent_url:
                    parent_text = extract_text_from_url(parent_url)
                    score = llm_influence_score(parent_text, text)
                    print(f"Influence score from {parent_url} to {url}: {score}")
                    if score < 0.5:
                        continue  # Skip weak links
                else:
                    score = None

                new_keywords = extract_keywords(text)
                print(f"New keywords: {new_keywords}")
                new_items.extend([(kw, url) for kw in new_keywords])

                trace_results.append({
                    "url": url,
                    "from": parent_url,
                    "score": score,
                    "keywords": new_keywords,
                })

                time.sleep(1)  # avoid rate-limiting

        queue = new_items

    return {"trace": trace_results}
