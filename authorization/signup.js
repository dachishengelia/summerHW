const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.get('/signup', (req, res) => {
    res.send(`
        <div style="font-family: Arial; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 30px;">
            <h1 style="font-weight: 900; font-size: 3.5rem; text-transform: uppercase; margin-bottom: 50px;">SIGN UP</h1>
            <form method="POST" action="/api/users/signup" style="display: flex; flex-direction: column; align-items: center; gap: 20px; width: 300px;">
                <input type="text" name="fullName" placeholder="Full Name" required style="width: 100%; padding: 10px; font-size: 1rem;" />
                <input type="email" name="email" placeholder="Email" required style="width: 100%; padding: 10px; font-size: 1rem;" />
                <input type="password" name="password" placeholder="Password" required style="width: 100%; padding: 10px; font-size: 1rem;" />
                <button type="submit" style="width: 100%; padding: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">SIGN UP</button>
            </form>
            <button onclick="location.href='/api/users/login'" style="margin-top: 40px; padding: 12px 24px; font-weight: 700; font-size: 1.1rem; cursor: pointer; background: transparent; border: 2px solid #333; border-radius: 4px;">LOGIN</button>
        </div>
    `)
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).send('User already exists')

        const user = new User({ fullName, email, password })
        await user.save()

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
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

module.exports = router
