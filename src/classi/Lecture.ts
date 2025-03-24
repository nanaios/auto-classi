import { getElement, waitForClickTransition } from "@/utility";
import { Content } from "./Content";
import { defaultLog } from "@/log";
import { SolveBase } from "./SolveBase";

export class Lecture extends SolveBase {
	getElementSelector = ".task-list > a"
	getNameSelector = "span.lecture_name"
	type = "講義"
	async solve(): Promise<void> {
		const name = await this.getName()
		defaultLog(`講義[name:"${name}"]の解答を開始`)
		console.group()

		//講義の解答を開始
		await waitForClickTransition(this.page, this.element)

		await new Content(this.page).solves()

		console.groupEnd()
		const leftButton = await getElement(this.page, "a.white-btn")
		await waitForClickTransition(this.page, leftButton)
		defaultLog(`講義[name:"${name}"]の解答を終了`)
	}
}