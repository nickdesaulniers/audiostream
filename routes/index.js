var fs = require('fs');
var child_process = require('child_process');
var musicmetadata = require('musicmetadata');
var FileMap = require('../lib/filemap').FileMap;
var convert = require('../lib/convert');

function flatten (obj) {
  return obj.no > 0 || obj.of > 0 ? '' + obj.no + ' of ' + obj.of : '';
}

exports.index = function (req, res) {
  res.sendfile('public/pages/index.html');
}

exports.list = function(req, res){
  var filemap = FileMap.retrieveAll();
  var filemapKeys = Object.keys(filemap);
  var files = [];
  
  filemapKeys.forEach(function (id) {
    var filename = filemap[id];
    var parser = new musicmetadata(fs.createReadStream(filename));
    parser.on('metadata', function (result) {
      files.push({
        songID: id,
        ext: filename.replace(/.+\./, ''),
        title: result.title || filename.replace(/.+\//, ''),
        artist: result.artist, // Array
        albumartist: result.albumartist, // Array
        album: result.album,
        year: result.year > 0 ? result.year : '',
        track: flatten(result.track),
        genre: result.genre, // Array
        disk: flatten(result.disk)
      });

      // On the last file
      if (files.length === filemapKeys.length) {
        res.send(files);
      }
    });
  });
};

exports.transcode = function (req, res) {
  // Check if original file ext is in filemap
  var file_path = FileMap.retrieve(req.params.fileID);
  if (!file_path) {
    console.log('original file was not in filemap');
    return res.send(404);
  }
  
  // Was the requested extension the file's current extension?
  var requested_extension = req.params.extension;
  var actual_extension = file_path.replace(/.+\./, '');
  if (requested_extension === actual_extension) {
    console.log('The file\'s actual extension was requested');
    return res.sendfile(file_path);
  }
  
  // Was the requested extension previously encoded?
  var previous_file_name = req.params.fileID + '.' + requested_extension;
  var previous_file_path = FileMap.previously_transcoded(previous_file_name);
  if (previous_file_path) {
    console.log('Found previously encoded version in library/');
    return res.sendfile(previous_file_path);
  }
  
  // Transcoding needed
  console.log('Transcoding ' + actual_extension + ' to ' + requested_extension);
  convert(file_path, requested_extension, previous_file_name,
  function (err, transcoded_file_path) {
    if (err) {
      console.log('error');
      return res.send(500);
    }
    console.log('transcoded');
    res.sendfile(transcoded_file_path);
  });
}