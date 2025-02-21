import { wait, waitForTransition } from "@/utilitys";
import type { Page } from "puppeteer-core";
import { clickStartAssignmentButton, clickLeftButton } from "./clickButton";
import { getLectures, getLectureName, solveLectures } from "./lecture";
async function getAssignmentName(page: Page) {
    return await page.$eval("dd.task-user-name", element => element.innerText)
}

const finishedAssignmentNames: string[] = []

export async function* getAssignments(page: Page) {
    const assignments = await page.$$(".task-list > a")
    console.log(`合計課題数:${assignments.length}`)
    for (let i = 0; i < assignments.length; i++) {
        const assignments = await page.$$(".task-list > a")
        let k: number
        for (k = 0; k < assignments.length; k++) {
            const name = await assignments[k].$eval("p.subject", element => element.innerText)
            if (!finishedAssignmentNames.includes(name)) {
                console.log(`課題名:${name}`)
                finishedAssignmentNames.push(name)
                break
            }
        }
        yield assignments[k]
    }
}


export async function solveAssignment(page: Page) {
    const assignmentName = await getAssignmentName(page)
    console.log(`\n課題[name:${assignmentName}]の解答を開始\n`)

    await clickStartAssignmentButton(page)
    await wait()

    for await (const lecture of getLectures(page)) {
        const lectureName = await getLectureName(lecture);
        console.log(`\n講義[name:${lectureName}]の解答を開始\n`);

        await waitForTransition(page, lecture);
        await wait();

        await solveLectures(page);
        await wait();

        await clickLeftButton(page);
        console.log(`\n講義[name:${lectureName}]の解答を終了\n`);
        await wait();
    }
    await clickLeftButton(page)
    console.log(`\n課題[name:${assignmentName}]の解答を終了\n`)
    await wait()
}