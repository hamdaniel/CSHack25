import requests
import json
from API_configs import API_KEY
from med_dataset import get_top_abstracts

API_URL = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}


def verify(claim, query):
    context_dict = get_top_abstracts(query)
    payload = {
        "model": "meta-llama/llama-4-maverick:free",
        "messages": [
            {"role": "user", "content":
                f"Explain if the following claim is implied from the context. context: {context_dict.values()}. claim: {claim}. answer in following format:In the first line only write: yes, no or partially. The explanation is to be written in newline"}
        ],
        "max_tokens": 100
    }

    response = requests.post(API_URL, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        response_content = response.json()['choices'][0]['message']['content']
        print(response_content)
    else:
        print("Error:", response.status_code, response.text)


verify("vaccine cause autism", "vaccine cause autism")
