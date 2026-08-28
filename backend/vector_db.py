import os
from pinecone import Pinecone

# Initialize Pinecone vector database client
api_key = os.getenv("PINECONE_API_KEY", "your-pinecone-api-key")

pc = Pinecone(api_key=api_key)

def get_pinecone_index(index_name="immigration-knowledge-base"):
    return pc.Index(index_name)
