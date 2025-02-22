import puppeteer from "puppeteer"
import { wait, waitForTransition } from "@/utilitys"
import { clearVideoQueue } from "./video";
import { checkFinish, setControlingPage, showProgramStatus, status } from "@/classi";
import { getAssignments, solveAssignment } from "./assignment";
import { loadCookie } from "@/cookie";
import { login } from "@/login";

const basePageUrl = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_in_studying"

export function addPlayingVideoCount(value: number) {
    status.playingVideoCount += value
}
export async function main(vewsion: string) {

    await login()
    await wait()

    const browser = await puppeteer.launch({ headless: true })
    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();
    setControlingPage(page)

    await loadCookie(page)
    await wait()

    await page.goto(basePageUrl, { waitUntil: ['load', 'networkidle2'] })
    await wait()

    console.log(`AutoClassi v${vewsion}`)
    showProgramStatus()

    for await (const assignment of getAssignments(page)) {
        await waitForTransition(page, assignment)
        await wait()

        await solveAssignment(page)
        await wait()

        await page.goto(basePageUrl, { waitUntil: ['load', 'networkidle2'] })
        await wait()
    }
    status.isSearchFinish = true
    console.log("\n全設問の探索が終了しました\n")
    if (status.playingVideoCount !== 0) {
        console.log("\n全てのビデオの再生終了を待機します\n")
        while (status.playingVideoCount !== 0) {
            await clearVideoQueue()
            await wait(1000)
        }
    }
    checkFinish()
}