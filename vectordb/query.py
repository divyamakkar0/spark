from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import JSONLoader
import json
from pathlib import Path
from pprint import pprint
import cohere
import os
from field_parser import get_fields


model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {"device": "mps"}
encode_kwargs = {"normalize_embeddings": False}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name, model_kwargs=model_kwargs, encode_kwargs=encode_kwargs
)

a = '239ac115-7e4e-48c6-bad9-39a456965d64'
hnsw = {
    "hnsw:space": "cosine",
    "hnsw:construction_ef": 10000,
    "hnsw:M": 16,
    "hnsw:search_ef": 10000,
}
vector_store = {
    "location_identifiers": Chroma(
                            collection_name="location_identifiers" + a,
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/location_identifiers" + a,
                            collection_metadata=hnsw
                            ),


                }

with open('./data/merged.json') as json_file:
    companies = json.load(json_file)['messages']


def get_companies(prompt:str)->list[str]:

  fields = get_fields(prompt)

  void_fields = []
  query_vector = vector_store["location_identifiers"].similarity_search_with_score(query=fields['location_identifiers'], k=10000)
  void_fields.append('location_identifiers')

  for i in fields:
      if fields[i] == '':
          void_fields.append(i)

  companies_shortlist = []

  for company in query_vector:
          if len(companies_shortlist) > 1000:
              break
          if company[1] > 0.25:
              break
          companies_shortlist.append(company[0].metadata['seq_num'] - 1)
  co = cohere.Client(os.environ['COHERE_API_KEY'])

  query_cohere = str({i:fields[i] for i in fields if i not in void_fields})
  docs = [str(companies[i]) for i in companies_shortlist]
  results = co.rerank(query=query_cohere, documents=docs, top_n=25, model="rerank-english-v3.0")

  final_companies = [companies[companies_shortlist[results.results[i].index]] for i in range(len(results.results))]
  return final_companies


if __name__ == '__main__':
    prompt = input('Enter a prompt: ')
    print(get_companies(prompt))