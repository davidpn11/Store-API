const express = require('express')
const app = express()
const morgan = require('morgan')
const productsRoutes = require('./routes/products')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

try {
  mongoose.connect(
    `mongodb+srv://davidpn11:${
      process.env.MONGO_ATLAS_PASS
    }@cluster0-vvkaz.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true }
  )
} catch (error) {
  console.error(error)
}

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//cors enabled
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

//routes
app.use('/products', productsRoutes)
app.get('/', (req, res) => res.sendFile('./index.html', { root: __dirname }))

// Middleware to handle errors.
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
