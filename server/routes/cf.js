const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')

const objectify = require('../../libs/objectify')

module.exports = router

const url =
  'https://www.centralfootball.co.nz/manawatu-fixtures/mens-senior-football-4'
const keyArr = ['date', 'home', 'vs', 'away', 'ground']

// POST /api/v1/cf
router.get('/', async (req, res) => {
  try {
    res.json({ game: 'FOOTBALL!!!' })
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

router.get('/mensfixtures', async (req, res) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.on('console', (log) =>
      console.log(`Log from client: [${log.text()}] `)
    )
    await page.goto(url, { waitUntil: 'networkidle2' })

    const divs = await page.$$('.fe-draws-list')
    const data = await divs.$$('table tr')
    console.log(data)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

router.get('/mens', async (req, res) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // Wait for the page to load properly first
    await page.goto(url, { waitUntil: 'networkidle2' })

    const fixtures = await page.evaluate(() => {
      return Array.from(
        // Select based on CSS row which has an outerText property that contains game details
        document.querySelectorAll("[class^='fixture-row']")
      ).map((obj) => {
        return Array.from(obj.children)
          .filter((child) => child.innerText.length > 0)
          .map((child) => child.innerText)
      })
    })
    await browser.close()
    res.send(fixtures)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

// Alternative method using table tr and td as selectors
router.get('/mens-horizons', async (req, res) => {
  // Refactor this to use helper functions
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.on('console', (log) =>
      console.log(`Log from client: [${log.text()}] `)
    )
    // Wait for the page to load properly first
    await page.goto(url, { waitUntil: 'networkidle2' })
    // Select competition, second param here specifies the competition
    await page.select('#widget_1043332 select.fe-comp-comps', '1790889155')
    // Wait for selector to load content
    await page.waitForNetworkIdle()

    const data = await page.evaluate(() => {
      // Grab all table row elements under the div for season fixtures
      return Array.from(
        document.querySelectorAll('#fe-draws-list-1043332 table tr')
      ) // Filter out any empty results
        .filter((row) => Array.from(row.querySelectorAll('td')).length > 1)
        .map((row) => {
          // For each column in the row filter out empties and then grab the innerText
          const fixture = Array.from(row.querySelectorAll('td'))
            .filter((col) => col.innerText.length > 0)
            .map((col) => col.innerText)
          // Set here allows us to eliminate duplicate records for team names
          return [...new Set(fixture)]
        })
    })
    browser.close()
    res.json(objectify(data, keyArr))
  } catch (err) {
    res.status(500).send(err.message)
  }
})
