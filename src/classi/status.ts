import { log } from "@/utilitys"
import type { Page } from "puppeteer"
export const status = {
    questionCount: 0,
    correctAnswerFirstCount: 0,
    notCorrectAnswerFirstCount: 0,
    videoIndex: 0,
    playingVideoCount: 0,
    isSearchFinish: false,
}

interface Arg {
    rate: number
    wait: number
    per: number
    skipVideo: boolean
    log: boolean
}

export let arg: Arg

export function setArg(data: Arg) {
    arg = data
}

let controlingPage: Page

export function setControlingPage(page: Page) {
    controlingPage = page
}

export async function bringContorolPage() {
    await controlingPage.bringToFront()
}

export function showProgramStatus() {
    log(`待機時間:${arg.wait}`)
    log(`推定初手正解率:${arg.per}`)
    log(`ビデオの再生倍率:${arg.rate}`)
    console.log("開発者モードです")
}

export function checkFinish() {
    const { correctAnswerFirstCount, notCorrectAnswerFirstCount, questionCount, videoIndex } = status
    log(`解答した問題数:${questionCount}個`)
    if (questionCount !== 0) {
        log(`初手正解率:${correctAnswerFirstCount / questionCount * 100}%`)
        log(`初手不正解率:${notCorrectAnswerFirstCount / questionCount * 100}%`)
    }
    log(`再生したビデオ数:${videoIndex}個`)

    log("AutoClassiを終了します")
    process.exit(0)

}