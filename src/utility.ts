import { ElementHandle, Page } from "puppeteer";

let isDev = false
DEV: isDev = true
export { isDev }

/**
 * 1~maxの範囲の乱数を返す  
 * @param max 整数にしないとバグの元になる可能性がある
 */
export const random = (max: number) => Math.floor(Math.random() * max) + 1;

export function getCaller() {
	const trace = new Error().stack
	if (trace) {
		const callerLine = trace.split("\n")[3]
		const callerData = callerLine.slice(callerLine.indexOf("at ") + 3)
		return callerData.split(" (")[0]
	}
}

export async function goTo(page: Page, url: string) {
	await page.goto(url, { waitUntil: ['load', 'networkidle0', 'domcontentloaded'], timeout: -1 })
	await wait()
}

export async function getElement<S extends string>(parent: Page | ElementHandle<Element>, selector: S) {
	const element = await parent.$(selector)
	if (!element) throw new Error(`セレクター[${selector}]にマッチする要素がありません`);
	return element
}

export async function waitForClickTransition(page: Page, element: ElementHandle<HTMLElement>) {
	await Promise.all([
		element.click(),
		page.waitForNavigation({ waitUntil: ['load', 'networkidle0', 'domcontentloaded'] })
	])
	await wait()
}

export async function wait(ms: number = 500) {
	return new Promise<void>(res => {
		const id = setTimeout(() => {
			clearTimeout(id)
			res()
		}, ms)
	})
}

export async function isSolved(element: ElementHandle<HTMLElement>) {
	DEV: return false;
	const mark = await element.$(".check-mark")
	return mark !== null
}

export async function goBack(page: Page) {
	await page.goBack({ waitUntil: ['load', 'networkidle0', 'domcontentloaded'] })
	await wait()
}