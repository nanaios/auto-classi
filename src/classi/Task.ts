import type { Page } from "puppeteer";
import { getElement, goTo, wait, waitForClickTransition } from "../utility";
import { defaultLog } from "@/log";
import { Lecture } from "./Lecture";
import { SolveBase } from "./SolveBase";

export class Task extends SolveBase {
	getElementSelector = ".task-list > a"
	getNameSelector = "p.subject"
	type = "課題"
	url: string

	constructor(page: Page, url: string) {
		super(page)
		this.url = url
	}

	async solve(): Promise<void> {
		const name = await this.getName()

		/* if (isSkip || name === "2年1回スタディーサポート英語_事前学習") {
			isSkip = true
			return
		}; */

		defaultLog(`課題[name:"${name}"]の解答を開始`)
		console.group()

		//課題の詳細ページへ遷移
		await waitForClickTransition(this.page, this.element)

		//"課題に取り組む"ボタンを押す
		const startTaskButton = await getElement(this.page, ".right > a.navy-btn")
		await waitForClickTransition(this.page, startTaskButton)

		await new Lecture(this.page).solves()

		console.groupEnd()
		defaultLog(`課題[name:"${name}"]の解答を終了`)

		//元のページへ戻る
		await goTo(this.page, this.url)
		await wait()
	}
}