import type { Page } from "puppeteer";
import { argToNumber, copyPage, wait } from "./utility";
import { finish } from ".";

const PLAY_RATE = argToNumber(2) ?? 1
console.log(`ビデオの再生倍率:${PLAY_RATE}`)
const videoPages: Page[] = []
const finishVideoDatas: Array<{ index: number, name: string }> = []

let isSearchFinish = false
export async function clearVideoQueue() {
    for (const data of finishVideoDatas) {
        console.log(`ビデオ[name:${data.name}]の再生が終了しました`);
        const videoPage = videoPages[data.index]

        await videoPage.bringToFront()
        await wait()

        await clickFinishButton(videoPage)
        await wait(500)

        await videoPage.close()
        await wait(500)
    }
}

function setVideoQueue(index: number, name: string) {
    finishVideoDatas.push({ index: index, name: name })
}

export async function playVideo(page: Page, index: number, name: string) {
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

        page.bringToFront()

        if (isSearchFinish && (videoPages.length - 1) === index) {
            console.log("\n全ビデオの再生が終了しました\n")
            finish()
        }
    });

    const videoArea = await newPage.$("#video_area")
    if (!videoArea) throw new Error("videoAreaが存在しません!");
    await videoArea.click()
    await newPage.waitForSelector("#vjs_video_3")
    await wait(1000)

    await newPage.$eval("#vjs_video_3 > video", (element, index, rate) => {
        console.log(`video index = ${index}`)
        element.volume = 0
        element.addEventListener("ended", () => {
            //@ts-ignore
            window.onNotifyEndVideoToAutoClassi(index)
        })
        setTimeout(() => {
            element.playbackRate = rate
        }, 1000);

    }, index, PLAY_RATE)

    await wait(2000)
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

export function notifyFinishSearch() {
    isSearchFinish = true
}