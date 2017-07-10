# nodejs-webcam-capture-with-sensitivity
Capture webcam feed into SQLite as base64 if 0.5% change occurred since last frame plus simple express/angular/Socket.io based UI

In Ubuntu:

```sh
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
sudo npm install -g node-gyp
npm install
node capture.js
http://localhost
```

In windows (run as administrator):
```sh
npm install --global --production windows-build-tools
http://www.msys2.org/
```

This program uses [Resemble.js](https://huddle.github.io/Resemble.js/) for comparing images and [node-webcam](https://github.com/chuckfairy/node-webcam) for capturing webcam images
