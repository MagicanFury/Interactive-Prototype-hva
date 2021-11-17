const fs = require('fs').promises
const path = require('path')
const express = require('express')
const app = express()
const port = 80

app.use(express.static('public'))

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/public/live.html'))
})

app.listen(port, () => {
    console.log(`Server Started http://localhost:${port}`)
})