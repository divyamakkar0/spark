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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.getenv("FLASK_PORT"), debug=True)