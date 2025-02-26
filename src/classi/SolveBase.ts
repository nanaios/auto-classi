import { defaultLog } from "@/log"
import type { ElementHandle, Page } from "puppeteer"

export abstract class SolveBase {
    element: ElementHandle<HTMLElement>
    /**必ずHTMLElementを取れる形のセレクターにする */
    getNameSelector: string
    /**必ずHTMLElementを取れる形のセレクターにする */
    getElementSelector: string
    page: Page
    type: string
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
        const element = await this.page.$$(this.getElementSelector)
        defaultLog(`合計${this.type}数:${element.length}`)
        let i: number
        for (i = 0; i < element.length; i++) {
            const contents = await this.page.$$(this.getElementSelector)
            yield contents[i] as ElementHandle<HTMLElement>
        }
    }
}