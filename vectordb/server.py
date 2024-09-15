import os.path as op
import sys
from dotenv import load_dotenv
import os


import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import requests

from query import get_companies

from convex import ConvexClient
import requests
from groq import Groq




def findEmployee(link):
    api_key = 'JuDhY0sInQPuxT8o1KQ_eA'
    headers = {'Authorization': 'Bearer ' + api_key}
    api_endpoint = 'https://nubela.co/proxycurl/api/linkedin/company/employees/'
    params = {
        'url': link,
        'page_size': '1',
        'employment_status': 'current',
    }
    response = requests.get(api_endpoint,
                            params=params,
                            headers=headers)



    return response.json()

def getMessage(description):

    client = Groq(
        api_key="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",
    )

    resume = "Divya Makkar is a deep learning researcher and software engineer with significant contributions in AI and machine learning. At SignSpeak, she developed microcontroller-based systems for ASL speech translation, integrated Python and MongoDB for data collection, and implemented state-of-the-art time series models in PyTorch with over 92% accuracy. Additionally, she co-authored a preprint paper on Arxiv. As a software engineer at FireWatch, she built a Python GIS pipeline for wildfire prediction using linear regression and kNN, raising $10,000 in funding. Divya also co-founded Crux, an ed-tech platform scaling to over 5,000 users, leveraging RAG LLMs and deploying complex full-stack systems. She continues innovating in AI with projects like Chef.AI, implementing multimodal image perception and semantic search on a vast recipe dataset using Nvidia and Cohere models."
    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "You are a linkedin message. You have a resume and the description of the company. Draft a message to send using this and why you should apply. Here is the resume " + resume + " and here is the description of the company " + description + ". Keep the message less than 4 setences. Also fill everything in like you are sening now. Just write the message. No need to say anything else and do not include placeholders like [Company Name]. Write the message in first person and as a semi-formal messages it is a direct message after all.",

        }
    ],
    model="llama3-8b-8192",

    )

    return chat_completion.choices[0].message.content

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def home():
    return "Hello World"

@app.route('/get_companies', methods=['POST'])
def handle_post():
    if request.method == 'POST':
      prompt = request.get_json().get('params')
      companies = get_companies(prompt)

      return jsonify({'message': 'success', 'data': companies}), 200


@app.route('/get_info', methods=['POST'])
def handle_post2():
    if request.method == 'POST':
        company_ids = request.get_json().get('params')

        with open('debug.txt', 'w') as f:
            f.write(str(company_ids))

        convex_client = ConvexClient("https://quaint-mammoth-314.convex.cloud")

        linkdelns = {id: findEmployee(convex_client.query("tasks:getCompaniesById", {"taskId": id})['linkedin_url']) for id in company_ids['company_ids'] if convex_client.query("tasks:getCompaniesById", {"taskId": id})['linkedin_url'] is not "null"}
        message = {id: getMessage(convex_client.query("tasks:getCompaniesById", {"taskId": id})['short_description']) for id in company_ids['company_ids'] if convex_client.query("tasks:getCompaniesById", {"taskId": id})['short_description'] is not "null"}

        with open('debug.txt', 'w') as f:
            f.write(str(linkdelns[company_ids['company_ids'][0]]))
        for id in company_ids['company_ids']:
            if convex_client.query("tasks:getCompaniesById", {"taskId": id})['linkedin_url'] is not "null":
                try:
                    convex_client.mutation("tasks:updateCompany", {"boolVal": True, "companyId": id, "contact": linkdelns[id]['employees'][0]['profile_url'], "message": message[id]})
                except:
                    continue


        return jsonify({'message': 'success'}), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("FLASK_PORT"), debug=True)