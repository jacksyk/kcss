import * as vscode from "vscode"
import extractClassNames from "../util/extract-class-name"
import generateLessContent from "../util/generate-less-content"
import extractImportName from "../util/extract-import-name"
import getShowToast from "../config/show-toast"
import { toast } from "../util/toast"
import fs from "fs-extra"

/** typescriptreact */
export const extractReact = async () => {
    const editor = vscode.window.activeTextEditor
    const isShowToast = getShowToast()

    if (editor) {
        const documentText = editor.document.getText()
        /** 获取当前引用的css module名称 */
        const [moduleName, suffix] = extractImportName(documentText)
        const selection = editor.selection
        const selectedText = editor.document.getText(selection) // 获取当前选中的文本
        console.log('suffix', suffix)

        if (!moduleName) {
            toast("当前文件没有找到css module文件的代码🥲🥲🥲")
            return
        }
        /** 如果选择了内容，则生成内容那部分，没有选择内容的话，则默认全部生成 */
        let classNames: string[] = []
        if (selectedText.length === 0) {
            classNames = extractClassNames(documentText, moduleName, suffix)
        } else {
            classNames = extractClassNames(selectedText, moduleName, suffix)
        }

        if (classNames.length === 0) {
            if (isShowToast) {
                vscode.window.showInformationMessage("less文件中已经存在类名、无需生成😺😺")
            }
            return
        }



        /** 生成less文件内容 */
        const lessContent = generateLessContent(classNames)
        /** 生成less文件名称 */
        const lessFileName = editor.document.fileName.replace(/\.tsx$/, suffix)

        // await vscode.workspace.fs.writeFile(vscode.Uri.file(lessFileName), Buffer.from(lessContent, "utf8"))
        await fs.writeFile(lessFileName, lessContent, {
            encoding: "utf8",
            flag: "a", // 文件追加
        })

        if (isShowToast) {
            vscode.window.showInformationMessage(`LESS文件更新完毕🎊🎊🎊`)
        }
    }
}