var express = require('express');
var app = express();
var compression = require('compression');

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var page_hit;
var dateformat = require('dateformat');

var schedule = require('node-schedule');
 

// Start server and enabling comression and cache
var cacheTime = 21600000;

app.use(compression());

app.use(express.static(__dirname + '/public/images/', { extensions: ['html', 'htm'], maxAge : cacheTime }));
app.use(express.static(__dirname + '/public/', { extensions: ['html', 'htm'], maxAge : 0 }));
app.set('views', path.join(__dirname, '/public/views'));

app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');
var deliveryConfig =  require('./public/config/delivery');

var j = schedule.scheduleJob('0 0 * * ' + deliveryConfig.daysofweek, function(){
	console.log("[cron started] : "+ new Date());
	var date = new Date();
	var dayOfWeek = date.getDay();
	var actualDOW = deliveryConfig.daysofweek;
	var count = actualDOW.length;
	var nextDay = 0;
	actualDOW.forEach(function(item,index){
		if(item === dayOfWeek ){
			if( index == count-1){
				nextDay = 7 - (actualDOW[count-1] - actualDOW[0]);
			}
			else{
				nextDay = (actualDOW[index+1] - actualDOW[index]);
			}
		}
	});

	date.setDate(date.getDate() + nextDay); 
	console.log("[Next Delivery Date : ] + " + date);
  	var writeObject = {
  		year : date.getFullYear(),
  		month : date.getMonth(),
  		day : date.getDate(),
  		daysofweek : deliveryConfig.daysofweek
  	};
  	writeObject = JSON.stringify(writeObject);
  	fs.writeFile("./public/config/delivery.json", writeObject	, 'utf8', function (err) {
    if (err) {
        return console.log("[Cron error ]" + err);
    }

}); 

});


app.get("/shop",function(req,res){
	var year = deliveryConfig.year;
	var month = deliveryConfig.month;
	var day = deliveryConfig.day;
	var deliveryString  = getDateString(year,month,day);
	res.render("shop",{deliveryString:deliveryString});
})


app.listen(8081, function(){
	console.log('Listening on 8081');
/*	fs.readFile(__dirname+'/page_visit', {encoding: 'utf-8'}, function(err, data){
		if(err){
			page_hit = 0;
		}else{
			page_hit = parseInt(data,10);
		}
	});
*/
});


function getDateString(year,month,day){
	 return dateformat(new Date(year,month,day), "dddd, mmmm dS, yyyy");
}