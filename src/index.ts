import puppeteer, { type Page } from "puppeteer"
import { getStudyPrograms, isStudyPrograms, wait, getLectureName, isVideoPrograms, getAssignmentName, getAssignments } from "./utility"
import { clickLeftButton, clickStartAssignmentButton, waitForTransition } from "./clickButton";
import { playVideo } from "./video";
import { checkFinish, setControlingPage } from "./status";
import { status } from "./status";
import { solveQuestion } from "./answer";

export function addPlayingVideoCount(value: number) {
    status.playingVideoCount += value
    checkFinish()
}
export async function main() {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222'
    });

    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();
    setControlingPage(page)

    const basePageUrl = page.url()

    await wait()
    console.log("autoClassiを起動しました")

    for await (const assignment of getAssignments(page)) {
        await waitForTransition(page, assignment)
        await wait()

        await solveAssignment(page)
        await wait()

        await page.goto(basePageUrl, { waitUntil: ['load', 'networkidle2'] })
        await wait()
    }

    await wait()
    await solveAssignment(page)
    status.isSearchFinish = true
    console.log("\n全設問の探索が終了しました\n")
    checkFinish()
}

async function solveAssignment(page: Page) {
    const assignmentName = await getAssignmentName(page)
    console.log(`\n課題[name:${assignmentName}]の解答を開始\n`)

    await clickStartAssignmentButton(page)
    await wait()

    const lecturesLength = (await page.$$(".task-list > a")).length

    console.log(`合計講義数：${lecturesLength}個`)

    for (let i = 0; i < lecturesLength; i++) {
        const lectures = await page.$$(".task-list > a")
        const lectureName = await getLectureName(lectures[i])
        console.log(`\n講義[name:${lectureName}]の解答を開始\n`)

        await waitForTransition(page, lectures[i])
        await wait()

        await solveLectures(page)
        await wait()

        await clickLeftButton(page)
        console.log(`\n講義[name:${lectureName}]の解答を終了\n`)
        await wait()
    }
    await clickLeftButton(page)
    console.log(`\n課題[name:${assignmentName}]の解答を終了\n`)
    await wait()
}

async function solveLectures(page: Page) {
    for await (const list of getStudyPrograms(page)) {
        if (await isStudyPrograms(list)) {

            await solveQuestion(page, list)
            await wait()

        } else if (await isVideoPrograms(list)) {
            await playVideo(page, status.videoIndex, list)
            await wait()
        }
    }
}