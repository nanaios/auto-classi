#!/usr/bin/env node
import path from "path";
import { main } from ".";
import { exec, execSync } from 'child_process';

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'

async function cli() {
    switch (process.argv[2]) {
        case "run": {
            await main()
            break;
        }
        case "open": {
            openChrome()
            break
        }
        default: {
            console.error("Error:不明なコマンドです")
            break;
        }
    }
}

async function openChrome() {
    console.log("chromeを起動する")
    const cwd = path.join(import.meta.dirname, "../")
    if (is_windows) {
        execSync(path.join(cwd, "open.bat"))
    } else if (is_mac) {
        execSync(path.join(cwd, "open.sh"))
    }
    console.log("chromeを起動した")
}

await cli()