const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')

module.exports = router

const url =
  'https://www.centralfootball.co.nz/manawatu-fixtures/mens-senior-football-4'
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

    // selector = #fe-draws-list-1043332 > table > tbody > tr:nth-child(2) > td.abbr-name-comp.home-team
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
router.get('/menstd', async (req, res) => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.on('console', (log) =>
      console.log(`Log from client: [${log.text()}] `)
    )
    // Wait for the page to load properly first
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.select('#widget_1043332 select.fe-comp-comps', '1790889155')
    await page.waitFor(5000)

    // selector = #fe-draws-list-1043332 > table > tbody > tr:nth-child(2) > td.abbr-name-comp.home-team
    const data = await page.evaluate(() => {
      // Select based on CSS row which has an outerText property that contains game details
      // Additional selector to try isolate rows in specific draw lists. Cup and League games but returns null for some reason.
      //* Stop trying to pull both divs of table in at the same time. Use an endpoint for cup fixtures and an endpoint for season fixtures

      const fixtureTable = Array.from(
        document.querySelectorAll('#fe-draws-list-1043332 table tr')
      )
      const fixtures = fixtureTable
        .filter((row) => Array.from(row.querySelectorAll('td')).length > 1)
        .map((row) => {
          const fixture = Array.from(row.querySelectorAll('td'))
            .filter((col) => col.innerText.length > 0)
            .map((col) => col.innerText)
          return [...new Set(fixture)]
        })
      return fixtures
    })
    await browser.close()
    res.send(data)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

//Puppeteer expermenting
// await res.status(200)
// const [el] = await page.$x(
//   //*[@id="widget_1043332"]/div[1]/div[3]/ul'
// )
// console.log(el)
// const src = await el.getProperty('src')
// const srcTxt = await src.jsonValue()
// console.log(srcTxt)

// const title = await page.title()
