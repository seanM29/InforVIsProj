var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var express = require('express');
app.use(express.static('./Data'))


var latlonJson = []
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/demo.html');
});

app.get('/DataChart.html', function (req, res) {
   res.sendFile(__dirname + '/DataChart.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('DayTime', function(msg) {
        console.log('message: ' + msg);
        var json = JSON.parse(fs.readFileSync(msg, 'utf8'));
        latlonJson = []
        /*for (var index in json) {
                console.log(json[index].lat)
                console.log(json[index].lng)
                var row={}
                row.lng = json[index].lng;
                row.lat = json[index].lat;
                latlonJson.push(row)
        }*/
        fs.readFile(msg, 'utf8', function(err, data) {
            if (err) throw err; // we'll not consider error handling for now
            latlonJson = []
            var obj = JSON.parse(data);
            //console.log("Session: %j", obj);
            for (var index in obj) {
                console.log(obj[index].lat)
                console.log(obj[index].lng)
                var row = {}
                row.lng = obj[index].lng;
                row.lat = obj[index].lat;
                latlonJson.push(row)
            }

            //socket.emit('SendData',latlonJson);
            console.log("Session: %j", latlonJson);
            io.emit('SendData', latlonJson);

            console.log(22)
        });
    });

    //循环读取数据
    socket.on('StartChange', function(msg) {


        var obj = JSON.parse(fs.readFileSync(msg, 'utf8'));
        latlonJson = [];
        //console.log("Session: %j", obj);
        for (var index in obj) {
            //console.log(obj[index].lat)
            //console.log(obj[index].lng)
            var row = {}
            row.lng = obj[index].lng;
            row.lat = obj[index].lat;
            row.count = 100;
            latlonJson.push(row)
        }
        io.emit('SendData', latlonJson);


    })

    socket.on('Display', function(msg) {

//		
    	console.log("hello")
        app.get('/', function(req, res) {
            res.sendFile(__dirname + '/DataChart.html');
        	res.redirect('/DataChart.html');
        });

    })

});



http.listen(3000, function() {
    console.log('listening on *:3000');
});