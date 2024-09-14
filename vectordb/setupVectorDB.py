import chromadb
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import JSONLoader
import json
from pathlib import Path
from pprint import pprint
import re
import ast
from uuid import uuid4
import math


model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {"device": "mps"}
encode_kwargs = {"normalize_embeddings": False}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name, model_kwargs=model_kwargs, encode_kwargs=encode_kwargs
)


def extract_permalinks(input_string):
    try:
        data = ast.literal_eval(input_string)
        if type(data) == list:
            permalinks = [d["value"] for d in data if "value" in d]
            result = ", ".join(permalinks)
            return result
        else:
            result = data["value"]
            if type(result) != str:
                result = str(result)
            return result
    except:
        return ""


loaders = {
    "location_identifiers": JSONLoader(
        file_path="./data/merged.json",
        jq_schema=".messages[].location_identifiers",
        text_content=False,
    ).load(),
}


for i in range(len(loaders["location_identifiers"])):
    loaders["location_identifiers"][i].page_content = extract_permalinks(
        loaders["location_identifiers"][i].page_content
    )


uuids = [str(uuid4()) for _ in range(len(loaders["location_identifiers"]))]


hnsw = {
    "hnsw:space": "cosine",
    "hnsw:construction_ef": 10000,
    "hnsw:M": 16,
    "hnsw:search_ef": 10000,
    "hnsw:num_threads": 8,
}


vector_store = {
    "location_identifiers": Chroma(
        collection_name="location_identifiers" + a,
        embedding_function=embeddings,
        persist_directory="./chroma_langchain_db/location_identifiers" + a,
        collection_metadata=hnsw,
    )
}

batch_size = 5000
length = len(loaders["location_identifiers"])

for i in range(1, math.floor(length/batch_size) + 1):
  for key in vector_store.keys():
    print(key)
    end_index = min(i * batch_size + batch_size, length)
    vector_store[key].add_documents(documents=loaders[key][i*batch_size:end_index], ids=uuids[i*batch_size:end_index])


print("done")