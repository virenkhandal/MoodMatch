import requests

#TOKEN below should be the string that the API docs tells you
#Clearly I'm not giving mine out here on the internet. That'd be dumb
base_url = "http://api.genius.com"
#Key line below here when, this is how to authorize your request when
#using the API
headers = {'Authorization': 'Bearer TOKEN'}
search_url = base_url + "/search"
song_title = "In the Midst of It All"
params = {'q': song_title}
response = requests.get(search_url, params=params, headers=headers)


