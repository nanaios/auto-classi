import type { Page } from "puppeteer-core"
export const status = {
    questionCount: 0,
    correctAnswerFirstCount: 0,
    notCorrectAnswerFirstCount: 0,
    videoIndex: 0,
    playingVideoCount: 0,
    isSearchFinish: false,
}

const optionArgs = process.argv.map(arg => arg.startsWith("--") ? arg : null).filter(val => val !== null)

export const BASE_WAIT_TIME = argToNumber("wait") ?? 500
export const PLAY_RATE = argToNumber("rate") ?? 1
export const RANDOM_PER = argToNumber("per") ?? 100
export const TIMEOUT = argToNumber("timeout") ?? 2000
export const isDev = process.argv.includes("--dev")
export const isSkipVideo = process.argv.includes("--skip-video")

let controlingPage: Page
function argToNumber(name: string) {
    let retVal: number | undefined
    optionArgs.forEach(arg => {
        if (arg.includes(name)) {
            const value = Number(arg.split("=")[1])
            if (!Number.isNaN(value)) {
                retVal = value
            }
        }
    })
    return retVal
}

export function setControlingPage(page: Page) {
    controlingPage = page
}

export async function bringContorolPage() {
    await controlingPage.bringToFront()
}

export function showProgramStatus() {
    console.log(`待機時間:${BASE_WAIT_TIME}`)
    console.log(`推定初手正解率:${RANDOM_PER}`)
    console.log(`ビデオの再生倍率:${PLAY_RATE}`)
    if (isDev) {
        console.log("開発者モード状態です")
    }

}

export function checkFinish() {
    const { correctAnswerFirstCount, notCorrectAnswerFirstCount, questionCount, videoIndex } = status
    console.log(`解答した問題数:${questionCount}個`)
    if (questionCount !== 0) {
        console.log(`初手正解率:${correctAnswerFirstCount / questionCount * 100}%`)
        console.log(`初手不正解率:${notCorrectAnswerFirstCount / questionCount * 100}%`)
    }
    console.log(`再生したビデオ数:${videoIndex}個`)

    console.log("AutoClassiを終了します")
    process.exit(0)

}