'use strict';
const PAGE_ACCESS_TOKEN = 'EAAD04ncSFgEBAE8vq6iSppJqpGvIEblzTeyq8SAKE0JJ7aqrPGsYZCAFsq2wSKTbq6zIwzUK0zdA31M6FVF9MYwxFHZC8fdHIYZBqshuGCwZBb743hZC08chwOSiTrJfXCDYVmiWDVvulIl15bqbDFMW95tXWrk6DfZBJST9nnj2K19mSc4LaUR7ZAmBqzFBC4ZD';
// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  path = require('path'),
  d3 = require('d3-fetch'),
  csv = require('csv-parser'),
  fs = require('fs'),
  math = require('mathjs'),
  readline = require('readline'),
  movieTrailer = require( 'movie-trailer' ),
  app = express().use(body_parser.json()); // creates express http server

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: '8514e6dbe2114a3e942dc012eb11f882',
  secret: 'd14b2aba57224628a15edc4c6fc47cd5'
});
var string;
var category;
var client_id = '8514e6dbe2114a3e942dc012eb11f882';
var client_secret = 'd14b2aba57224628a15edc4c6fc47cd5';
var token = 'BQBXJmPMngc2VfaYDi-HDd7KMaxeOx4G0gnueFaKemk_b4xvM9xNt76TY3v9rGyVOVdT3aUsz98xoYvK_Zc';
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {

        handlePostback(sender_psid, webhook_event.postback);
      }

    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "customToken";

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {

    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Handles messages (received_message) from sender (sender_psid) and responds accordingly
function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains text
  console.log(received_message.text);
  if (received_message.text === 'Watch a movie'){
    category = "movie";
    response = setPreferences(sender_psid);
  } else if (received_message.text === 'Listen to music'){
    category = "music";
    response = setPreferences(sender_psid);
  } else if (received_message.text === 'Great'){
    string = received_message.text;
    response = sendImages('great');
  } else if (received_message.text === 'Ok'){
    string = received_message.text;
    response = sendImages('ok');
  } else if (received_message.text === 'Sad'){
    string = received_message.text;
    response = sendImages('sad');
  } else if (received_message.text === 'Partying' | received_message.text === 'Dancing Alone' | received_message.text === 'Love'
             | received_message.text === 'Studying' | received_message.text === 'Sunset' | received_message.text === 'Flowers'
              | received_message.text === 'Rainy Day' | received_message.text === 'Heartbreak' | received_message.text === 'Thinking'){
    string = string + " " + received_message.text;
    let list = [];
    if (category === "music"){
        let boo = {"text": `Here is some music you should definitely listen to right now:`};
        callSendAPI(sender_psid, boo);
    } else if (category === "movie"){
        let boo = {"text": `Here are some movies you should definitely watch to right now:`};
        callSendAPI(sender_psid, boo);
    }
    if (category === "music"){
        const func = async() => {
            list = await sentimentAnalysis(textAnalyticsClient, string);
            console.log("List: " + list);
            var norms = {};
            fs.createReadStream('analyzed.csv').pipe(csv(['Song', 'Artist', 'Pos', 'Neg', 'Ntr'])).on('data', (row) => {
                var song = row[0]; var ratings = [row[4], row[5], row[6]];
                var songpos = row[4]; var songneg = row[5]; var songntr = row[6];
                var listpos = list[0]; var listneg = list[1]; var listntr = list[2];
                var dx = listpos - songpos; var dy = listneg - songneg; var dz = listntr - songntr;
                var norm = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
                //console.log(norm);
                //var norm = math.norm(ratings, list);
                norms[song] = norm;
                //console.log(norm);
            }).on('end', () => {
                var min = 100000;
                var closest; var second; var third; var fourth; var fifth;
                for (var key in norms){
                    //console.log(key);
                    if (norms[key] < min){
                        min = norms[key];
                        closest = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest){
                        min = norms[key];
                        second = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second){
                        min = norms[key];
                        third = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second && key != third){
                        min = norms[key];
                        fourth = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second && key != third && key != fourth){
                        min = norms[key];
                        fifth = key;
                    }
                }
                var topfive = [closest, second, fourth]; console.log(topfive);
                fs.createReadStream('analyzed.csv').pipe(csv(['Song', 'Artist', 'Pos', 'Neg', 'Ntr'])).on('data', (row) => {
                    var outputs = [];
                    var names = [];
                    for (var item in topfive){
                        if (row[0] === topfive[item] && !names.includes(row[0])){
                            names.push(row[0]);
                            spotify.search({type:'track', query:`${row[0]} ${row[1]}`, limit:1}, function(err, data){
                                if (err){
                                    console.log("Error occured: "+err);
                                }
                                var href = data.tracks.items[0].external_urls.spotify;
                                //console.log(href);
                                if (!outputs.includes(href)){
                                    outputs.push(href);
                                    let songreply = {"text": `${row[0]} by ${row[1]}. Find it on Spotify at ${href}.`};
                                    callSendAPI(sender_psid, songreply);
                                }
                            })
                        }
                    }
                })
                });
            };
        func();
    } else if (category === "movie"){
        const func = async() => {
            list = await sentimentAnalysis(textAnalyticsClient, string);
            console.log("List: " + list);
            var norms = {};
            fs.createReadStream('movieanalyzed.csv').pipe(csv(['Title', 'Overview', 'Pos', 'Neg', 'Ntr'])).on('data', (row) => {
                var title = row[0]; var ratings = [row[3], row[4], row[5]]; var overview = row[1];
                var songpos = row[3]; var songneg = row[4]; var songntr = row[5];
                var listpos = list[0]; var listneg = list[1]; var listntr = list[2];
                var dx = listpos - songpos; var dy = listneg - songneg; var dz = listntr - songntr;
                var norm = Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
                //console.log(norm);
                //var norm = math.norm(ratings, list);
                norms[title] = norm;
                //console.log(norm);
            }).on('end', () => {
                var min = 100000;
                var closest; var second; var third; var fourth; var fifth;
                for (var key in norms){
                    console.log(key);
                    console.log(norms[key]);
                    if (norms[key] < min){
                        min = norms[key];
                        closest = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest){
                        min = norms[key];
                        second = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second){
                        min = norms[key];
                        third = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second && key != third){
                        min = norms[key];
                        fourth = key;
                    }
                }
                min = 100000;
                for (var key in norms){
                    if (norms[key] < min && key!= closest && key != second && key != third && key != fourth){
                        min = norms[key];
                        fifth = key;
                    }
                }
                var topfive = [closest, second, fourth]; console.log(topfive);
                fs.createReadStream('movieanalyzed.csv').pipe(csv(['Title', 'Overview', 'Pos', 'Neg', 'Ntr'])).on('data', (row) => {
                    var outputs = [];
                    var names = [];
                    for (var item in topfive){
                        if (row[0] === topfive[item] && !names.includes(row[0])){
                            names.push(row[0]);
                            var link;
                            const func2 = async() => {
                                link = await movieTrailer(row[0]);
                                console.log(link);
                                let songreply = {"text": `${row[0]}.
Here is the trailer for the movie:

${link}`};
callSendAPI(sender_psid, songreply);
                            }
                            func2();
                        }
                    }
                })
                });
            };
        func();
    } else {
        response = chooseMedia(sender_psid);
    }
  } else {
    response = chooseMedia(sender_psid);
  }
  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles basic postback requests (mainly for Get Started)
function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  console.log(payload);
  // Set the response based on the postback payload
  if (payload === "<postback_payload>"){
    response = chooseMedia(sender_psid);
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends second question of preferences based on previous answer to mood
function sendImages(mood){
    let response;
    if (mood === "great"){
        response = {
        "text": "Looks like you are already in a good mood! Choose which concept/picture appeals to you the most right now so we can get you the perfect song!",
        "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Partying",
                    "payload":"great",
                    "image_url":"https://blogmedia.evbstatic.com/wp-content/uploads/wpmulti/sites/8/shutterstock_199419065.jpg"
                },{
                    "content_type":"text",
                    "title":"Dancing Alone",
                    "payload":"ok",
                    "image_url":"https://1000awesomethings.com/wp-content/uploads/2010/04/dancing-home-alone.jpg"
                },{
                    "content_type":"text",
                    "title":"Love",
                    "payload":"sad",
                    "image_url":"https://cdn.pixabay.com/photo/2018/01/04/19/43/love-3061483__340.jpg"
                }
            ]
        };
    } else if (mood === "ok"){
        response = {
        "text": "Hmmm... ok. Choose a concept/picture below so we can better understand what kind of songs will fit your current mood!",
        "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Studying",
                    "payload":"great",
                    "image_url":"https://www.fastweb.com/uploads/article_photo/photo/2161/crop380w_istock_000002193842xsmall-books.jpg"
                },{
                    "content_type":"text",
                    "title":"Sunset",
                    "payload":"ok",
                    "image_url":"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&w=1000&q=80"
                },{
                    "content_type":"text",
                    "title":"Flowers",
                    "payload":"sad",
                    "image_url":"https://images.unsplash.com/photo-1533907650686-70576141c030?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
                }
            ]
        };
    } else {
        response = {
        "text": "Aww... I'm sorry to hear that. Choose a concept/image below so we can find the perfect song to cheer you up!",
        "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Rainy Day",
                    "payload":"great",
                    "image_url":"https://www.downtownludington.org/wp-content/uploads/2016/07/11050673_10206656239231004_2731477320981205814_n.jpg"
                },{
                    "content_type":"text",
                    "title":"Heartbreak",
                    "payload":"ok",
                    "image_url":"https://happynotperfect.com/modules/ybc_blog/views/img/post/B35%20-%20Heartbreak,%20why%20is%20it%20so%20painful.jpg"
                },{
                    "content_type":"text",
                    "title":"Thinking",
                    "payload":"sad",
                    "image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQhj_GLvREqSYxwQusUSYaHLP9zvt7J5GgXCJ8OB-I5DEItzqNL&usqp=CAU"
                }
            ]
        };
    }
    return response;
}

// Sends first question of preferences to check if user wants to find movies or songs
function chooseMedia(sender_psid){
    let response = {
        "text": "Hi! What would you like to do today?",
        "quick_replies":[
            {
                "content_type":"text",
                "title":"Watch a movie",
                "payload":"movie",
                "image_url":"https://i.pinimg.com/originals/0b/44/ff/0b44ff30dbe13528285e97eb23b3e185.png"
            },
            {
                "content_type":"text",
                "title":"Listen to music",
                "payload":"music",
                "image_url":"https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png"
            }
        ]
    };
    return response;
}

// Sends first question of preferences to check user's mood
function setPreferences(sender_psid){
    var response;
    if (category === "music"){
        response = {
            "text": "Great! Let's find some songs to fit your current mood. How are you feeling today?",
            "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Great",
                        "payload":"great",
                        "image_url":"https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Face_Emoji_grande.png?v=1571606036"
                    },{
                        "content_type":"text",
                        "title":"Ok",
                        "payload":"ok",
                        "image_url":"https://hotemoji.com/images/dl/r/straight-face-emoji-by-twitter.png"
                    },{
                        "content_type":"text",
                        "title":"Sad",
                        "payload":"sad",
                        "image_url":"https://i.pinimg.com/originals/3e/90/e8/3e90e8bfe2328d42174d3c3743977cdf.png"
                    }
            ]
        };
    } else if (category === "movie"){
        response = {
            "text": "Great! Let's find some movies to fit your current mood. How are you feeling today?",
            "quick_replies":[
                    {
                        "content_type":"text",
                        "title":"Great",
                        "payload":"great",
                        "image_url":"https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Face_Emoji_grande.png?v=1571606036"
                    },{
                        "content_type":"text",
                        "title":"Ok",
                        "payload":"ok",
                        "image_url":"https://hotemoji.com/images/dl/r/straight-face-emoji-by-twitter.png"
                    },{
                        "content_type":"text",
                        "title":"Sad",
                        "payload":"sad",
                        "image_url":"https://i.pinimg.com/originals/3e/90/e8/3e90e8bfe2328d42174d3c3743977cdf.png"
                    }
            ]
        };
    }

    return response;
}

// Performs all message sending to sender_psid
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  };

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '813d6fc3b6d840599f4391fa3d25e30e';
const endpoint = 'https://moodmatch.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

// Performs all sentimental analysis on user's inputs
async function sentimentAnalysis(client, text){
    const sentimentInput = [text];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);
    var list = [];
    sentimentResult.forEach(document => {
        console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
        list = [document.confidenceScores.positive.toFixed(2), document.confidenceScores.negative.toFixed(2), document.confidenceScores.neutral.toFixed(2)];
    });
    return list;
}

