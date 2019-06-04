require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDATA = require('./movie-data.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
         return res.status(401).json({ error: 'Unauthorized request' })
          }
    
      // move to the next middleware
      next()
     })
    
app.get('/movie', function handleGetMovies(req, res) {
    let response = MOVIEDATA

  // filter our movies by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }

  // filter our movies by country if country query param is present
  if (req.query.country) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  if (req.query.avg_vote) {
    response = response.filter(movie =>
      // case insensitive searching
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }
    res.json(response);
})
    

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
