import { defaultLog, detailedLog } from "@/log"
import { isSolved } from "@/utility"
import type { ElementHandle, Page } from "puppeteer"

export abstract class SolveBase {
	element: ElementHandle<HTMLElement>
	/**必ずHTMLElementを取れる形のセレクターにする */
	getNameSelector: string
	/**必ずHTMLElementを取れる形のセレクターにする */
	getElementSelector: string
	page: Page
	type: string
	solvedNames: string[] = []
	constructor(page: Page) {
		this.page = page
	}

	async solves() {
		for await (const element of this.getElements()) {
			this.element = element
			await this.solve()
		}
	}

	async solve() {
	}

	async getName() {
		return this.element.$eval(this.getNameSelector, (a: unknown) => (a as HTMLElement).innerText)
	}

	async *getElements() {
		//最初に取得するための変数
		const preElement = await this.page.$$(this.getElementSelector)
		defaultLog(`合計${this.type}数:${preElement.length}`)

		let i: number, k: number
		for (i = 0; i < preElement.length; i++) {

			detailedLog(`${i + 1}/${preElement.length} 回目の探索を開始`)

			//ページの更新でelementsの参照が失われるので、ループの度に変数をセットしなおす
			const elements = await this.page.$$(this.getElementSelector) as ElementHandle<HTMLElement>[]

			detailedLog(`${elements.length} 件の${this.type}を取得`)

			//ループの時点で存在するelement分ループを回す
			//万が一問題を解き損ねた物があった場合に備えて、一度処理したelementは飛ばすようにする
			SEARCH: for (k = 0; k < elements.length; k++) {
				this.element = elements[k]
				const name = await this.getName()
				detailedLog(`${this.type}の名前:"${name}"`)
				if (this.solvedNames.includes(name)) {
					detailedLog(`${this.type}[ name: "${name}" ]は処理済みなのでスキップします`)
					continue
				} else if (await isSolved(elements[k])) {
					detailedLog(`${this.type}[ name: "${name}" ]はすでに処理済みなのでスキップします`)
					continue
				} else {
					detailedLog(`未処理の${this.type}[ name: "${name}" ]を発見しました`)
					this.solvedNames.push(name)
					yield elements[k]
					break SEARCH
				}
			}
		}
	}
}