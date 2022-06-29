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
    await page.goto(url, { waitUntil: 'networkidle2' })

    // selector = #fe-draws-list-1043332 > table > tbody > tr:nth-child(2) > td.abbr-name-comp.home-team
    const fixtures = await page.evaluate(() => {
      return Array.from(
        // Select based on CSS row which has an outerText property that contains game details
        document.querySelectorAll("[class^='fixture-row']")
      ).map((obj) => {
        return obj.innerText
      })
    })
    await browser.close()
    res.send(fixtures)
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
