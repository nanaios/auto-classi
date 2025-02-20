#!/usr/bin/env node
import { main } from ".";
import { exec } from 'child_process';
import { TIMEOUT } from "./status";
import packageJson from "../package.json"

const CHROME_PATHS: { [x in NodeJS.Platform]?: string } = {
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}

async function cli() {
    switch (process.argv[2]) {
        case "run": {
            await main(packageJson.version)
            break;
        }
        case "open": {
            openChrome()
            break
        }
        case "--version": {
            console.log(`v${packageJson.version}`)
        }
        default: {
            console.error("Error:不明なコマンドです")
            break;
        }
    }
}

async function openChrome() {
    exec(`"${CHROME_PATHS[process.platform]}" --remote-debugging-port=9222`)

    setTimeout(() => {
        process.exit()
    }, TIMEOUT)
}

await cli()