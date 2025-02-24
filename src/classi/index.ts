import puppeteer from "puppeteer";
import { solveTasks } from "./task";
import { login } from "./login";
import { wait } from "@/utility";

const BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_complete"

export async function run() {
    const cookies = await login()
    await wait()

    const browser = await puppeteer.launch({ headless: false })

    await browser.setCookie(...cookies)

    const pages = await browser.pages()
    const page = pages[0]

    await page.goto(BASE_URL, { waitUntil: ['load', 'networkidle2', 'domcontentloaded'] })
    await wait()

    console.log("AutoClassi起動")
    await solveTasks(page, BASE_URL)
}