import type { Page } from "puppeteer"
export const status = {
    questionCount: 0,
    correctAnswerFirstCount: 0,
    notCorrectAnswerFirstCount: 0,
    videoIndex: 0,
    playingVideoCount: 0,
    isSearchFinish: false,
}
export const BASE_WAIT_TIME = argToNumber(1) ?? 500
export const PLAY_RATE = argToNumber(2) ?? 1
export const RANDOM_PER = argToNumber(0) ?? 100
export const TIMEOUT = argToNumber(0) ?? 2000
export const isDev = process.argv[process.argv.length - 1] === "dev"

let controlingPage: Page
function argToNumber(index: number) {
    const arg = Number(process.argv[index + 3])
    if (Number.isNaN(arg)) {
        return undefined
    } else {
        return arg
    }
}

export function setControlingPage(page: Page) {
    controlingPage = page
}

export async function bringContorolPage() {
    await controlingPage.bringToFront()
}

export function showProgramStatus(url: string) {
    console.log(`起動時のURL:${url}`)
    console.log(`デフォルトの待機時間:${BASE_WAIT_TIME}`)
    console.log(`推定初手正解率:${RANDOM_PER}`)
    console.log(`ビデオの再生倍率:${PLAY_RATE}`)
    if (isDev) {
        console.log("開発者モード状態です")
    }

}

export function checkFinish() {
    const { correctAnswerFirstCount, isSearchFinish, notCorrectAnswerFirstCount, playingVideoCount, questionCount, videoIndex } = status
    if ((playingVideoCount === 0 || videoIndex === 0) && isSearchFinish) {
        console.log(`解答した問題数:${questionCount}個`)
        console.log(`初手正解率:${correctAnswerFirstCount / questionCount * 100}%`)
        console.log(`初手不正解率:${notCorrectAnswerFirstCount / questionCount * 100}%`)
        console.log(`再生したビデオ数:${videoIndex}個`)

        console.log("AutoClassiを終了します")
        process.exit(0)
    }
}