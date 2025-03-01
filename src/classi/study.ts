import { getElement, goBack, random, wait, waitForClickTransition } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import type { ElementHandle, Page } from "puppeteer";
import { getAnswer, getQuestionType, setAnswer } from "./answer/answer";
import { runCommandArgs } from "@/args";

export async function isStudyContent(content: ElementHandle<HTMLElement>) {
	const mark = await content.$("i.fa-pencil-square-o")
	return mark !== null
}

export async function solveStudyContent(page: Page, content: ElementHandle<HTMLElement>) {
	const { per } = runCommandArgs
	await waitForClickTransition(page, content)

	const type = await getQuestionType(page)
	defaultLog(`問題タイプ:${type}`)

	//一度答えを取得するために正答確認ページに行く
	await clickFinishButton(page)
	detailedLog(`正答確認ページに遷移`)

	//答えを取得
	await getAnswer(page, type)

	//1~100までの乱数を生成
	const randomPer = random(100)

	if (randomPer <= per) {
		defaultLog(`(1d100<=${per}) > ${randomPer} > 成功`)
		defaultLog("初手解答を正解にする処理を実行")
	} else {
		defaultLog(`(1d100<=${per}) > ${randomPer} > 失敗`)
		defaultLog("初手解答を不正解にする処理を実行")
		await clickFinishButton(page)
		await goBack(page)
	}

	//解答ページに戻る
	await goBack(page)
	detailedLog("解答ページに戻る")

	//答えをセットし、再び正答確認ページに行く
	await setAnswer(page, type)

	//最初のページに戻る
	await clickFinishButton(page)
}

export async function clickFinishButton(page: Page) {
	const button = await page.$("button[type=button]") ?? await getElement(page, "input[type=submit]")
	await waitForClickTransition(page, button)
}