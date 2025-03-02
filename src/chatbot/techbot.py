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

# Google Gemini setup
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

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

# Initialize Gemini model
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    st.error("Gemini API key is not set in the .env file.")
else:
    gemini_model = ChatGoogleGenerativeAI(
        api_key=GEMINI_API_KEY,
        model="gemini-2.0-flash",
        temperature=0
    )

script_dir = os.path.dirname(__file__) 
file_path = os.path.join(script_dir, 'sample.txt')

input = st.text_area("Enter your question here:")
with open(file_path, 'r', encoding='utf-8') as f1:
    sample = f1.read()

# Define prompt template for query generation
query_prompt_template = ChatPromptTemplate.from_messages([
    ("system", """
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
    
    {sample}
    
    Important considerations:
    Identify the field name from the query and search the field name in the collection.
    
    Note: You have to just return the query nothing else. Don't return any additional text with the query. Please follow this strictly.
    """),
    ("human", "{question}")
])

# Define prompt template for formatting results
format_prompt_template = ChatPromptTemplate.from_messages([
    ("system", """
    You are a helpful assistant for PSG Tech campus. Your task is to take the raw database results 
    about campus buildings and format them into a natural, conversational response.
    
    Present the information clearly as if you are directly answering the user's question.
    Don't mention that this information comes from a database or query.
    Don't list technical fields unless they're directly relevant to the user's question.
    
    Structure your response in paragraphs with appropriate formatting.
    """),
    ("human", """
    User question: {question}
    
    Database results: {results}
    
    Please format these results into a natural, helpful response:
    """)
])

# Function to process user query with Gemini
def process_query(user_query, sample_data):
    try:
        formatted_prompt = query_prompt_template.format(
            question=user_query,
            sample=sample_data
        )
        
        response = gemini_model.invoke(formatted_prompt)
        query_text = response.content.strip()
        
        # Clean up the response if it has code blocks
        if "```json" in query_text:
            query_text = query_text.split("```json")[1].split("```")[0].strip()
        elif "```" in query_text:
            query_text = query_text.split("```")[1].split("```")[0].strip()
            
        return query_text
    except Exception as e:
        return f"Error processing query: {str(e)}"

# Function to format database results into natural language
def format_results(user_query, db_results):
    try:
        # Convert results to a more readable format if they're not already a string
        if not isinstance(db_results, str):
            readable_results = json.dumps(db_results, indent=2)
        else:
            readable_results = db_results
            
        format_prompt = format_prompt_template.format(
            question=user_query,
            results=readable_results
        )
        
        response = gemini_model.invoke(format_prompt)
        return response.content.strip()
    except Exception as e:
        return f"Error formatting results: {str(e)}"

if input:
    button = st.button("Submit")
    if button:
        try:
            query_text = process_query(input, sample)
            
            try:
                query = json.loads(query_text)
                results = list(collection.aggregate(query))
                
                if results:
                    # Format the results into natural language
                    formatted_response = format_results(input, results)
                    st.write(formatted_response)
                else:
                    st.write("I couldn't find any information about that in our database. Could you try asking differently?")
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
        query_text = process_query(input_query, sample)
        
        try:
            query = json.loads(query_text)
            results = list(collection.aggregate(query))
            
            if results:
                # Format the results into natural language
                formatted_response = format_results(input_query, results)
                return {"response": formatted_response}
            else:
                return {"response": "I couldn't find any information about that in our database. Could you try asking differently?"}
        except json.JSONDecodeError:
            return {"response": f"Invalid query generated: {query_text}"}
    except Exception as e:
        return {"response": f"An error occurred: {str(e)}"}

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8502)

# Start FastAPI in a separate thread
fastapi_thread = threading.Thread(target=run_fastapi, daemon=True)
fastapi_thread.start()