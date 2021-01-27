## Inspiration

The project I am most proud of is MoodMatch, which is a Facebook Messenger ChatBot that recommeds songs and movies based on a user’s current mood. When one thinks of vacation, the first thing that comes to mind is a setting like Hawaii or some tropical island or perhaps even beautiful wildlife. But due to this unprecedented time in our world, it is difficult to make these vacation dreams into reality, in turn forcing people to rely on some virtual way of getting the vacation vibes. This, along-with the issue of not being able to understand one’s true emotions and grasp what is needed to acquire a more positive mindset inspired me to create MoodMatch.

MoodMatch understands the user’s current emotions by asking several personalized questions and using novel sentimental analysis algorithms to deliver several songs or movies which will cheer up the mood of the user.

Creating a bot was not something I could've imagined me doing a few months ago, but now I have fully learned one example of the end-to-end programming pipeline. Getting over the aforementioned challenges and not giving up throughout the process has not only given me more technical knowledge, but it has impacted me mentally as I am more confident in my coding ability after this project. I fully learned the end to end programming pipeline of sorts. In particular, I learned the ins and outs of the various APIs I worked with and understanding how to deploy/manage server based applications like a messenger chatbot.

## What it does

MoodMatch is a Facebook Messenger ChatBot that recommends songs and movies based on a user’s current mood. MoodMatch understands the user’s current emotions by asking several personalized questions and using novel sentimental analysis algorithms to deliver several songs or movies which will cheer up the mood of the user.

## How I built it

Before this project, I was very new to the ideas of creating a project. This project introduced me to the end-to-end programming pipeline. I started by first mapping out what I had to do:
1. Obtain a list of songs, artists, and lyrics of the songs  and similarly movies, and years they were created in<br />
2. Perform sentimental analysis on the songs and movie titles as well as movie summaries to understand what kinds of feelings are exhibited by the song/movie <br />
3. Create a messenger bot <br />
4. Program the messenger bot to ask the user questions <br />
5. Process the results (sentimental analysis on the chosen choices) <br />
6. Recommend songs or movies with similar sentiment levels or perhaps higher sentiment levels to cheer one up <br />
7. Created a fully functioning webpage that allows users to try out MoodMatch directly on the website <br />

I followed this process thoroughly and used the Microsoft Azure Cognitive Science API to perform sentimental analysis. I also used various APIs including Spotify, Genius Lyrics, and various others. 
Originally, I had meant for MoodMatch to pop up a Messenger Webview and encourage users to fill out a form that would then allow for the processing of data, however, Facebook’s innovative Quick Replies module on Messenger allowed me to make MoodMatch more interactive and personalized for users.

I also learned the importance of using various REST APIs including TMDB (The Movie DataBase) and various movie trailer npm packages.


## What's next for MoodMatch
A lot is in store for MoodMatch, ranging from automating the song updates as well as adding more factors that may influence someone's choice of song. I plan on having an autorefresh of sorts for the list of songs already scraped off the web right now, so that users will continuously get different songs. Perhaps even employing an account scenario in which users are never recommended the same song on multiple occasions is also one thing I plan to work on. Lastly, a lot of factors go into one’s feelings and current emotions, which definitely cannot be grasped by the current 2 questions asked my MoodMatch. I plan on adding more of these questions and even an open-ended question of sorts, in which users can type in their response and emotional analysis will be performed on their inputs. In fact a few of these are already in the works so be on the lookout for upcoming updates ;) Feel free to checkout moodmatch.tech and watch our video to learn more about what’s coming soon!