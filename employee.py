import requests

def findEmployee(link):
    api_key = 'JuDhY0sInQPuxT8o1KQ_eA'
    headers = {'Authorization': 'Bearer ' + api_key}
    api_endpoint = 'https://nubela.co/proxycurl/api/linkedin/company/employees/'
    params = {
        'url': link,
        'page_size': '1',
        'employment_status': 'current',
    }
    response = requests.get(api_endpoint,
                            params=params,
                            headers=headers)

    #send them a message
    # if response.status_code == 200:
    #     url = response.json()['employees'][0]['profile_url']
    #     id = url.rstrip('/').split('/')[-1]
    #     api = Linkedin("divyamakkar000@gmail.com", "dm707485!")
    #     profile = api.get_profile(id)
    #     contact_info = api.get_profile_contact_info(id)
    #     message = "message"
    #     send_message = api.send_message(message, recipients=[profile['urn_id']])