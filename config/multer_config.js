const multer = require('multer')

let storage = multer.memoryStorage()

module.exports = storage;
