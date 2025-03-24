import puppeteer, { type Page } from "puppeteer";
import packageJson from "../../package.json"
import { Task } from "./Task";
import { login } from "./login";
import { goTo, wait } from "@/utility";
import { defaultLog, detailedLog } from "@/log";
import { runCommandArgs, setArgsForRunCommand, type RunCommandArgs } from "@/args";
import { isWithInExpirationDate, readCookies, writeCookies } from "@/cookie";
import { clearQueue, playVideoIndex } from "./video";

let BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_in_studying"
DEV: BASE_URL = "https://video.classi.jp/student/challenge_delivery_history/challenge_delivery_history_school_complete"

async function getCookie() {
	if (!runCommandArgs.nonCookieCache && isWithInExpirationDate()) {
		detailedLog(`有効なcookieキャッシュを発見しました`)
		return readCookies()
	}
	return login()
}

export async function run(args: RunCommandArgs) {
	setArgsForRunCommand(args)

	const cookies = await getCookie()
	await wait()

	writeCookies(cookies)

	const browser = await puppeteer.launch({
		headless: !args.nonHeadless,
		timeout: -1
		//slowMo: 10
	})

	await browser.setCookie(...cookies)

	const pages = await browser.pages()
	const page = pages[0]

	await deleteWebdriver(page)

	await goTo(page, BASE_URL)
	await wait()

	defaultLog(`AutoClassi v${packageJson.version}起動`)

	await new Task(page, BASE_URL).solves()
	defaultLog("全講義の探索が終了しました")
	detailedLog(`再生中の動画の数: ${playVideoIndex}`)

	while (playVideoIndex > 0) {
		await wait()
	}
	defaultLog(`全動画の再生が終了`)

	await clearQueue()

	await browser.close()

	return
}

/**
 * Webdriverの値をを削除して、bot判定を回避する
 * @param page 
 */
const deleteWebdriver = async (page: Page) => {
	detailedLog(`"webdriverを削除"`)
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'webdriver', () => { });
		//@ts-ignore
		delete navigator.__proto__.webdriver;
	});
}