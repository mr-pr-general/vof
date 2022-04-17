# -*- coding: utf-8 -*-
"""
Created on Sat Apr 16 09:47:52 2022

@author: pablo
"""


from bs4 import *
import requests
from selenium import webdriver
import json
#from google.colab import files

def scrape_toronto():
    
    
    
    
    url = "https://www.volunteertoronto.ca/networking/search_results.asp?__ASPVIEWSTATE=78b2850b9092e16b17a8cb8118311074acb54bb9626f1419e0d17b90e760333286bf91446dd26ee1fdb8ff6f2ffe30a6236317758ce4fde26805cc76b1fb70be8efdf0fde699d0c014b52138c4e3e766de9f8d3be1521a7337088b3a646e7b18789a199b33cdd852f024233c469b918f393ef27e4cae6d2dd2c0a13a8650f1dcc7410710193f5b5469d8535616ea350e9eb8e3b436abb11f848f48ac9ff11eaea815cfa0f460fb0cab07764c8b44e5c9281d0b9c8786903f9355f0d8c80c373dfa0cf5a48834a2b421f649d248fc86df1574c755baeb2690535ebb0984f784ff10df6377f3844014a96b35c23d71c817b4b4531f1f1953bd3981ae4985583155b319c96ba9fccdc46a6277b6&DGPCrSrt=&DGPCrPg=1"

    driver = webdriver.Edge()
    driver.get(url)
    
    html = driver.page_source
    soup = BeautifulSoup(html, features="lxml")
    c = 0
    new = soup.find(id='SpContent_Container')
    pages_section = new.find_all('div')[2]
    pages = int(pages_section.b.text[-1:])
    print(pages)
    urls = [url]
    for i in range(pages + 1):
        if i != 0:
            new_url = url[:-1] + str(i)
            if new_url != url:
                urls.append(new_url)
    print(urls)
    
    full_table_dicts = []
    for url in urls:
        if c != 0:
            driver.get(url)
            html = driver.page_source
            soup = BeautifulSoup(html, features="lxml")
        
            new = soup.find(id='SpContent_Container')
    
        rows_table = []
        for row in new.find_all('tr'):
            clas = (row.get('class'))
            #print(clas)
            if clas == ['item'] or clas ==['altitem']:
                rows_table.append(row)
        
        
        for row in rows_table:
            items = row.find_all('td')
            first_item = items[0]
            name = first_item.b.text
            link = first_item.a.get('href')
            location = str(first_item.text)
            location = location[len(first_item.b.text):]
            location = location.strip()
            category = str.strip(items[1].text)
            organization = str.strip(items[2].text)
            date_posted = str.strip(items[3].text)
            position = (link.find('id='))
            ids = (link[position + 3:])
    
            dictionary_rows = {'id': ids, 'name': name, 'link': link, "location": location, 'organization': organization, 'date_posted': date_posted}
            full_table_dicts.append(dictionary_rows)
        print(full_table_dicts)
        c += 1
    
    c_original = 0 
    for row in full_table_dicts:
        new_url = "https://www.volunteertoronto.ca/networking/" + row['link']
        print(new_url)
        driver.get(new_url)
        html = driver.page_source
        soup = BeautifulSoup(html)
        interior_content = soup.find(id="SpContent_Container")
        #print(interior_content.find(id="SpContent_Container").table)
        contents = interior_content.find(id="SpContent_Container").table
        sections = contents.find_all('tr')
        row['Date Needed'] = ''
        row["Type of Position"] = ''
        row['Description'] = ''
        row['Where to Apply'] = ''
        #print(row)
        c = 0
        for section in sections:
            splitted = str(section.text)
            #print(splitted)
            if section.a != None:
                row['Where to Apply'] = section.a.get('href')
            if "Date Needed" in splitted:
                row['Date Needed'] = splitted.strip().split('\n')[1]
            elif "Type of Position" in splitted:
                #print('here_2')
                row['Type of Position'] = splitted.strip().split('\n')[1]
            elif "Description & Details" in splitted:
                for new_section in sections[c + 1:]:
                    #print('here')
                    #print(type(row['Description']))
                    #print(new_section.text)
                    if new_section.a != None:
                        row['Where to Apply'] = new_section.a.get('href')
                    row['Description'] += new_section.text
                    #print(row['Description'])
                break
            c += 1
        #print(row)
        full_table_dicts[c_original] = row.copy()
    
    
    
    with open("volunteer_toronto.json", 'w') as final:
        json.dump(full_table_dicts, final)
        
    
    
    
    
scrape_toronto()