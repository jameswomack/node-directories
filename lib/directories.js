#!/usr/bin/env node

var
  Path      = require('path'),
  isObject  = require('isobject'),
  isFunc    = require('is-function'),
  dirAsync  = require('./directories-async')

var NAME = 'Directories'

function createError(name, s) {
  return new Error('[' + name + '] ' + s)
}

function usingCLI() {
  return module.parent == null
}

function Directories(options) {
  typeof options === 'string' && (options = { path: options })
  if (!isObject(options)) {
    throw createError(NAME, 'options must be an object buddy')
  }
  if (typeof options.path !== 'string') {
    throw createError(NAME, 'options must contain a string my friend')
  }
  if (!Path.isAbsolute(options.path)) {
    var parentModuleFolder = Path.dirname(module.parent.filename)
    options.path = Path.resolve(parentModuleFolder, options.path)
  }
  this.options = options
  this.attributes = {}
}

Directories.prototype = Object.create({
  get: function(got) {
    if (!isFunc(got) && !this.usingCLI) {
      throw createError('get requires a callback buddy')
    }
    return dirAsync(this.options.path, this.got(got))
  },
  print: function() {
    this.get()
  },
  got: function(got) {
    return function(/* args: error, directories */) {
      isFunc(got) ? got.apply(got, arguments) : console.info.apply(console, arguments)
    }
  },
  createError: function(s) {
    return createError(this.name, s)
  },
  get name() {
    return this.options.name || NAME
  },
  get usingCLI() {
    return usingCLI()
  }
})

module.exports = Directories

if (usingCLI()) {
  var args = process.argv.slice(2)
  var path = args[0] || process.cwd()
  var dir = new Directories(path)
  dir.print()
}
