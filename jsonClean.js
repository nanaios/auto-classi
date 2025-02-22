import fs from "fs"
import path from "path"

const configPath = path.join(process.argv[1], "../", "config.json")
const cookiePath = path.join(process.argv[1], "../", "cookie.json")

const configJson = JSON.parse(fs.readFileSync(configPath, "utf-8"))

const configKey = Object.keys(configJson)
configKey.forEach(key => {
    configJson[key] = ""
})
fs.writeFileSync(configPath, JSON.stringify(configJson))

fs.writeFileSync(cookiePath, "[]")