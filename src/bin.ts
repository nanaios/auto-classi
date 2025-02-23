#!/usr/bin/env -S node --enable-source-maps

import puppeteer from "puppeteer";
import { getTaskName, getTasks } from "./classi/task";

const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222'
});

const pages = await browser.pages()
const page = pages[0]

for await (const task of getTasks(page)) {
    const name = await getTaskName(task)
    console.log(`課題名:${name}`)
}