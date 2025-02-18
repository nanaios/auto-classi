import type { ElementHandle, Page } from "puppeteer";
import { copyPage, getStudyProgramName, isChecked, wait } from "./utility";
import { addPlayingVideoCount } from ".";
import { bringContorolPage, PLAY_RATE } from "./status";
import { waitForTransition } from "./clickButton";
import { status } from "./status";

interface VideoData {
    id: number,
    name: string
}

const videoPages: Page[] = []
const finishVideoDatas: VideoData[] = []

async function clearVideoQueue() {

}

export async function playVideo(page: Page, index: number, list: ElementHandle<HTMLElement>) {
    const name = await getStudyProgramName(list)
    if (await isChecked(list)) {
        console.log(`\nビデオ[name:${name}]は再生済みのためスキップします\n`)
    }

    console.log(`\nビデオ[name:${name}]の再生を開始`)

    await waitForTransition(page, list)
    await wait()

    addPlayingVideoCount(1)
    const newPage = await copyPage(page)
    videoPages[index] = newPage
    newPage.bringToFront()
    await newPage.exposeFunction('onNotifyEndVideoToAutoClassi', async (index: number) => {
        //setVideoQueue(index, name)

        console.log(`\nビデオ[name:${name}]の再生が終了しました\n`);
        const videoPage = videoPages[index]

        await videoPage.bringToFront()
        await wait()

        await clickFinishButton(videoPage)
        await wait()

        await videoPage.close()
        await wait()

        await bringContorolPage()

        addPlayingVideoCount(-1)
    });

    const videoArea = await newPage.$("#video_area")
    if (!videoArea) throw new Error("videoAreaが存在しません!");
    await videoArea.click()
    await newPage.waitForSelector("#vjs_video_3 > video")

    await newPage.$eval("#vjs_video_3 > video", (element, index, rate) => {
        return new Promise<void>(res => {
            element.volume = 0
            element.addEventListener("playing", () => {
                element.playbackRate = rate
                res()
            })
            element.addEventListener("ended", () => {
                //@ts-ignore
                window.onNotifyEndVideoToAutoClassi(index)
            })
            if (!element.paused) {
                element.playbackRate = rate
                res()
            }
        })
    }, index, PLAY_RATE)

    await wait()
    status.videoIndex++

    await page.bringToFront()
    await wait()

    await page.goBack()
}

async function clickFinishButton(page: Page) {
    const button = await page.$(".navy-btn.finish_btn")
    if (!button) throw new Error("buttonが存在しません!");
    await Promise.all(
        [
            await button.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}