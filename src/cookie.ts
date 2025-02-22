import fs from "fs"
import path from "path"
import type { Page } from "puppeteer"
import puppeteer from "puppeteer"

const cookiePath = path.join(process.argv[1], "../../", "cookie.json")

export async function saveCookie(page: Page) {
    const cookies = await page.cookies()
    const json = JSON.stringify(cookies)
    fs.writeFileSync(cookiePath, json)
}

export async function loadCookie(page: Page) {
    const cookieJson = JSON.parse(fs.readFileSync(cookiePath, "utf-8"))
    await page.setCookie(...cookieJson)
}