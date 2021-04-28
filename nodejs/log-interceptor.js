// const mongoose  = require('mongoose');
const Log       = require('./models/log');
const config    = require('./config')

// const connection = require("./connection")

// https://gist.github.com/pguillory/729616
function hook_stdout(callback) {
  process.stdout.write = (function (write) {
    return function (string) {
      write.apply(process.stdout, arguments)
      callback(string)
    }
  })(process.stdout.write)  
}

function logToDb(log) {
  Log.create(log)
  .exec()
  .catch((e) => {
    console.error(e);
  })
}

function extractTags(str){  
  let tags = str.split(' ').filter(v => v.startsWith('#'));  
  tags = tags.length ? tags.map((t) => t.toLowerCase()) : null;
  return tags;
}

module.exports = function (serverName) {
  const serverNameTag = serverName? `#${serverName}` : '';
  hook_stdout(function (str) {
    let text = ` ${str.trim()} ${serverNameTag}` //add empty space at the start so that first hash tag can be extracted if present
    const log = {
      text,
      tags: extractTags(text)
    }
    logToDb(log);
  })
}