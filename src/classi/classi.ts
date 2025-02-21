import puppeteer, { type Page } from "puppeteer-core"
import { getStudyPrograms, isStudyPrograms, wait, getLectureName, isVideoPrograms, getAssignmentName, getAssignments, getLectures } from "../utilitys/utility"
import { clickLeftButton, clickStartAssignmentButton, waitForTransition } from "./clickButton";
import { clearVideoQueue, playVideo } from "./video";
import { checkFinish, setControlingPage, showProgramStatus } from "./status";
import { status } from "./status";
import { solveQuestion } from "./answer/answer";

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

async function solveAssignment(page: Page) {
    const assignmentName = await getAssignmentName(page)
    console.log(`\n課題[name:${assignmentName}]の解答を開始\n`)

    await clickStartAssignmentButton(page)
    await wait()

    for await (const lecture of getLectures(page)) {
        const lectureName = await getLectureName(lecture);
        console.log(`\n講義[name:${lectureName}]の解答を開始\n`);

        await waitForTransition(page, lecture);
        await wait();

        await solveLectures(page);
        await wait();

        await clickLeftButton(page);
        console.log(`\n講義[name:${lectureName}]の解答を終了\n`);
        await wait();
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
        await clearVideoQueue()
        await wait()

        await page.bringToFront()
    }
}