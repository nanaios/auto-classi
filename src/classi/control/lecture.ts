import { log, wait } from "@/utilitys"
import type { ElementHandle, Page } from "puppeteer"
import { solveQuestion } from "@/classi/answer"
import { playVideo, clearVideoQueue, isVideoPrograms } from "./video"
import { status } from "@/classi"
import { getStudyPrograms, isStudyPrograms } from "./studyPrograms"

export async function* getLectures(page: Page) {
    const lectures = await page.$$(".task-list > a")
    log(`合計講義数：${lectures.length}個`)
    for (let i = 0; i < lectures.length; i++) {
        const lectures = await page.$$(".task-list > a")
        yield lectures[i]
    }
}

export async function getLectureName(task: ElementHandle<HTMLElement>) {
    const label = await task.$eval(".simple-task-name > p > span.lecture_name", element => element.innerText)
    return label
}



export async function solveLectures(page: Page) {
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