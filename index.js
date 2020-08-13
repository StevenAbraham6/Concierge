const Webex = require(`webex`);
var moment = require('moment-timezone');


//STEP 1 : required ENV variables in AWS
//botId : botID from webex teams documentation
//responseText : text to reply after hours 
//roomId : space id 
//timezone : timezone from moment.js site 

//STEP 2 : change bot name in code 

//STEP 3: ADD HOLIDAY LIST in code 

//STEP 3: Choose weekend days 

//STEP 4: Choose working hours  

//STEP 5 : Create webhook with user in space 


//needs to customized for each country 
var holidays=["August 11th 2020", "August 28th 2020","October 2nd 2020","October 26th 2020","November 16th 2020","December 25th 2020"]

var timezone=process.env.timezone
//var timezone="Asia/Kolkata"
var previousAlertTiming=moment().tz(timezone)-190000

function isWeekend(){
    var now = moment().tz(timezone)
    if(now.format('dddd')=="Sunday"||now.format('dddd')=="Saturday")
        return true
    else
        return false 
}

function isPublicHoliday(){
    var now = moment().tz(timezone).format('MMMM Do YYYY')
    return holidays.includes(now)
}

function isOfficeHours(){
    var now = moment().tz(timezone)
    if (now > moment.tz(moment().format('MMMM Do YYYY')+", 08:00:00 am", "MMMM Do YYYY, h:mm:ss a", timezone)){
        if (now < moment.tz(moment().format('MMMM Do YYYY')+", 06:00:00 pm", "MMMM Do YYYY, h:mm:ss a", timezone)){
            return true
        }
        else
            return false
    }
    else 
        return false 
}

const webex = Webex.init({
    credentials: {
      access_token: process.env.botId
      //access_token: "ZjM5NGUwNjYtOWJjMS00ZDkyLWJkYjQtZTg5M2EzZmUzM2FmZDQxYzgzZDQtYTVj_PF84_1eb65fdf-9643-417f-9974-ad72cae0e10f"
    }
  });



exports.handler = function(event, context, callback){

    if(event.data.personEmail!="pharm@webex.bot"){
        if((isPublicHoliday())&&(moment().tz(timezone)-previousAlertTiming>180000)){
            previousAlertTiming=moment().tz(timezone)
            webex.messages.create({
                markdown: ''+process.env.responseTextPublicHoliday+'',
                //markdown: "this is a test",
                roomId: process.env.roomId
                //roomId: "Y2lzY29zcGFyazovL3VzL1JPT00vN2NjMWU0ZDAtZGExZC0xMWVhLThiMDUtMTFjZDJhNmY3NTYy"
            })
        }
        else if ((isWeekend()||!isOfficeHours())&&(moment().tz(timezone)-previousAlertTiming>180000)){
            previousAlertTiming=moment().tz(timezone)
            webex.messages.create({
                markdown: ''+process.env.responseText+'',
                //markdown: "this is a test",
                roomId: process.env.roomId
                //roomId: "Y2lzY29zcGFyazovL3VzL1JPT00vN2NjMWU0ZDAtZGExZC0xMWVhLThiMDUtMTFjZDJhNmY3NTYy"
            })
        }
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(console.log(process.env.roomId)),
    };


callback(null,200)
}
