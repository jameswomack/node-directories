var
  Assert      = require('assert'),
  Path        = require('path'),
  Sinon       = require('sinon'),
  Directories = require('../')

describe('directories', function() {

  describe('createError', function() {
    var dir
    it('should return an error with the name prefixed', function() {
      var name = 'flop-heavy-flapjack'
      dir = new Directories({
        path: '../test/fixtures/directories',
        name: name
      })
      var unexpectedError = new Error('flop-heavy-flapjack snoopdrooper')
      var actualError     = dir.createError('snoopdrooper')
      Assert.notDeepEqual(actualError.message, unexpectedError.message,
                          'error with name prefixed')
      var expectedError = new Error('[flop-heavy-flapjack] snoopdrooper')
      Assert.deepEqual(actualError.message, expectedError.message,
                       'error with name prefixed inside brackets')
    })
  })


  describe('bad args to get', function() {
    var dir
    it('should throw if nothing is passed', function() {
      dir = new Directories('../test/fixtures/directories')
      Assert.throws(function() {
        dir.get()
      }, 'didn\'t throw')
    })
  })

  describe('bad args to constructor', function() {
    it('should throw if nothing is passed', function() {
      Assert.throws(function() {
        new Directories()
      }, 'didn\'t throw')
    })

    it('should throw if an object sans path is passed', function() {
      Assert.throws(function() {
        new Directories({ ferp: 'da-derp' })
      }, 'sans path')
    })

    it('should throw if an object sans string path is passed', function() {
      Assert.throws(function() {
        new Directories({ path: [ 'snerp', 'la-lerp' ] })
      }, 'sans string path')
    })

    it('should throw if a non-object or string is passed', function() {
      Assert.throws(function() {
        new Directories(0)
      }, 'number')
      Assert.throws(function() {
        new Directories(function() {})
      }, 'function')
      Assert.throws(function() {
        new Directories(null)
      }, 'null')
    })
  })

  describe('should return all the directories in a callback', function() {
    var dir

    it('should work if process.cwd() is passed', function(done) {
      dir = new Directories(process.cwd())
      dir.get(function(error, directoryNames) {
        var expected  = [ '.git', 'bin', 'lib', 'node_modules', 'test' ]
        Assert.deepEqual(directoryNames, expected)
        done()
      })
    })

    it('should work beyond cwd', function(done) {
      var fixturesDirectories = Path.join(process.cwd(), 'test', './fixtures/directories')
      dir = new Directories(fixturesDirectories)
      dir.get(function(error, directoryNames) {
        var expected  = [ 'a', 'b', 'c', 'd' ]
        Assert.deepEqual(directoryNames, expected)
        done()
      })
    })

    it('should accept non-full paths', function(done) {
      dir = new Directories('../test/fixtures/directories')
      dir.get(function(error, directoryNames) {
        var expected  = [ 'a', 'b', 'c', 'd' ]
        Assert.deepEqual(directoryNames, expected)
        done()
      })
    })
  })

  describe('print', function() {
    var dir
    it('should call `get`', function() {
      dir = new Directories('../test/fixtures/directories')
      var getSpy = Sinon.spy(dir, 'get')
      function throwie() {
        dir.print()
      }
      Assert.throws(throwie, 'print throws in module mode')
      Assert.ok(getSpy.calledOnce, 'get is called by print')
      getSpy.restore()
    })
  })
})
