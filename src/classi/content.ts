import { isVideoContent } from "./video";
import { isStudyContent, solveStudyContent } from "./study";
import { defaultLog } from "@/log";
import { SolveBase } from "./SolveBase";


export class Content extends SolveBase {
    getElementSelector = "li.flow-single.student"
    getNameSelector = "a"
    type = "要素"
    async solve(): Promise<void> {
        const name = await this.getName()
        defaultLog(`要素[name:${name}]の解答を開始`)
        console.group()
        if (await isVideoContent(this.element)) {

        } else if (await isStudyContent(this.element)) {
            await solveStudyContent(this.page, this.element)
        }
        console.groupEnd()
        defaultLog(`要素[name:${name}]の解答を終了`)
    }
}