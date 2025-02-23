import type { ElementHandle, Page } from "puppeteer";
import { getAnswerForInput, isInput, setAnswerForInput } from "./answerForInput";
import { getAnswerForListSelection, isListSelection, setAnswerForList } from "./answerForListSelection";
import { getAnswerForMultiInput, isMultiInput, setAnswerForMultiInput } from "./answerForMultiInput";
import { getAnswerForSelection, isSelection, setAnswerForSelection } from "./answerForSelection";
import { isSelf, setAnswerForSelf } from "./answerForSelf";
import { copyPage, isChecked, isCorrectProgram, random, wait, waitForTransition } from "@/utilitys";
import { clickSubmitButton, clickFinishButton } from "../control/clickButton";
import { arg, setControlingPage, status } from "@/classi";
import { getStudyProgramName } from "../control/studyPrograms";

export interface AnswerData {
    string: string,
    strings: string[]
}

type AnswerType = "self" | "selection" | "input" | "multiinput" | "listselection"

export async function getAnswer(page: Page, data: AnswerData, type: AnswerType | undefined) {
    try {
        switch (type) {
            case "input": {
                data.string = await getAnswerForInput(page)
                break;
            }
            case "listselection": {
                data.strings = await getAnswerForListSelection(page)
                break;
            }
            case "multiinput": {
                data.strings = await getAnswerForMultiInput(page)
                break;
            }
            case "selection": {
                data.strings = await getAnswerForSelection(page)
                break;
            }
        }
    } catch (error) {
        console.info(error)
    }
    await wait()
}

export async function setAnswer(page: Page, data: AnswerData, type: AnswerType | undefined) {
    console.info("答えをセットします")
    try {
        switch (type) {
            case "input": {
                await setAnswerForInput(page, data.string)
                break;
            }
            case "listselection": {
                await setAnswerForList(page, data.strings)
                break;
            }
            case "multiinput": {
                await setAnswerForMultiInput(page, data.strings)
                break;
            }
            case "selection": {
                await setAnswerForSelection(page, data.strings)
                break;
            }
        }
    } catch (error) {
        console.info(error)
    }
    await wait()
}

export async function getAnswerType(page: Page): Promise<AnswerType | undefined> {
    if (await isSelf(page)) return "self";
    if (await isSelection(page)) return "selection";
    if (await isInput(page)) return "input";
    if (await isMultiInput(page)) return "multiinput";
    if (await isListSelection(page)) return "listselection";
}

export async function solveQuestion(page: Page, list: ElementHandle<HTMLElement>) {
    const name = await getStudyProgramName(list)
    if (await isChecked(list) && await isCorrectProgram(list)) {
        console.info(`\n設問[name:${name}]は正解済みなのでスキップします\n`)
        return
    }

    console.info(`\n設問[name:${name}]の解答を開始`)
    status.questionCount++

    await waitForTransition(page, list)
    await wait()

    const newPage = await copyPage(page)
    newPage.bringToFront()
    setControlingPage(page)
    await wait()

    const answerType = await getAnswerType(newPage)
    console.info(`問題タイプ：${answerType}`)

    await clickSubmitButton(newPage)
    await wait()

    const answer: AnswerData = {
        string: "",
        strings: []
    }

    await getAnswer(newPage, answer, answerType)

    //1～100までの乱数を生成
    const rans = random(100) + 1

    if (rans <= arg.per) {
        console.info(`(1d100<=${arg.per}) > ${rans} > 成功`)
        status.correctAnswerFirstCount++
    } else {
        console.info(`(1d100<=${arg.per}) > ${rans} > 失敗`)
        console.info("初手の解答を不正解にします")
        try {
            if (answerType === "self") {
                await setAnswerForSelf(newPage, false)
                await wait()
            } else {
                await clickFinishButton(newPage)
            }
            console.info("初手の解答を終了しました")
            status.notCorrectAnswerFirstCount++
            await wait()
        } catch (error) {
            console.info(error)
        }
    }

    await newPage.close()
    await page.bringToFront()
    setControlingPage(page)
    await wait()



    if (answerType === "self") {
        try {
            await clickSubmitButton(page)
            await wait()

            await setAnswerForSelf(page, true)
            await wait()

        } catch (e) {
            console.info(e)
        }

        console.info(`設問[name:${name}]の解答を終了`)
        await clickFinishButton(page)
        await wait()
        return
    }

    await setAnswer(page, answer, answerType)

    await clickSubmitButton(page)
    await wait()

    await clickFinishButton(page)
    console.info(`設問[name:${name}]の解答を終了`)
    await wait()
}