import chromadb
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import JSONLoader
import json
from pathlib import Path
from pprint import pprint
import re
import ast


model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'mps'}
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

vector_store = Chroma(
    collection_name="example",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db"
)


def extract_permalinks(input_string):
    try:
        data = ast.literal_eval(input_string)
        if type(data) == list:
          permalinks = [d['value'] for d in data if 'value' in d]
          result = ', '.join(permalinks)
          return result
        else:
            result = data['value']
            if type(result) != str:
                result = str(result)
            return result
    except:
        return ""

vector_store = {
    "short_description": Chroma(
                         collection_name="short_description",
                         embedding_function=embeddings,
                        persist_directory="./chroma_langchain_db/short_description"
                          ),
    "num_employees_enum": Chroma(
                            collection_name="num_employees_enum",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/num_employees_enum"
                            ),
    "location_identifiers": Chroma(
                            collection_name="location_identifiers",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/location_identifiers"
                            ),
    "last_funding_total": Chroma(
                            collection_name="last_funding_total",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/last_funding_total"
                            ),
    "description": Chroma(
                            collection_name="description",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/description"
                            ),
    "category_groups": Chroma(
                            collection_name="category_groups",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/category_groups"
                            ),
    "last_funding_type": Chroma(
                            collection_name="last_funding_type",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/last_funding_type"
                            ),
    "categories": Chroma(
                            collection_name="categories",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/categories"
                            ),

    "last_funding_at": Chroma(
                            collection_name="last_funding_at",
                            embedding_function=embeddings,
                            persist_directory="./chroma_langchain_db/last_funding_at"
                            ),

                }

loaders = {
    "short_description": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].short_description',
        text_content=False).load(),
    "num_employees_enum": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].num_employees_enum',
        text_content=False).load(),
    "location_identifiers": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].location_identifiers',
        text_content=False).load(),
    "last_funding_total": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].last_funding_total',
        text_content=False).load(),
    "description": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].description',
        text_content=False).load(),
    "category_groups": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].category_groups',
        text_content=False).load(),
    "last_funding_type": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].last_funding_type',
        text_content=False).load(),
    "categories": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].categories',
        text_content=False).load(),
    "last_funding_at": JSONLoader(
        file_path='./data/merged.json',
        jq_schema='.messages[].last_funding_at',
        text_content=False).load(),
}


for i in range(len(loaders["location_identifiers"])):

    loaders["last_funding_total"][i].page_content = str(loaders["last_funding_total"][i].page_content)
    loaders["location_identifiers"][i].page_content = extract_permalinks(loaders["location_identifiers"][i].page_content)
    loaders["last_funding_total"][i].page_content = extract_permalinks(loaders["last_funding_total"][i].page_content)
    loaders["category_groups"][i].page_content = extract_permalinks(loaders["category_groups"][i].page_content)
    loaders["categories"][i].page_content = extract_permalinks(loaders["categories"][i].page_content)

length = len(loaders["short_description"])

batch_size = 5000

for i in range(0, length-batch_size, batch_size):
  for key in vector_store.keys():
    print(key)
    if type(loaders[key][i].page_content) != str:
        loaders[key][i:i+batch_size].page_content = str(loaders[key][i:i+batch_size].page_content)
    vector_store[key].add_documents(documents=loaders[key][i:i+batch_size])