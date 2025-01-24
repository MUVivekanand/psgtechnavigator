#streamlit setup
import streamlit as st 
import json
import urllib.parse
import io
import os
#MongoDB setup
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Azure OpenAI and Langchain setup
from langchain_openai import AzureChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Streamlit page configuration
st.set_page_config(page_title="PSG Tech Navigator", page_icon=":school:")
st.title("Ask your queries")
st.write("Find out what you need to know about each & every block of the college campus!")

# MongoDB Connection
username = os.getenv("MONGODB_USERNAME")
pwd = os.getenv("MONGODB_PASSWORD")

if not username or not pwd:
    st.error("MongoDB credentials are not set in the .env file.")
else:
    client = MongoClient(
        f"mongodb+srv://{urllib.parse.quote(username)}:{urllib.parse.quote(pwd)}@cluster0.mudbexc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    db = client["BlockDetails"]
    collection = db["PSGTechNavigator"]


azure_key = os.getenv("AZURE_KEY")
azure_deployment = os.getenv("AZURE_DEPLOYMENT")
azure_endpoint = os.getenv("AZURE_ENDPOINT")

llm = AzureChatOpenAI(
    api_key=azure_key,
    api_version="2023-03-15-preview",
    temperature=0,
    max_tokens=None,
    azure_endpoint=azure_endpoint,
    azure_deployment=azure_deployment
)

input = st.text_area("Enter your question here:")
with io.open("sample.txt","r",encoding="utf-8") as f1:
    sample = f1.read()
    
prompt = """
You are a very intelligent AI assistant who is expert in identifying relevant questions from users
and converting them into a NoSQL MongoDB aggregation pipeline query.

Note: You MUST return ONLY a valid JSON MongoDB aggregation pipeline query. 
No additional text or explanation is allowed.

Schema:
1. **_id**: Unique identifier for the buildings.
2. **title**: Name of the building.
3. **description**: Full description of the building.
4. **nooffloors**: Number of floors in the building.
5. **connectedto**: Buildings that can be accessed or connected to it.
6. **deptavailable**: Array containing departments present in the building.

Sample Context:
Here are some example questions along with their corresponding MongoDB aggregation queries:

Important considerations:
Identify the field name from the query and search the field name in the collection.

sample_question: {sample}
As an expert you must use them whenever required.
Note: You have to just return the query nothing else. Don't return any additional text with the query. Please follow this strictly.
input: {question}
output:
"""

query_with_prompt = PromptTemplate(
    template=prompt,
    input_variables=["question", "sample"]
)

llmchain = LLMChain(llm=llm, prompt=query_with_prompt, verbose=True)

if input:
    button = st.button("Submit")
    if button:
        try:
            response = llmchain.invoke({
                "question": input,
                "sample": sample
            })
            query_text = response["text"].strip().replace("```json", "").replace("```", "").strip()
            
            try:
                query = json.loads(query_text)
                results = collection.aggregate(query)
                response_text = "\n".join([str(result) for result in results])
                st.write(response_text)  # Send plain text response
            except json.JSONDecodeError:
                st.error("Invalid JSON response received. Please check the model's output.")
                st.write(query_text)
        except Exception as e:
            st.error(f"An error occurred: {e}")
            
try:
    test_doc=collection.find_one()
    if test_doc:
        st.success("Successfully connected to MongoDB!")
    else:
        st.warning("Connected to MongoDB, but the collection is empty.")
except Exception as e:
    st.error("Failed to connect to MongoDB.")
    st.write(f"Error details: {e}")


import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import threading


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class ChatRequest(BaseModel):
    query: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    input_query = request.query
    
    try:
        response = llmchain.invoke({
            "question": input_query,
            "sample": sample
        })
        query_text = response["text"].strip().replace("```json", "").replace("```", "").strip()
        
        try:
            query = json.loads(query_text)
            results = collection.aggregate(query)
            response_text = "\n".join([str(result) for result in results])
            return {"response": response_text}
        except json.JSONDecodeError:
            return {"response": "Invalid query generated"}
    except Exception as e:
        return {"response": f"An error occurred: {str(e)}"}

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8502)

# Start FastAPI in a separate thread
fastapi_thread = threading.Thread(target=run_fastapi, daemon=True)
fastapi_thread.start()