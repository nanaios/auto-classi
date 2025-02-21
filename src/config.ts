import { optionArgs } from "@/classi"
import fs from "fs"
import path from "path"

const configPath = path.join(process.argv[1], "../../", "config.json")
export const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"))

const CONFIG_NAMES = ["win32-chrome-path", "darwin-chrome-path"]

export function config() {
    CONFIG_NAMES.forEach(name => {
        optionArgs.forEach(arg => {
            if (arg.includes(name)) {
                const value = arg.split("=")[1]
                if (typeof value === "string") {
                    setConfig(name, value)
                } else {
                    showConfig(name)
                }
            }
        })
    })
}

function showConfig(name: string) {
    console.log(`${name}="${configJson[name]}"`)
}

function setConfig(name: string, value: string) {
    configJson[name] = value
    const json = JSON.stringify(configJson)
    fs.writeFileSync(configPath, json)
}