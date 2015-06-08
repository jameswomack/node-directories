var
  FS        = require('fs'),
  Path      = require('path'),
  Async     = require('async')

function directoriesAsync(dirname, callback) {
  function appendDir(dirname, target, cb) {
    cb(null, Path.join(dirname, target))
  }

  function removeDir(dirname, target, cb) {
    cb(null, Path.relative(dirname, target))
  }

  function isDir(dirname, cb) {
    FS.stat(dirname, function(error, stat) {
      if (error) {
        console.error(error)
        cb(false)
      } else {
        cb(stat.isDirectory())
      }
    })
  }

  Async.waterfall([
    function(cb) {
      FS.readdir(dirname, cb)
    },
    function(dirs, cb) {
      Async.map(dirs, appendDir.bind(null, dirname), cb)
    },
    function(dirs, cb) {
      // Bind first parameter is context, second is error but
      // filter only calls a callback with a single value
      // collecting all the results
      Async.filter(dirs, isDir, cb.bind(null, null))
    },
    function(dirs, cb) {
      Async.map(dirs, removeDir.bind(null, dirname), cb)
    }
  ], callback)
}

module.exports = directoriesAsync
