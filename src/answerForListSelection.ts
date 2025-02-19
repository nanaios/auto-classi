import type { ElementHandle, Page } from "puppeteer-core";
import { formatClassiAns, random, wait } from "./utility";

export async function isListSelection(page: Page) {
    const list = await page.$(".spen-mod-select")
    return Boolean(list)
}

export async function getAnswerForListSelection(page: Page) {
    const answers = await page.$(".answer-inner > div.content > div.select-substance")
    if (!answers) throw new Error("answersが存在しません!");
    const answerStrings = await answers.$$eval("dl > dd", element => {
        return element.map(elem => {
            return elem.innerText
        })
    })
    const formatAnswers = answerStrings.map(answer => formatClassiAns(answer))
    console.log(`答え:${formatAnswers}`)
    return formatAnswers
}

export async function setAnswerForList(page: Page, answers: string[]) {
    const lists = await page.$(".question-select")
    if (!lists) throw Error("listsが存在しません!");
    const list = await lists.$$("li > ul")
    for (let i = 0; i < answers.length; i++) {
        await list[i].click()
        await wait()
        await setAnswerForUl(list[i], answers[i])
        await wait()
    }
}

async function setAnswerForUl(list: ElementHandle<HTMLElement>, answer: string) {
    const optionList = await list.$("li > div.image-select-box > ul.option-list")
    if (!optionList) throw new Error("optionListが存在しません!");
    const options = (await optionList.$$eval("li", elements => elements.map(element => element.innerText))).map(option => formatClassiAns(option))
    //console.log(options)
    const lists = await optionList.$$("li")
    await lists[options.indexOf(answer)].click()
}

export async function setRandomAnswerForList(page: Page) {
    const lists = await page.$(".question-select")
    if (!lists) throw Error("listsが存在しません!");
    const list = await lists.$$("li > ul")

    for (let i = 0; i < list.length; i++) {
        await list[i].click()
        await wait()
        await setRandomAnswerForUl(list[i])
        await wait()
    }
}


async function setRandomAnswerForUl(list: ElementHandle<HTMLElement>) {
    const optionList = await list.$("li > div.image-select-box > ul.option-list")
    if (!optionList) throw new Error("optionListが存在しません!");
    const lists = await optionList.$$("li")
    await lists[random(lists.length)].click()
}