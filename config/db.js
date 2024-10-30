const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL).then(function(){
    console.log('connected to db')
})

module.exports = mongoose.connection;