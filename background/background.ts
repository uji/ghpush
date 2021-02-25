import 'puppeteer-core'
import { launch, Page, Protocol } from 'puppeteer-core'

class GithubBrowser {
  page: Page | null
  constructor() {
    this.page = null
  }
  init = async () => {
    const browser = await launch()
    this.page = await browser.newPage()
  }
  get = () => {
    if (!this.page) throw new Error("browser does not initialized")

    let chromeCookies: chrome.cookies.Cookie[] = []
    chrome.cookies.getAll({ domain: 'github.com' }, (cs) => { chromeCookies = cs })

    const cookies = chromeCookies.map((c) => {
      let sameSite: Protocol.Network.CookieSameSite
      switch (c.sameSite) {
        case 'lax':
          sameSite = 'Lax'
          break
        case 'strict':
          sameSite = 'Strict'
          break
        default:
          sameSite = 'None'
      }
      return {
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        secure: c.secure,
        httpOnly: c.httpOnly,
        sameSite: sameSite,
        expires: c.expirationDate,
      } as Protocol.Network.CookieParam
    })
    this.page.setCookie(...cookies)
    this.page.goto('https://github.com/pulls/review-requested')
    this.page.$$eval('js-navigation-container js-active-navigation-container', (es) => {
      console.log(es)
    })
  }
}

const page = new GithubBrowser()
page.init()

const onReceivedReviewRequest = () => {
  page.get()
  chrome.notifications.create({
    type: 'basic',
    title: 'ghpush',
    message: '新しい Review request があります',
    iconUrl: 'icon128.png',
  })
}

chrome.alarms.create({
  delayInMinutes: 1,
  periodInMinutes: 1,
})

chrome.alarms.onAlarm.addListener(() => {
  onReceivedReviewRequest()
})
