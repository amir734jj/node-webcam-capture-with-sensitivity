var webcam = require("node-webcam");
var fs = require("fs");
var express = require("express");
var http = require("http");
var io = require("socket.io");
var path = require("path");
var sqlite3 = require("sqlite3");
var db = new sqlite3.Database("db.sqlite");
var resemble = require("node-resemble");
var database = require("./modules/database");
var bodyParser = require("body-parser");

(function() {
    var self = this;
    var port = process.env.PORT || 80;

    var app = express();

    var server = http.createServer(app);
    io = io(server);
    app.use(express.static(path.join(__dirname, "public")));
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: false
    }))

    db.run("                                                        \
        CREATE TABLE if not exists 'Album' (                        \
            'id'	    INTEGER DEFAULT 1 PRIMARY KEY AUTOINCREMENT,\
            'image'	    TEXT,                                       \
            'date'	    TEXT,                                       \
            'mimetype'	TEXT,                                       \
            'mismatch'	REAL                                        \
        );                                                          \
    ");

    var opts = {
        width: 500,
        height: 500,
        quality: 10,
        delay: 0,
        saveShots: true,
        output: "jpeg",
        device: false,
        callbackReturn: "base64",
        verbose: true
    };

    var Webcam = webcam.create(opts);

    previousImage = "";

    var interval;

    app.get("/all", function(req, res) {
        database.getAllPhotos(db, function(rows) {
            res.json(rows);
        });
    });

    app.get("/image/:id", function(req, res) {
        database.getPhotoById(db, req.params.id, function(data) {
            data = digestBase64(data);

            var img = new Buffer(data.image, 'base64');

            res.writeHead(200, {
                'Content-Type': data.mimetype,
                'Content-Length': img.length
            });

            res.end(img);
        })
    });

    app.post("/deleteAll", function(req, res) {
        database.deleteAll(db, function() {
            res.redirect("/all");
        });
    });

    app.post("/captureInterval", function(req, res) {
        clearInterval(interval);
        scheduleInterval(req.body.miliseconds);
        res.send(req.body.miliseconds);
    });

    server.listen(port, () => {
        console.log("listening on *:" + port);
    });

    io.sockets.on('connection', function(socket) {
        io.emit("new-image", previousImage);
    });

    function scheduleInterval(miliseconds) {
        interval = setInterval(() => {
            webcam.capture("captured-image", opts, function(err, data) {

                resemble(previousImage).compareTo(data).onComplete(function(result) {
                    if (result.misMatchPercentage > 0.5) {
                        var mimetype = digestBase64(data).mimetype;
                        database.addPhoto(db, data, new Date().toString(), mimetype, result.misMatchPercentage, function() {
                            io.emit("new-image", data);
                            console.log("New image stored!");
                        });
                    } else {
                        console.log("No change!");
                    }
                });

                previousImage = data;
            });
        }, miliseconds);
    };

    function digestBase64(base64) {
        base64 = base64.match(/(?=[^:;]*;)([^;:]+)|([^;,]+)$/g);
        return {
            mimetype: base64[0],
            image: base64[1]
        };
    };

    scheduleInterval(2000);

}).apply([fs, webcam, express, http, io, path]);
