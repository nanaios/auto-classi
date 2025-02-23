#!/usr/bin/env -S node --enable-source-maps

import puppeteer from "puppeteer";
import { solveTasks } from "./classi/task";

const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222'
});

const pages = await browser.pages()
const page = pages[0]

const BASE_URL = page.url()

console.log("AutoClassi起動")
await solveTasks(page, BASE_URL)