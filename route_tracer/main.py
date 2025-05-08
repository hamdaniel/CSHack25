from fastapi import FastAPI, Query
from dotenv import load_dotenv
from serpapi import GoogleSearch
import os

load_dotenv()

app = FastAPI()

@app.get("/search")
def search_exact_phrase(phrase: str = Query(..., min_length=3)):
    api_key = os.getenv("SERPAPI_API_KEY")

    search = GoogleSearch({
        "q": f'"{phrase}"',  # 👈 quote to enforce exact match
        "api_key": api_key,
        "num": 10,
        "hl": "en"
    })

    results = search.get_dict()
    urls = []

    for result in results.get("organic_results", []):
        link = result.get("link")
        if link:
            urls.append(link)

    return {
        "phrase": phrase,
        "found_urls": urls
    }
