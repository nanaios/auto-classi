import puppeteer, { type Page } from "puppeteer"

const wait = (ms: number) => {
    return new Promise<void>(res => {
        const id = setTimeout(() => {
            clearTimeout(id)
            res()
        })
    })
}

async function main() {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();
    console.log(`${(await page.title())}に接続しました。`)
    await wait(1000)
    await clickStudyProgram(page, 6)
    await wait(1000)
    await clickSubmitButton(page)
    await wait(1000)
    if (await isSelf(page)) {
        await answerForSelf(page)
    } else {
        await anserForSelection(page, 6)
        await wait(1000)
    }
}

async function isSelf(page: Page) {
    const isCorrect = await page.$(".text.is-correct")
    return Boolean(isCorrect)
}

async function clickStudyProgram(page: Page, index: number) {
    const lilsts = await page.$(".spen-mod-item-list.is-column-1.spen.spen-util-mb-24.lecture-flow")
    if (!lilsts) throw Error("listsが存在しません!");
    const li = (await lilsts.$$("li"))[index]
    await Promise.all([
        await li.click(),
        await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
    ])
}

async function answerForSelf(page: Page) {
    const button = await page.$$(".radio.self_rating")
    await button[0].click()
    await wait(1000)
}

async function anserForSelection(page: Page, index: number) {
    const answer = await getAnswerFor4(page)
    if (answer === -1) throw Error("定義されていない解答です!")
    await clickFinishButton(page)
    await wait(1000)

    await clickStudyProgram(page, index)
    await wait(1000)

    await clickInput(page, answer)
    await wait(1000)

    await clickSubmitButton(page)
    await wait(1000)

}

async function clickInput(page: Page, index: number) {
    const inputs = await page.$$(".checkbox")
    await inputs[index].click()
}

const ANSWER_INDEXS = [
    "ア",
    "イ",
    "ウ",
    "エ",
    "オ",
    "カ",
    "キ",
    "ク",
    "ケ"
]

async function getAnswerFor4(page: Page) {
    const answer = await page.$eval(".answer-inner > div.content > ul.spen-mod-label-text-list > li > dl.clearfix > dd", element => {
        return element.innerHTML
    })
    return ANSWER_INDEXS.indexOf(answer)
}

async function clickSubmitButton(page: Page) {
    const button = await page.$$(".navt-btn, .submit-button")
    await Promise.all(
        [
            await button[0].click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

async function clickFinishButton(page: Page) {
    const button = await page.$(".btn-area.clearfix.no-interval > li.right > input.navy-btn")
    if (!button) throw Error("buttonが存在しません!");
    await Promise.all(
        [
            await button.click(),
            await page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] })
        ]
    )
}

main()