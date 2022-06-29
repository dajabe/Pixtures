const express = require('express')

const router = express.Router()

module.exports = router

// POST /api/v1/cf
router.get('/', async (req, res) => {
  try {
    res.json({ hello: 'there' })
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})
