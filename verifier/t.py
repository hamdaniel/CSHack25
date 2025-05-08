import requests
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
        return None # No abstract found
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

# Example usage:
pmid = "36055865"  # Replace with the PMID you want to use
abstract = get_abstract_from_pubmed(pmid)

if abstract:
  print(f"Abstract for PMID {pmid}:\n{abstract}")
else:
  print(f"Could not retrieve abstract for PMID {pmid}")


pmid2 = "33468802" # Example with multiple abstract texts
abstract2 = get_abstract_from_pubmed(pmid2)

if abstract2:
  print(f"Abstract for PMID {pmid2}:\n{abstract2}")
else:
  print(f"Could not retrieve abstract for PMID {pmid2}")


pmid3 = "37314582" # Single abstract with no label
abstract3 = get_abstract_from_pubmed(pmid3)

if abstract3:
  print(f"Abstract for PMID {pmid3}:\n{abstract3}")
else:
  print(f"Could not retrieve abstract for PMID {pmid3}")


pmid4 = "38617041" #Abstract with label
abstract4 = get_abstract_from_pubmed(pmid4)

if abstract4:
  print(f"Abstract for PMID {pmid4}:\n{abstract4}")
else:
  print(f"Could not retrieve abstract for PMID {pmid4}")

fail_pmid = "00000000" # Invalid PMID
fail_abstract = get_abstract_from_pubmed(fail_pmid)

if fail_abstract:
    print(f"Abstract for PMID {fail_pmid}:\n{fail_abstract}")
else:
    print(f"Could not retrieve abstract for PMID {fail_pmid}")
