import type { ElementHandle, Page } from "puppeteer";
import { copyPage, isChecked, log, wait, waitForTransition } from "@/utilitys";
import { addPlayingVideoCount } from "./classi";
import { bringContorolPage } from "@/classi";
import { arg, status } from "../status";
import { getStudyProgramName } from "./studyPrograms";

interface VideoData {
    index: number,
    name: string
}

const videoPages: Page[] = []
const finishVideoDatas: (VideoData | null)[] = []

export async function isVideoPrograms(list: ElementHandle<HTMLElement>) {
    const icon = await list.$(".fa-film")
    return Boolean(icon)
}

export async function clearVideoQueue() {
    const indexs: number[] = []
    for (const data of finishVideoDatas) {
        if (!data) continue
        const videoPage = videoPages[data.index]

        await videoPage.bringToFront()
        await wait()

        await clickFinishButton(videoPage)
        await wait()

        await videoPage.close()
        await wait()

        await bringContorolPage()

        addPlayingVideoCount(-1)
        log(`ビデオタブ[name:${data.name}]が正常に閉じられました`);
        indexs.push(data.index)
    }
    finishVideoDatas.forEach((data, index) => {
        if (!data) return
        if (indexs.includes(data.index)) {
            finishVideoDatas[index] = null
        }
    })
}

export async function playVideo(page: Page, index: number, list: ElementHandle<HTMLElement>) {
    const name = await getStudyProgramName(list)
    if (await isChecked(list) || arg.skipVideo) {
        log(`\nビデオ[name:${name}]は再生済みのためスキップします\n`)
        return
    }

    log(`\nビデオ[name:${name}]の再生を開始\n`)

    await waitForTransition(page, list)
    await wait()

    addPlayingVideoCount(1)
    const newPage = await copyPage(page)
    videoPages[index] = newPage
    newPage.bringToFront()
    await newPage.exposeFunction('onNotifyEndVideoToAutoClassi', async (index: number) => {
        finishVideoDatas.push({
            name: name,
            index: index
        })

        log(`\nビデオ[name:${name}]の再生が終了しました\n`);
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
    }, index, arg.rate)

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