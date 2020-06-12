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
  app = express().use(body_parser.json()); // creates express http server

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: '8514e6dbe2114a3e942dc012eb11f882',
  secret: 'd14b2aba57224628a15edc4c6fc47cd5'
});

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

//request.post(authOptions, function(error, response, body) {
//  if (!error && response.statusCode === 200) {
//
//    // use the access token to access the Spotify Web API
//    token = body.access_token;
//    var options = {
//      url: 'https://api.spotify.com/v1/users/virenkhandal',
//      headers: {
//        'Authorization': 'Bearer ' + token
//      },
//      json: true
//    };
//    request.get(options, function(error, response, body) {
//      //console.log(body);
//      //console.log(token);
//    });
//  }
//});


// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

//app.get('/', (request, response) => {
//    return response.send('Ping!');
//    //return response.sendFile(path.join(__dirname + '/home.html'));
//});

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

//app.use(express.static('public'));

app.get('/home', (req, res, next) => {
    app.use(express.static('public'));
    let referer = req.get('Referer');
    if (referer) {
//        if (referer.indexOf('www.messenger.com') >= 0) {
//            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
//        } else if (referer.indexOf('www.facebook.com') >= 0) {
//            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
//        }
        res.sendFile('public/home.html', {root: __dirname});
    }
    let body = req.query;
    console.log(body.psid);
});

app.get('/postback', (req, res) => {
    let body = req.query;
    let psid = req.query.psid;
    console.log(body.mood);
    console.log(body.pic);
    var mood = new String(body.mood);
    var pic = new String(body.pic);
    var string = mood + " " + pic;
    let list = [];
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
            var topfive = [closest, second, third, fourth, fifth]; console.log(topfive);
            fs.createReadStream('analyzed.csv').pipe(csv(['Song', 'Artist', 'Pos', 'Neg', 'Ntr'])).on('data', (row) => {
                for (var item in topfive){
                    var href = "";
                    if (row[0] === closest){
                        spotify.search({type:'track', query:`${row[0]} ${row[1]}`, limit:3}, function(err, data){
                            if (err){
                                console.log("Error occured: "+err);
                            }
                            href = data.tracks.items[0].href +"?market=US";
                            var options = {
                              url: href,
                              headers: {
                                'Authorization': 'Bearer ' + token
                              },
                              json: true
                            };
                            console.log(token);
                            request.get(options, function(error, response, body){
                                //console.log(data.tracks.items[0]);
                                //var preview = data.tracks.items[0].preview_url;
                                console.log(body.album.images[0].url);
                                var image = body.album.images[0].url;

//                                if (preview != null | preview != ""){
//                                    res = {"text": `Here is a song you should definitely listen to right now: ${preview}.`};
//                                    callSendAPI(body.psid, res);
//                                }
                            });
                        })
                    }
                }
                //res = {"text": `Here is a song you should definitely listen to right now: ${href}.`};
                //res = sendSpotify(body.psid, href);
                //callSendAPI(body.psid, res);
            })
            });
        };
    func();

//    if (body.mood === 'great'){
//        res = {"text": "Looks like you are already in a good mood! I will get you some songs that you can groove or dance to!"};
//    } else if (body.mood === 'ok'){
//        res = {"text": "Hmmm... looks like you are not very happy and not very sad. I will get you some songs that will help you better understand how you feel."};
//    } else {
//        res = {"text": "Aw... I'm sorry to hear that. I will get you some songs that will definitely cheer you up!"};
//    }

    callSendAPI(body.psid, res);
});

function sendSpotify(sender_psid, url){
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
            "text": "Here's a song you should definitely listen to right now!",
            "buttons": [{
                "type": "web_url",
                "url": url,
                "title": "Let's Go!",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
          }],
        }
      }
    };
    return response;
}


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

function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message contains text
  response = setPreferences(sender_psid);

  // Send the response message
  callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === "<postback_payload>") {
    response = setPreferences(sender_psid);
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function setPreferences(sender_psid){
    let response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
            "text": "Hi! Let's find some songs to fit your current mood.",
            "buttons": [{
                "type": "web_url",
                "url": "https://musicalrecommendations4917.herokuapp.com" + "/home",
                "title": "Let's Go!",
                "webview_height_ratio": "tall",
                "messenger_extensions": true
          }],
        }
      }
    };
    return response;
}

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
const key = 'eefd7a51fe184ef382bc1db79d003b69';
const endpoint = 'https://songsentimentanalyzer.cognitiveservices.azure.com/';
const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

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

