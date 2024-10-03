import * as vscode from "vscode"
import extractClassNames from "./util/extract-class-name"
import generateLessContent from "./util/generate-less-content"
import extractImportName from "./util/extract-import-name"
import fs from "fs-extra"
export function activate(context: vscode.ExtensionContext) {
    console.log("插件已经被激活")

    let disposable = vscode.commands.registerCommand("extension.extractCssClasses", async () => {
        const editor = vscode.window.activeTextEditor

        if (!editor || editor.document.languageId !== "typescriptreact") {
            vscode.window.showWarningMessage("请打开一个tsx的文件,目前只支持tsx文件👌👌👌")
            return
        }

        const documentText = editor.document.getText()

        /** 获取当前引用的css module名称 */
        const moduleName = extractImportName(documentText)
        const selection = editor.selection
        const selectedText = editor.document.getText(selection) // 获取当前选中的文本

        /** 如果选择了内容，则生成内容那部分，没有选择内容的话，则默认全部生成 */
        let classNames: string[] = []
        if (selectedText.length === 0) {
            classNames = extractClassNames(documentText, moduleName)
        } else {
            classNames = extractClassNames(selectedText, moduleName)
        }

        if (classNames.length === 0) {
            vscode.window.showInformationMessage("类名存在、暂无变动😺😺😺")
            return
        }

        /** 生成less文件内容 */
        const lessContent = generateLessContent(classNames)
        /** 生成less文件名称 */
        const lessFileName = editor.document.fileName.replace(/\.tsx$/, ".module.less")

        // await vscode.workspace.fs.writeFile(vscode.Uri.file(lessFileName), Buffer.from(lessContent, "utf8"))
        await fs.writeFile(lessFileName, lessContent, {
            encoding: "utf8",
            flag: "a", // 文件追加
        })

        vscode.window.showInformationMessage(`LESS文件更新完毕🎊🎊🎊`)
    })

    context.subscriptions.push(disposable)
}

export function deactivate() {}
