var express = require('express');
var app = express();
var compression = require('compression');

var fs = require('fs');
var bodyParser = require('body-parser');
var page_hit;



// Start server and enabling comression and cache
var cacheTime = 21600000;

app.use(compression());

app.use(express.static(__dirname + '/public/images/', { extensions: ['html', 'htm'], maxAge : cacheTime }));
app.use(express.static(__dirname + '/public/', { extensions: ['html', 'htm'], maxAge : 0 }));

app.use(bodyParser.urlencoded());

app.listen(80, function(){
	console.log('Listening on 80');
/*	fs.readFile(__dirname+'/page_visit', {encoding: 'utf-8'}, function(err, data){
		if(err){
			page_hit = 0;
		}else{
			page_hit = parseInt(data,10);
		}
	});
*/
});
