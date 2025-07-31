const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const signupRoutes = require('./authorization/signup')
const loginRoutes = require('./authorization/login')
const pageRoutes = require('./routes/page')

const app = express()
const PORT = 3000

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/page', pageRoutes)
app.use('/api/users', signupRoutes)
app.use('/api/users', loginRoutes)

app.get('/', (req, res) => {
  res.send(`
    <div style="
      font-family: Arial;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 40px;
      background: #f0f0f0;
    ">
      <h1 style="
        font-weight: 900;
        font-size: 4rem;
        text-transform: uppercase;
        margin: 0;
      ">
        HEAVENLYPLACE
      </h1>

      <div style="display: flex; gap: 30px;">
        <button onclick="location.href='/api/users/signup'" style="
          padding: 15px 40px;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          background-color: #333;
          color: white;
        ">Sign Up</button>

        <button onclick="location.href='/api/users/login'" style="
          padding: 15px 40px;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid #333;
          border-radius: 6px;
          background-color: transparent;
          color: #333;
        ">Login</button>
      </div>
    </div>
  `)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
