import puppeteer, { type Page } from "puppeteer"
import { getStudyProgramList, isStudyPrograms, wait, getStudyProgramName, getTaskName, copyPage, random, argToNumber } from "./utility"
import { setAnswerForSelf } from "./answerForSelf";
import { clickFinishButton, clickTask, clickLeftButton, clickStudyProgram, clickSubmitButton } from "./clickButton";
import { getAnswer, getAnswerType, setAnswer, type AnswerData } from "./answer";


const RANDOM_PER = argToNumber(0) ?? 100
console.log(`推定初手正解率:${RANDOM_PER}`)

let questionCount = 0
let correctAnswerFirstCount = 0
let notCorrectAnswerFirstCount = 0

async function main() {
    const browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222'
    });



    const pageList = await browser.pages();

    const page = pageList[0];
    await page.bringToFront();

    console.log("autoClassiを起動しました")

    console.log(`${(await page.title())}に接続しました`)
    await wait()
    await runTasks(page)

    console.log(`解答した問題数:${questionCount}`)
    console.log(`初手正解率:${correctAnswerFirstCount / questionCount}`)
    console.log(`初手不正解率:${notCorrectAnswerFirstCount / questionCount}`)


    console.log("autoClassiを終了します")
    process.exit(0)
}

async function runTasks(page: Page) {
    const tasksLength = (await page.$$(".task-list > a")).length

    console.log(`合計講義数：${tasksLength}個`)

    for (let i = 0; i < tasksLength; i++) {
        const tasks = await page.$$(".task-list > a")
        const taskName = await getTaskName(tasks[i])
        console.log(`\n講義[name:${taskName}]の処理を開始`)

        await clickTask(page, tasks[i])
        await wait()

        await runClassi(page)
        await wait()

        await clickLeftButton(page)
        console.log(`\n講義[name:${taskName}]の処理を終了`)
        await wait()
    }
}

async function runClassi(page: Page) {
    const listLength = (await getStudyProgramList(page)).length

    for (let i = 0; i < listLength; i++) {
        const list = await getStudyProgramList(page)
        if (await isStudyPrograms(list[i])) {

            const name = await getStudyProgramName(list[i])
            console.log(`\n設問[name:${name}]の解答を開始`)
            questionCount++

            await clickStudyProgram(page, i)
            await wait()

            const newPage = await copyPage(page)
            await wait()

            const answerType = await getAnswerType(newPage)
            console.log(`問題タイプ：${answerType}`)

            await clickSubmitButton(newPage)
            await wait()

            const answer: AnswerData = {
                string: "",
                strings: []
            }

            await getAnswer(newPage, answer, answerType)

            //1～100までの乱数を生成
            const rans = random(100) + 1

            if (rans <= RANDOM_PER) {
                console.log(`(1d100<=${RANDOM_PER}) > ${rans} > 成功`)
                correctAnswerFirstCount++
            } else {
                console.log(`(1d100<=${RANDOM_PER}) > ${rans} > 失敗`)
                console.log("初手の解答を不正解にします")
                try {
                    if (answerType === "self") {
                        await setAnswerForSelf(newPage, false)
                        await wait()
                    } else {
                        await clickFinishButton(newPage)
                    }
                    console.log("初手の解答を終了しました")
                    notCorrectAnswerFirstCount++
                    await wait()
                } catch (error) {
                    console.log(error)
                }
            }

            await newPage.close()
            await wait()



            if (answerType === "self") {
                await clickSubmitButton(page)
                await wait()

                await setAnswerForSelf(page, true)
                console.log(`設問[name:${name}]の解答を終了`)
                await wait()
                continue
            }

            await setAnswer(page, answer, answerType)

            await clickSubmitButton(page)
            await wait()

            await clickFinishButton(page)
            console.log(`設問[name:${name}]の解答を終了`)
            await wait()
        }
    }
}




await main()