import type { Page } from "puppeteer";
import { getCheckBoxAnswer, isCheckBox, setCheckBoxAnswer } from "./checkBox";
import { getInputAnswer, isInput, setInputAnswer } from "./input";
import { getListAnswer, isList, setListAnswer } from "./list";
import { wait } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import { clickFinishButton } from "../study";
import { setSelfAnswer } from "./self";

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
	}
	await wait(100)
}

export async function setAnswer(page: Page, type: QuestionType) {
	detailedLog(`${type}形式の答えをセット`)
	switch (type) {
		case "list": {
			await setListAnswer(page)
			break;
		}
		case "input": {
			await setInputAnswer(page)
			break
		}
		case "checkBox": {
			await setCheckBoxAnswer(page)
			break
		}
	}
	await clickFinishButton(page)

	if (type === "self") {
		await setSelfAnswer(page, true)
		defaultLog(`解答に成功しました`)
	} else {
		if (await isCollect(page)) {
			defaultLog(`解答に成功しました`)
		} else {
			throw new Error("解答に失敗しました")
		}
	}
}

export async function isCollect(page: Page) {
	const mark = await page.$(".answer-correct")
	return mark !== null
}