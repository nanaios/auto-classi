import type { Page } from "puppeteer";
import { isCheckBox } from "./checkBox";
import { isInput } from "./input";
import { isList } from "./list";

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
