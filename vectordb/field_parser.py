import os.path as op
from enum import Enum
from typing import List, Union, Optional
import os
from dotenv import load_dotenv

load_dotenv(override=True)

from pydantic import BaseModel
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# prompt = "Fintechs in San Francisco with <100 employees that recently raised funding"

class FundingRounds(str, Enum):
    angel = "Angel"
    private_equity = "Private Equity"
    crowdfunding = "Crowdfunding"
    secondary = "Secondary Market"
    seed = "Seed"
    series_a = "series_a"
    series_b = "series_b"
    series_c = "series_c"
    series_d = "series_d"
    series_e = "series_e"
    series_f = "series_f"
    series_g = "series_g"
    series_h = "series_h"
    series_i = "series_i"
    series_j = "series_j"
    undisclosed = "series_unknown"

class Employees(str, Enum):
    onetoten = "c_00001_00010"
    eleventofifty = "c_00011_00050"
    fiftyonetohundred = "c_00051_00100"
    hundredtotwofifty = "c_00101_00250"
    twofiftytofivehundred = "c_00251_00500"
    fifehundredtothousand = "c_00501_01000"
    thousandtofivethousand = "c_01001_05000"
    fivethousandtoten = "c_05001_10000"
    # tenthousandplus = "c_10001_"

class Categories(str, Enum):
    ai = "artificial-intelligence"
    electronics = "consumer-electronics"
    data = "data-and-analytics"
    hardware = "hardware"
    software = "software"
    science_eng = "science-and-engineering"
    apps = "apps"
    fintech = "fintech"
    cybersecurity = "cybersecurity"
    SaaS = "software-as-a-service"
    healthtech = "healthtech-healthcare"
    ecommerce = "ecommerce"
    legal_tech = "legal-tech"
    education = "education"
    food = "food-technology"
    transportation = "transportation"
    sales = "sales-marketing"
    it_tech = "information-technology"
    design = "design"
    blockchain_crypto = "blockchain-cryptocurrency"
    quantum = "quantum"
    biotechnology = "biotechnology"
    security = "security"
    media_entertainment = "media-entertainment"
    # blockchain_crypto = "blockchain-cryptocurrency"
    # blockchain_crypto = "blockchain-cryptocurrency"


class Fields(BaseModel):
    description: str
    # founding_date: list[str]
    hq_location: str
    # hq_location_state_country: str
    industry: list[Optional[Categories]]
    # investors: str
    last_funding_round: list[Optional[FundingRounds]]
    last_funding_round_amount: str
    last_funding_round_date: str
    # last_funding_round_date: str
    number_of_employees: list[Optional[Employees]]
    # founders: list[str]
    # total_funding: str

def get_fields(prompt : str):
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": "You're an AI assitant that is highly knowledgeable in parsing user queries to pre-defined fields and values for a company's database"},
            {"role": "user", "content": f"User prompt is: <prompt>{prompt}</prompt>. <job>Your job is to convert this into the JSON schema as specified. for each field, LEAVE it blank if it does not apply to the prompt. For each feild, only choose tags (can be more than 1) as exactly matched. <specific instructions> extract the meaning out of the prompt for the extracted fields. if the prompt has some statement, select all fields that match it (<FOR EXAMPLE ONLY>: if they say less than 100, you need to select the 1-10, 11-50, 51-100 tags. for all fields, convert popular acroynms such as SF to their concise names, like San Franciso. </EXAMPLE END>). </job> Output as an exact JSON format"},
        ],
        response_format=Fields,
    )

    result = completion.choices[0].message.parsed
    # print(type(research_paper))
    # print(result)
    dict = {}
    dict["description"] = result.description
    dict["location_identifiers"] = result.hq_location
    dict["categories"] = ", ".join([str(i.value) for i in result.industry])
    dict["last_funding_type"] = ", ".join([str(i.value) for i in result.last_funding_round])
    dict["last_funding_total"] = str(result.last_funding_round_amount)
    dict["last_funding_at"] = str(result.last_funding_round_date)
    dict["num_employees_enum"] = ", ".join([str(i.value) for i in result.number_of_employees])
    # dict["founders"] = [i for i in result.founders]
    # print(dict)
    return dict
    # return research_paper

if __name__ == "__main__":
    prompt = "AI and financial startups in NYC that recently raised funding with less than 100 employees and raised $1M+ in funding"
    result = get_fields(prompt)
    # print("description:", result.description)
    # print("hq_location:", result.hq_location)
    # print("industry:", result.industry)
    # print("last_funding_round:", result.last_funding_round)
    # print("last_funding_round_amount:", result.last_funding_round_amount)
    # print("number_of_employees:", result.number_of_employees)
    # # print("founders:", result.founders)
    # print(type(result.industry))
    # print(type(result.description))

    # print(result)




# convertible_note = "Convertible Note"
# corporate = "Corporate Round"
# debt = "Debt Financing"
# equity = "Equity Crowdfunding"
# grant = "Grant"
# ico = "Initial Coin Offering"
# non_equity_assistance = "Non-equity Assistance"
# post_ipo_debt = "Post-IPO Debt"
# post_ipo_equity = "Post-IPO Equity"
# post_ipo_secondary = "Post-IPO Secondary"