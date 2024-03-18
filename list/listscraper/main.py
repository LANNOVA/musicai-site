import requests
import json
import csv
from bs4 import BeautifulSoup

url = "https://voice-models.com/fetch_data.php"
headers = {
    'authority': 'voice-models.com',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'cookie': 'PHPSESSID=1mnj0lkhgtjnj8iadq3sr9mlc6; _ga=GA1.1.301576238.1710671754; _clck=1wmo351%7C2%7Cfk5%7C0%7C1537; _clsk=9eh7jc%7C1710677786638%7C2%7C1%7Cd.clarity.ms%2Fcollect; _ga_N3GCHZES3B=GS1.1.1710677785.2.1.1710677828.0.0.0; ph_phc_fYv2RBMyqT0sbcvncr1tIk48XNzay7qHnuBzperbF9R_posthog=%7B%22distinct_id%22%3A%22018e4bfb-7901-73b6-b020-0c1df7163336%22%2C%22%24sesid%22%3A%5B1710677839885%2C%22018e4c57-7ade-703c-8859-426ba31cfdd7%22%2C1710677785310%5D%7D',
    'origin': 'https://voice-models.com',
    'referer': 'https://voice-models.com/',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
    'x-requested-with': 'XMLHttpRequest'
}

# Open CSV file for writing
with open('voice_models.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Name', 'Link']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    # Initialize count for pagination
    page = 1

    while True:
        payload = {"page": page, "search": ""}
        response = requests.post(url, headers=headers, data=payload)

        rjson = json.loads(response.text)
        table = rjson['table']

        soup = BeautifulSoup(table, 'html.parser')
        names = soup.find_all('a', class_='fs-5')
        links = soup.find_all('button', class_='copy-btn btn btn-sm fw-bold btn-light ms-2 p-1 ps-2 pe-2')
        if not names:  # If no names are found, break out of the loop
            break

        # Extract and write names and links to CSV file
        for name, link in zip(names, links):
            writer.writerow({'Name': name.text.strip(), 'Link': link['data-clipboard-text']})

        page += 1  # Move to the next page
