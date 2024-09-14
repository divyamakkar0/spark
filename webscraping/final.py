import os
from crewai import Agent, Task, Crew
from dotenv import load_dotenv
load_dotenv()
# Importing crewAI tools
from crewai_tools import (
    SerperDevTool,
    WebsiteSearchTool
)

def internet_research(query: str, company: str):

    user_query = query
    company_info = company

    search_tool = SerperDevTool()
    web_rag_tool = WebsiteSearchTool()

    # Create agents
    researcher = Agent(
        role='Startup News Researcher',
        goal='Provide the latest news about a given startup with a user query',
        backstory='An expert researcher with a keen eye for gathering insightful information based on client prompts',
        tools=[search_tool, web_rag_tool],
        verbose=True
    )

    research = Task(
        description=f'Given a company name, search the latest news about the company according to the user query. The user query is: {user_query}. The company they want information on is: {company_info}',
        expected_output='A summary of the given user query on the specified company. Keep it short and concise, no more than 50 words.',
        agent=researcher
    )

    crew = Crew(
        agents=[researcher],
        tasks=[research],
        verbose=True,
        planning=True, 
    )

    result = crew.kickoff()
    # print(result)
    return result

    # with open('results.txt', 'w') as f:
    #     f.write(result)

if __name__ == "__main__":
    response = internet_research("Recent advancements in Cohere in reranking", "Cohere")
    print(response)
