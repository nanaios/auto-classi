import type { Page } from "puppeteer";
import { getCheckBoxAnswer, isCheckBox } from "./checkBox";
import { getInputAnswer, isInput } from "./input";
import { getListAnswer, isList } from "./list";
import { detailedLog } from "@/utility";

type QuestionType = "list" | "input" | "checkBox" | "self"

export async function getQuestionType(page: Page): Promise<QuestionType> {
    if (await isCheckBox(page)) return "checkBox"
    if (await isInput(page)) return "input"
    if (await isList(page)) return "list"
    return "self"
}

export function formatAnswer(answer: string) {
    return answer.replace(/\t/g, "").replace(/\n/g, "").split("(")[0]
}

export async function getAnswer(page: Page, type: QuestionType) {
    detailedLog(`${type}形式の答えを取得`)
    switch (type) {
        case "list": {
            await getListAnswer(page)
            break;
        }
        case "input": {
            await getInputAnswer(page)
            break
        }
        case "checkBox": {
            await getCheckBoxAnswer(page)
            break
        }
        case "self": {
            break
        }
    }
}