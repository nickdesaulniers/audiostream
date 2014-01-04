var fs = require('fs');
var convert = require('../lib/convert');

exports.FileMap = null;
exports.list = function (req, res) { res.send(exports.FileMap.retrieveAll()); };
exports.transcode = function (req, res) {
  // Check if original file ext is in filemap
  var file_path = exports.FileMap.retrieve(req.params.fileID);
  if (!file_path) {
    console.log('Original file was not in filemap');
    return res.send(404);
  }

  // Was the requested extension the file's current extension?
  var requested_extension = req.params.extension;
  var actual_extension = file_path.replace(/.+\./, '');
  if (requested_extension === actual_extension.toLowerCase()) {
    console.log('The file\'s actual extension was requested');
    return res.sendfile(file_path);
  }

  // Was the requested extension previously encoded?
  var previous_file_name = req.params.fileID + '.' + requested_extension;
  var previous_file_path = exports.FileMap.previously_transcoded(previous_file_name);
  if (previous_file_path) {
    console.log('Found previously encoded version in library/');
    return res.sendfile(previous_file_path);
  }

  // Transcoding needed
  console.log('Transcoding ' + actual_extension + ' to ' + requested_extension);
  var transcode_args = {
    file_path: file_path,
    requested_extension: requested_extension,
    transcoded_fstream: fs.createWriteStream('./library/' + previous_file_name),
    res: res,
    cb: function cb (code, stderr) {
      if (code) {
        console.error(stderr);
      } else {
        console.log('transcoded');
      }
    },
  };
  convert(transcode_args);
};

