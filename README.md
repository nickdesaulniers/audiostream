# audiostream

Stream and transcode your music library.  The goal is to make an itunes-like
audio jukebox player experience in the
browser.  HTML5 audio is tricky because not all browser's support all
codecs/containers.  This app uses ffmpeg, a free open source media transcoder,
to support all browsers.

## How to use

### Requirements
* Unix variant OS (OSX, Linux, BSD, etc.)
* [ffmpeg](http://ffmpeg.org/download.html)
* [Node.js](http://nodejs.org/download/)

Currently only Unix like operating systems are supported for the server.
Windows support has not yet been tested.
You need to install ffmpeg and have it in your path so that typing
`which ffmpeg` in your command line produces an absolute path.

### Download source
`git clone git://github.com/nickdesaulniers/audiostream.git && cd audiostream && npm install`

### Configure
Modify `config/config.json` to add your music library's absolute paths.
Notice how for paths with spaces, the spaces and parentheses needs to be
escaped (a single backslash), and for JSON the escape character needs to be
escaped (two backslashes).

### Run
`npm start` or `node app.js`

### View
`open localhost:3000`

## Notes
* Click on any link to fetch a file.  If the file has not yet been transcoded, it will be, then served, otherwise it serves the previously encoded version.  The encoded files will be in `library/`.
* The app currently transcodes a file (tested mp3's, flac, and ogg's so far) to either ogg, mp3, aac, or wav based on browser support.  If the original format is supported, then that file is served, otherwise a preferred format is transcoded to and served.
* HTTP Basic Authentication is currently being used, for it's simplicity.  You can find the username and password in the `config/config.json` file.  You need to restart the server if you modify the config file.

## Browser HTML5 audio container compatibility
http://html5doctor.com/html5-audio-the-state-of-play/#support

