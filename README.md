# audiostream
===============

Stream and transcode your music library.  The goal is to make software you want to use, for instance an itunes-like audio jukebox player experience in the browser.  HTML5 audio is tricky because not all browser's support all codecs/containers.  This app uses ffmpeg, a free open source media transcoder, to support all browsers.

## How to use

### Requirements
* Unix variant OS (OSX, Linux, BSD, etc.)
* ffmpeg
* Node.js
Currently only Unix like operating systems are supported for the server.  This is because audiostream uses Unix commands such as find and xargs, under the hood.
You need to install ffmpeg and have it in your path so that typing `which ffmpeg` in your command line produces an absolute path.
Node.js is super cool, and so is javascript.

### Download source
`$ git clone git://github.com/nickdesaulniers/audiostream.git && cd audiostream`

### Configure
Modify config/config.json to add your music library's absolute paths.  Notice how for paths with spaces, the spaces and parentheses needs to be escaped (a single backslash), and for JSON the escape character needs to be escaped (two backslashes).  It would be nice to have part of the web interface handle this!

### Run
`$ node app.js`

### View
`$ open localhost:3000`

## Notes
Click on any link to fetch a file.  If the file has not yet been transcoded, it will be, then served, otherwise it serves the previously encoded version.  The encoded files will be in `library/`.
The app currently transcodes any file (well, tested only with mp3s) to the free and open source ogg container using the vorbis codec.  It might be nice to add container support detection.
HTTP Basic Authentication is currently being used, for it's simplicity.  You can find the username and password in the config/config.json file.  You need to restart the server if you modify the config file.

## Contributing
Bug reports are always welcome!  Please file them as issues on the github page: https://github.com/nickdesaulniers/audiostream/issues
Do NOT just fork and send a pull request!!!  If there is an issue in the issue tracker that you want to tackle, feel free to to fork, and issue a pull request.  Otherwise, please first create an issue, and wait for it to be approved.  This will allow you to 'fail sooner,' as in have your patch declined before you write it, if it's not in line with the goals of this project.

## Authors
Nick Desaulniers

## Browser HTML5 audio container compatibility
http://html5doctor.com/html5-audio-the-state-of-play/#support