import requests
import xml.etree.ElementTree as ET
from xml.etree import ElementTree


def get_abstract_from_pubmed(pmid):
    """
    Retrieves the abstract of a PubMed article given its PMID.

    Args:
      pmid: The PubMed ID (PMID) of the article.

    Returns:
      A string containing the abstract, or None if the abstract cannot be found.
    """
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.cgi?db=pubmed&id={pmid}&retmode=xml"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        xml_content = response.content

        # Parse the XML
        root = ElementTree.fromstring(xml_content)

        # Locate the AbstractText element
        abstract_texts = root.findall('.//AbstractText')  # Correct xpath
        if not abstract_texts:
            return None  # No abstract found
        abstract = ""
        for abstract_text in abstract_texts:
            label = abstract_text.get('Label')
            if label:
                abstract += f"{label}: "
            abstract += abstract_text.text.strip()
            abstract += " "

        return abstract.strip()


    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
    except ElementTree.ParseError as e:
        print(f"Error parsing XML: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def get_top_abstracts(query, max_results=3):
    # Step 1: Search PubMed for the given query using esearch
    esearch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {
        'db': 'pubmed',
        'term': query,
        'retmax': max_results,  # Retrieve the top 'max_results' number of PMIDs
        'retmode': 'xml'
    }

    # Send the request to esearch
    response = requests.get(esearch_url, params=params)

    if response.status_code != 200:
        print(f"Error during PubMed search: {response.status_code}")
        return

    # Step 2: Parse the XML response from research to get the PMIDs
    root = ET.fromstring(response.content)
    pmids = [pmid.text for pmid in root.findall(".//IdList/Id")]

    # Step 3: Use efetch to retrieve the abstracts for the top PMIDs
    res = {}
    for pmid in pmids:
        res[pmid] = (get_abstract_from_pubmed(pmid))
    return esearch_url, res

# Example usage
get_top_abstracts("cancer treatment")
