/*

This app is used for 3 functions:

- Quickly access the Arthur.design water cooler
- Announce when someone has joined using the button from the slash command
- Allow others to join from the announcement that someone joined via a button

*/

/*

x receive post request
x handle initial validation
x determine if post is from /slash command
- determine if post is from button press
- else nothing


if from slash command...
- is message "remote"?
- if yes, grab username
- return "invitation to join meeting" message into slack with button

if from button press...
- get username
- send "{username} joined the watercooler {button: join now}" into slack


*/

var SLACK_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_ACCESS_TOKEN');
var POST_MESSAGE_ENDPOINT = PropertiesService.getScriptProperties().getProperty('POST_MESSAGE_ENDPOINT');


/*

This receives a POST request and routes it to the correct function.

@param {object} e - the event that Slack posts into Apps Script
@return {object} message - JSON object returned to Slack from /slash command

*/

/*
  
  Sample /slash command (e) contents:
  
    token=gIkuvaNzQIHg97ATvDxqgjtO
    &team_id=T0001
    &team_domain=example
    &enterprise_id=E0001
    &enterprise_name=Globular%20Construct%20Inc
    &channel_id=C2147483705
    &channel_name=test
    &user_id=U2147483697
    &user_name=Steve
    &command=/weather
    &text=94070
    &response_url=https://hooks.slack.com/commands/1234/5678
    &trigger_id=13345224609.738474920.8088930838d88f008e0
    
  */

function doPost(e) {
  if (typeof e == undefined) {
    
    return;
    
  }
  else {
    var event = e.parameters;
    if (event.command == "/remote") {  // if the event is for the slash command "/remote"
      
      var message = sendSlashResponse(event);
      return message;
    
    }
    else if (event.payload) {   // if the user got here from clicking a button
      // Reference this: https://github.com/sp71/ChoreTinder/blob/master/api.gs
      return;
      sendToSlack(event.payload);
      
    }
  }
}


/*

This returns to Slack a messge with a link tojoin the Watercooler.
Reference: https://davidwalsh.name/using-slack-slash-commands-to-send-data-from-slack-into-google-sheets

@param {object} event - The POST request from Slack as a result of the Slash command.
@return {string} response - Text output of the message and button to return to Slack.

*/


function sendSlashResponse(event) {
  
   var body = {
	"blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Ready to join the Arthur Watercooler on Google Meet? "
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Join the Watercooler",
            "emoji": true
          },
          "url": "https://www.arthur.design/water-cooler",
          "value": "watercooler"
        }
      }
    ]
  };
  
  var response = ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
  return response;
}


/* 

This function sends a message into a defined Slack Channel.

@param {object} event - The payload returned from a the user clicking the "Join watercooler" button

*/


/* 

Sample postback even from button
{
	"type": "block_actions",
	"team": {
		"id": "T0CAG",
		"domain": "acme-creamery"
	},
	"user": {
		"id": "U0CA5",
		"username": "Amy McGee",
		"name": "Amy McGee",
		"team_id": "T3MDE"
	},
	"api_app_id": "A0CA5",
	"token": "Shh_its_a_seekrit",
	"container": {
		"type": "message",
		"text": "The contents of the original message where the action originated"
	},
	"trigger_id": "12466734323.1395872398",
	"response_url": "https://www.postresponsestome.com/T123567/1509734234",
	"actions": [
		{
			"type": "button",
			"block_id": "MYlLU",
			"action_id": "jiqxy",
			"text": {
				"type": "plain_text",
				"text": "Join Watercooler",
				"emoji": true
			},
			"value": "watercooler",
			"action_ts": "1585589518.115304"
		}
	]
}

*/

function getActionId(event) {
  
  var actionId = event.actions[0].action_id;
  
  // var response = actionId;
  var response = ContentService.createTextOutput(actionId);
  return response;
  
}
  


//Needs modification
// this will be useful for troubleshootingß


function SendToSlack(event){
  
  var channelId = "C01062RS83Y";
  var type = event.type;
  var user_name = event.user.username;
  var actionId = event.actions[0].action_id;
  
//  var channelId = "C01062RS83Y";
//  var type = "banana";
//  var user_name = "fruit";
//  var actionId = "salad";
  
  var message = "Type: " + type + ", Username: " + user_name + ", Action ID: " + actionId;
  
  // Defines where and what of the slack message
  var payload = {token: SLACK_ACCESS_TOKEN, // OAuth bot token.
                 channel: channelId, 
                 text:message};
  
  var options = {method: 'post',
                 payload: payload}
  
  UrlFetchApp.fetch(POST_MESSAGE_ENDPOINT, options);
}