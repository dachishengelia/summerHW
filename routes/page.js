const express = require('express')
const router = express.Router()
const { upload } = require('../config/cloudinary.config')
const { authenticate } = require('../authorization/login')

router.get('/', authenticate, (req, res) => {
  res.send(`
    <div style="font-family: Arial; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 30px;">
      <h1 style="font-size: 2.5rem; font-weight: 900;">Upload to Cloudinary</h1>
      <form action="/api/page/upload" method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 20px;">
        <input type="file" name="image" required />
        <button type="submit" style="padding: 10px 20px; font-weight: bold;">Upload</button>
      </form>
    </div>
  `)
})

router.post('/upload', authenticate, upload.single('image'), (req, res) => {
  res.send(`<h2>File uploaded successfully!</h2><p><a href="/api/page">Back</a></p>`)
})

module.exports = router
