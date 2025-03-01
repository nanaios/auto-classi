import { runCommandArgs } from "@/args";
import { defaultLog, detailedLog } from "@/log";
import { getElement, goTo, wait, waitForClickTransition } from "@/utility";
import type { ElementHandle, Page } from "puppeteer";

let videoIndex = 0
const videoPages: Page[] = []
const playVideoIndexs: number[] = []
const finishVideoIndexQueue: number[] = []

export async function isVideoContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-film")
    return mark !== null
}

async function clickFinishButton(page: Page) {
    const button = await getElement(page, ".right > a")
    await waitForClickTransition(page, button)
}

export async function clearQueue() {
    if (finishVideoIndexQueue.length === 0) return;
    defaultLog("再生終了した動画タブを閉じます")
    for (let i = 0; i < finishVideoIndexQueue.length; i++) {

        //閉じるページをアクティブ状態にする
        const page = videoPages[finishVideoIndexQueue[i]]
        await page.bringToFront()

        const name = await page.$eval("p.title", p => p.innerText)

        //"取組完了"ボタンを押す
        await clickFinishButton(page)

        await page.close()
        defaultLog(`動画タブ[name:#"${name}"]を閉じました`)

        //キューから処理済みのインデックスを消去する
        finishVideoIndexQueue.shift()
    }
}

export async function solveVideoContent(page: Page, content: ElementHandle<HTMLElement>) {
    await waitForClickTransition(page, content)

    //ページを新しく開く
    const videoPage = await page.browser().newPage()

    //ブラウザ側で動画が再生開始したときに、nodejs側で処理するための関数定義
    await videoPage.exposeFunction("onPlayVideo", (index: number) => {
        detailedLog(`動画[index:${index}]の再生を確認`)
        //インデックスを挿入し再生を開始したことを記録する
        playVideoIndexs.push(index)
    })


    //ブラウザ側で動画が再生終了したときに、nodejs側で処理するための関数定義
    await videoPage.exposeFunction("onEndedVideo", (index: number) => {
        detailedLog(`動画[index:${index}]の再生終了を確認`)
        //キューに動画のインデックスを挿入する
        finishVideoIndexQueue.push(index)
    });

    //動画タブに遷移
    await goTo(videoPage, page.url())

    videoPages.push(videoPage)

    //動画を再生
    await videoPage.click("div#video_area")

    await videoPage.waitForSelector("#video_area video")

    //videoタグにイベントリスナーをセットする
    await videoPage.$eval("#video_area video", (video, index, rate) => {
        video.volume = 0

        //再生速度変更
        video.addEventListener("play", () => {
            video.playbackRate = rate

            //上で定義した関数を呼び出し、nodejs側の処理を呼ぶ
            window["onPlayVideo"](index)
        }, { once: true })

        //動画の再生終了時
        video.addEventListener("ended", () => {

            //上で定義した関数を呼び出し、nodejs側の処理を呼ぶ
            window["onEndedVideo"](index)
        }, { once: true })
    }, videoIndex, runCommandArgs.rate)

    //"onPlayVideo"が呼ばれて、インデックスが挿入されるまで待機
    while (!playVideoIndexs.includes(videoIndex)) {
        await wait()
    }

    videoIndex++

    await page.bringToFront()
    await page.goBack()
}