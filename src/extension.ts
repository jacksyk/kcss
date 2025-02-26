import * as vscode from "vscode"
import getShowToast from "./config/show-toast"
import { toast } from "./util/toast"
import { extractReact, extractVue } from "./module"
import verifyCss from "./util/verify-css"
import fs from "fs-extra"
export function activate(context: vscode.ExtensionContext) {
    console.log("插件已经被激活!")

    // 生成less文件能力
    let disposable = vscode.commands.registerCommand("extension.extractCssClasses", async () => {
        const editor = vscode.window.activeTextEditor
        console.log(editor?.document.languageId)
    
        const isVueFile = editor?.document.languageId === "vue"
        const isReactFile = editor?.document.languageId === "typescriptreact"
        const isPass = isReactFile || isVueFile

        if (!editor || !isPass) {
            toast("请打开一个tsx或者vue的文件,目前只支持Vue、React👌👌👌")
            return
        }

        if (isReactFile) {
            await extractReact()
            return
        }

        if (isVueFile) {
            await extractVue()
            return
        }
    })

    // 校验less文件能力
    let disposable1 = vscode.commands.registerCommand("extension.verifyCss", async () => {
        const editor = vscode.window.activeTextEditor
        const isShowToast = getShowToast()

        if (!editor || editor.document.languageId !== "less") {
            toast("请打开一个less的文件,目前只支持less文件👌👌👌")
            return
        }
        const documentText = editor.document.getText()
        let content = verifyCss(documentText)
        fs.writeFileSync(editor.document.fileName, content)

        if (isShowToast) {
            vscode.window.showInformationMessage(`LESS文件校验完毕🎊🎊🎊`)
            return
        }
    })

    context.subscriptions.push(disposable)
    context.subscriptions.push(disposable1)
}

export function deactivate() {}
