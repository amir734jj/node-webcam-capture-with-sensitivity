# nodejs-webcam-capture-with-sensitivity
Capture webcam feed into SQLite as base64 if 0.5% change occurred since last frame plus simple express/angular/Socket.io based UI

```sh
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
npm install
node capture.js
http://localhost
```

This program uses [Resemble.js](https://huddle.github.io/Resemble.js/) for comparing images and [node-webcam](https://github.com/chuckfairy/node-webcam) for capturing webcam images
