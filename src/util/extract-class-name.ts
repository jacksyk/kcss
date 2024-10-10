import fs from "fs"
import { ensureFileSync } from "fs-extra"
import path from "path"
import * as vscode from "vscode"
/** 匹配文本中的类名 */
// /className\s*=\s*{\s*styles\.(\w+)\s*}/g
// /classNames*=s*{s*styles.(w+)s*}/g
// /className\s*=\s*{\s*styles\.(\w+)\s*}/g // 注意双重转义字符
function extractClassNames(text: string, token: string = "styles"): string[] {
    let str = `className\\s*=\\s*{\\s*${token}\\.(\\w+)\\s*}` // 匹配 className={styles.xxx} 的正则表达式
    let regex: RegExp = new RegExp(str, "g")
    // 读取less文件内容
    let lessFileContent: string = ""
    const currentlySelectedFilePath = vscode.window.activeTextEditor?.document.fileName ?? "" // 目前选中的文件路径
    const curPath = currentlySelectedFilePath.replace(/\.tsx$/, ".module.less") // 当前目录同级less文件的路径

    console.log("curPath", curPath)
    // ensureFileSync(curPath) // todo： 保证这块一定有文件
    try {
        lessFileContent = fs.readFileSync(curPath, "utf8") // 读取less文件内容
    } catch (err) {
        // 没有目录
        console.log("err", err)
    }

    const classNames: Set<string> = new Set()
    let match

    // console.log("lessFileContent", lessFileContent, text)
    while ((match = regex.exec(text)) !== null) {
        match[1].split(" ").forEach((cls) => {
            /** 去重逻辑 */
            if (lessFileContent.indexOf(cls) === -1) {
                classNames.add(cls)
            }
        })
    }

    return Array.from(classNames)
}
export default extractClassNames
