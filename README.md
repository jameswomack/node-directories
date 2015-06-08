# node-directories
Directory names within a path, returned in many formats. Node.js FTW.

## API
```
var dir = new Directories(process.cwd())
dir.get(function(error, directoryNames) {
  console.info(directoryNames) // [ '.git', 'bin', 'lib', 'node_modules', 'test' ]
})
```
Please see test/test.js for more examples

## Getting Started
```
npm i
npm run cover
```
