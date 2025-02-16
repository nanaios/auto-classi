import type { Page } from "puppeteer";
import { getAnswerForInput, isInput, setAnswerForInput } from "./answerForInput";
import { getAnswerForListSelection, isListSelection, setAnswerForList } from "./answerForListSelection";
import { getAnswerForMultiInput, isMultiInput, setAnswerForMultiInput } from "./answerForMultiInput";
import { getAnswerForSelection, isSelection, setAnswerForSelection } from "./answerForSelection";
import { isSelf } from "./answerForSelf";
import { wait } from "./utility";

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
                data.string = await getAnswerForSelection(page)
                break;
            }
        }
    } catch (error) {
        console.log(error)
    }
    await wait()
}

export async function setAnswer(page: Page, data: AnswerData, type: AnswerType | undefined) {
    console.log("答えをセットします")
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
                await setAnswerForSelection(page, data.string)
                break;
            }
        }
    } catch (error) {
        console.log(error)
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
