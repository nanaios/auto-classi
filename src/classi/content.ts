import { clearQueue, isVideoContent, solveVideoContent } from "./video";
import { isStudyContent, solveStudyContent } from "./study";
import { defaultLog, detailedLog } from "@/log";
import { SolveBase } from "./SolveBase";
import { goTo } from "@/utility";

export class Content extends SolveBase {
    getElementSelector = "li.flow-single.student"
    getNameSelector = "a"
    type = "要素"
    async solve(): Promise<void> {
        const name = await this.getName()
        defaultLog(`要素[name:"${name}"]の解答を開始`)
        const baseUrl = this.page.url()
        console.group()

        //要素のタイプで分ける
        if (await isVideoContent(this.element)) {
            await solveVideoContent(this.page, this.element)
        } else if (await isStudyContent(this.element)) {
            try {
                await solveStudyContent(this.page, this.element)
            } catch (error) {
                defaultLog(`解答に失敗しました`)
                detailedLog(`問題名:[name:"${name}"]`)

                await goTo(this.page, baseUrl)
            }
        }

        console.groupEnd()
        defaultLog(`要素[name:"${name}"]の解答を終了`)

        //再生終了した動画タブを閉じる
        await clearQueue()

        //操作タブを元のページに戻す
        await this.page.bringToFront()
    }
}