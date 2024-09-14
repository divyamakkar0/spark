import chromadb
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import JSONLoader
import json
from pathlib import Path
from pprint import pprint


#setup embedding models
model_name = "sentence-transformers/all-mpnet-base-v2"
model_kwargs = {'device': 'mps'} # change to cuda if not using mac
encode_kwargs = {'normalize_embeddings': False}
embeddings = HuggingFaceEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)


vectorDbs = [
   Chroma(
    collection_name="name",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db/name"
  ),
   Chroma(
    collection_name="name",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db/"
  ),
   Chroma(
    collection_name="name",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db"
  ),
   Chroma(
    collection_name="name",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db"
  ),
  Chroma(
    collection_name="name",
    embedding_function=embeddings,
    persist_directory="./chroma_langchain_db"
  ),
]

loader = JSONLoader(
    file_path='./data/merged.json',
    jq_schema='.messages[].name',
    text_content=False)

data = loader.load()
print(type(data))


queries = []

assert len(queries) == len(vectorDbs)

for i in range(len(queries)):



loader = JSONLoader(
    file_path='./data/merged.json',
    jq_schema='.messages[].name',
    text_content=False)

data = loader.load()
print(type(data))