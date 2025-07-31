const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.get('/login', (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 30px;">
            <h1 style="font-weight: 900; font-size: 3.5rem; text-transform: uppercase; margin-bottom: 50px;">LOGIN</h1>
            <form method="POST" action="/api/users/login" style="display: flex; flex-direction: column; align-items: center; gap: 20px; width: 300px;">
                <input type="email" name="email" placeholder="Email" required style="width: 100%; padding: 10px; font-size: 1rem;" />
                <input type="password" name="password" placeholder="Password" required style="width: 100%; padding: 10px; font-size: 1rem;" />
                <button type="submit" style="width: 100%; padding: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">LOGIN</button>
            </form>
            <button onclick="location.href='/api/users/signup'" style="margin-top: 40px; padding: 12px 24px; font-weight: 700; font-size: 1.1rem; cursor: pointer; background: transparent; border: 2px solid #333; border-radius: 4px;">SIGN UP</button>
        </div>
    `)
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select('+password')
        if (!user) return res.status(400).send('Invalid credentials')

        const isMatch = await user.comparePassword(password)
        if (!isMatch) return res.status(400).send('Invalid credentials')

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000
        })

        res.redirect('/api/page')

    } catch (err) {
        res.status(500).send('Server error')
    }
})

const authenticate = (req, res, next) => {
    const token = req.cookies.token
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch {
        res.status(400).send('Invalid token.')
    }
}

const protectedRoute = (req, res) => {
    res.send(`<h1>Welcome, User ${req.user.id}!</h1><p>This is a protected page.</p>`)
}

module.exports = router
module.exports.authenticate = authenticate
module.exports.protectedRoute = protectedRoute
