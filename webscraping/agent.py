website = "https://www.crunchbase.com/organization/groq"

addons = ["/company_financials", "/people", "/technology", "/company_products", "/company_funding_rounds", "/company_acquisitions", "/company_competitors", "/company_investors", "/company_investments", "/company_offices", "/company_funding_rounds", "/company_acquisitions", "/company_competitors", "/company_investors", "/company_investments", "/company_offices", "/company_funding_rounds", "/company_acquisitions", "/company_competitors", "/company_investors", "/company_investments", "/company_offices", "/company_funding_rounds", "/company_acquisitions", "/company_competitors", "/company_investors", "/company_investments", "/company_offices"]

from crewai_tools import ScrapeWebsiteTool

# To enable scrapping any website it finds during it's execution
tool = ScrapeWebsiteTool()

# Initialize the tool with the website URL, so the agent can only scrap the content of the specified website
tool = ScrapeWebsiteTool(website_url=website)

# Extract the text from the site
text = tool.run()
print(text)