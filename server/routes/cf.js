const express = require('express')

const router = express.Router()

module.exports = router

// POST /api/v1/cf
router.get('/', async (req, res) => {
  res.json({ hello: 'there' })
})
