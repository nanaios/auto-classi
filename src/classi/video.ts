import { goTo, wait, waitForClickTransition } from "@/utility";
import type { ElementHandle, Page } from "puppeteer";

let videoIndex = 0

export async function isVideoContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-film")
    return mark !== null
}

export async function solveVideoContent(page: Page, content: ElementHandle<HTMLElement>) {
    await waitForClickTransition(page, content)

    const videoPage = await page.browser().newPage()

    await videoPage.exposeFunction("onEndedVideo", (index: number) => {
        console.log(`end viode[index:${index}]`);
    });

    await goTo(page, page.url())

    await videoPage.click("div#video_area")
    await videoPage.waitForSelector("#video_area video")
    await videoPage.$eval("#video_area video", (video, index) => {
        video.volume = 0
        video.addEventListener("play", () => {
            video.playbackRate = 10
        }, { once: true })
        video.addEventListener("ended", () => {
            window["onEndedVideo"](index)
        }, { once: true })
    }, videoIndex)
    videoIndex++
    await wait(5000)

    await page.bringToFront()
    await page.goBack()
}