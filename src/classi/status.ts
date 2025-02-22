import type { Page } from "puppeteer"
export const status = {
    questionCount: 0,
    correctAnswerFirstCount: 0,
    notCorrectAnswerFirstCount: 0,
    videoIndex: 0,
    playingVideoCount: 0,
    isSearchFinish: false,
}

export const optionArgs = process.argv.map(arg => arg.startsWith("--") ? arg : null).filter(val => val !== null)

interface Arg {
    dev: boolean
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

export function argToNumber(name: string) {
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
    console.log(`待機時間:${arg.wait}`)
    console.log(`推定初手正解率:${arg.per}`)
    console.log(`ビデオの再生倍率:${arg.rate}`)
    if (arg.dev) {
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