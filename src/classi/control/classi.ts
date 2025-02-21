import puppeteer from "puppeteer-core"
import { wait, waitForTransition } from "@/utilitys"
import { clearVideoQueue } from "./video";
import { checkFinish, setControlingPage, showProgramStatus, status } from "@/classi";
import { getAssignments, solveAssignment } from "./assignment";

export function addPlayingVideoCount(value: number) {
    status.playingVideoCount += value
}
export async function main(vewsion: string) {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222'
    });

    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();
    setControlingPage(page)

    const basePageUrl = page.url()

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