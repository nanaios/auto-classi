import type { ElementHandle, Page } from "puppeteer";
import { clickFinishButton, clickStudyProgram, clickSubmitButton, formatClassiAns, wait } from "./utility";

export async function anserForListSelection(page: Page, index: number) {
    const answers = await getAnswerForListSelection(page)
    //console.log(answers)
    await wait()

    await clickFinishButton(page)
    await wait()

    await clickStudyProgram(page, index)
    await wait()

    await setAnswerForList(page, answers)
    await wait()

    await clickSubmitButton(page)
    await wait()

    await clickFinishButton(page)
}

async function getAnswerForListSelection(page: Page) {
    const answers = await page.$(".answer-inner > div.content > div.select-substance")
    if (!answers) throw new Error("answersが存在しません!");
    const answerStrings = await answers.$$eval("dl > dd", element => {
        return element.map(elem => {
            return elem.innerText
        })
    })
    return answerStrings.map(answer => formatClassiAns(answer))
}

async function setAnswerForList(page: Page, answers: string[]) {
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