import json
import pandas as pd


with open('./jsons/AI.json', 'r') as f:
    AI = json.load(f)

with open('./jsons/Crypto.json', 'r') as f:
    Crypto = json.load(f)

with open('./jsons/Fintech.json', 'r') as f:
    Fintech = json.load(f)

with open('./jsons/Qc.json', 'r') as f:
    Qc = json.load(f)

with open("./jsons/C2.json", 'r') as f:
    C2 = json.load(f)

different_jsons = [AI, Crypto, Fintech, Qc, C2]

cleaned_array = []
set_uuids = set()

def add_to_cleaned_array(jsons):

  for j in different_jsons:
    for i in j:
        if i['uuid'] not in set_uuids:
            cleaned_array.append(i)
            set_uuids.add(i['uuid'])

add_to_cleaned_array(different_jsons)
print(len(cleaned_array))

final_json = {
  "messages": cleaned_array
}


final_json = json.dumps(final_json, indent=4)
with open('merged.json', 'w') as f:
    f.write(final_json)