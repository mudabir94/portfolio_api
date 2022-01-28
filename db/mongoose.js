const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/portfolio_api'
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify:false,
})


// const db = mongoose.connection
// db.once('open', _ => {
//   console.log('Database connected:', url)
// })

// db.on('error', err => {
//   console.error('connection error:', err)
// })

// module.exports.database=db;