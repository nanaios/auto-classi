import type { ElementHandle } from "puppeteer";

export async function isVideoContent(content: ElementHandle<HTMLElement>) {
    const mark = await content.$("i.fa-film")
    return mark !== null
}