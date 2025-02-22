import fs from "fs"
import path from "path"
import type { Page } from "puppeteer"
import puppeteer from "puppeteer"

const cookiePath = path.join(process.argv[1], "../../", "cookie.json")

export async function cookie(page: Page, inputs: any, url: string) {
    if (inputs.setCookie) {
        await saveCookie(page)
    }
    if (inputs.loadCookie) {
        await loadCookie(url)
    }
}

async function saveCookie(page: Page) {
    const cookies = await page.cookies()
    const json = JSON.stringify(cookies)
    fs.writeFileSync(cookiePath, json)
}

async function loadCookie(url: string) {
    const cookieJson = JSON.parse(fs.readFileSync(cookiePath, "utf-8"))
    const browser = await puppeteer.launch({ headless: false })

    await browser.setCookie(...cookieJson)
    const pages = await browser.pages()
    const page = pages[0]

    await page.goto(url, { waitUntil: ['load', 'networkidle2'] })
}