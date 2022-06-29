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
    // Wait for the page to load properly first
    await page.goto(url, { waitUntil: 'networkidle2' })

    // selector = #fe-draws-list-1043332 > table > tbody > tr:nth-child(2) > td.abbr-name-comp.home-team
    const data = await page.evaluate(() => {
      // Select based on CSS row which has an outerText property that contains game details
      // Additional selector to try isolate rows in specific draw lists. Cup and League games but returns null for some reason.
      return Array.from(document.querySelectorAll('.fe-draws-list')).map(
        (comp) => {
          Array.from(comp.querySelectorAll('table tr'))
            .filter((row) => Array.from(row.querySelectorAll('td')).length > 1)
            .map((row) => {
              return Array.from(row.querySelectorAll('td'))
                .filter((col) => col.innerText.length > 0)
                .map((col) => col.innerText)
            })
        }
      )
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
//   '/html/body/div[1]/div[2]/div[1]/div[1]/div/div[1]/div/div[1]/div'
// )
// console.log(el)
// const src = await el.getProperty('src')
// const srcTxt = await src.jsonValue()
// console.log(srcTxt)

// const title = await page.title()
