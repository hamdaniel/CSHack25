import os

import requests
import json
from med_dataset import get_top_abstracts
from dotenv import load_dotenv

API_KEY = os.getenv("API_KEY")

API_URL = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


def verify(claim, query, is_context=False):
    context_dict = get_top_abstracts(query)
    payload = f"""
    Analyze the following context and claim. 
    context: {query if is_context else context_dict.values()}
    
    claim: {claim}
     answer in following format: only write: yes if the context implies the claim,
     partially-yes if the context support the claim to a certain extent or if it gives reasonable doubt to support the claim,
     partially-no if the context barely support claim,but there slight correlation and no direct contradiction,
     no if the context and the claim contradict each-other or are not correlated.
    """
    payload = {
        "model": "meta-llama/llama-4-maverick:free",
        "messages": [
            {"role": "user", "content": payload}
        ],
        "max_tokens": 100
    }

    response = requests.post(API_URL, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        response_content = response.json()['choices'][0]['message']['content']
        print(response_content)
    else:
        print("Error:", response.status_code, response.text)


verify("vaccines are good", "vaccines are good")
