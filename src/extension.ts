import * as vscode from "vscode"
import fs from "fs"
export function activate(context: vscode.ExtensionContext) {
    console.log("插件已经被激活")

    let disposable = vscode.commands.registerCommand("extension.extractCssClasses", async () => {
        const editor = vscode.window.activeTextEditor

        if (!editor || editor.document.languageId !== "typescriptreact") {
            vscode.window.showWarningMessage("请打开一个tsx的文件")
            return
        }

        const documentText = editor.document.getText()
        const classNames = extractClassNames(documentText)

        if (classNames.length === 0) {
            vscode.window.showInformationMessage("找不到类名")
            return
        }

        /** 生成less文件内容 */
        const lessContent = generateLessContent(classNames)
        /** 生成less文件名称 */
        const lessFileName = editor.document.fileName.replace(/\.tsx$/, ".module.less")

        await vscode.workspace.fs.writeFile(vscode.Uri.file(lessFileName), Buffer.from(lessContent, "utf8"))
        vscode.window.showInformationMessage(`LESS文件生成完毕: ${lessFileName}`)
    })

    context.subscriptions.push(disposable)
}

function extractClassNames(text: string): string[] {
    // const classRegex = /className="([^"]*)"/g
    const regex = /className\s*=\s*{\s*styles\.(\w+)\s*}/g // 匹配 className={styles.xxx} 的正则表达式

    const classNames: Set<string> = new Set()
    let match

    while ((match = regex.exec(text)) !== null) {
        match[1].split(" ").forEach((cls) => classNames.add(cls))
    }

    return Array.from(classNames)
}

/** 生成less文件的内容 */
function generateLessContent(classNames: string[]): string {
    return classNames.map((cls) => `.${cls} {\n  // Add styles for ${cls}\n}`).join("\n\n")
}
// This method is called when your extension is deactivated
export function deactivate() {}
