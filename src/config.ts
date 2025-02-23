import fs from "fs"
import path from "path"
import { log } from "./utilitys"

const configPath = path.join(process.argv[1], "../../", "config.json")
export const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"))

export function config(name: string, options: any) {
    if (options.clear) {
        setConfig(name, "")
        return
    }
    if (options.value) {
        setConfig(name, options.value)
    } else {
        showConfig(name)
    }
}

function showConfig(name: string) {
    log(`${name}="${configJson[name]}"`)
}

export function setConfig(name: string, value: string) {
    configJson[name] = value
    const json = JSON.stringify(configJson)
    fs.writeFileSync(configPath, json)
}