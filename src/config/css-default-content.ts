import * as vscode from "vscode"

function getCssDefaultContent() {
    const config = vscode.workspace.getConfiguration("DcdCss")
    const cssDefaultContent: Record<string, string> = config.get("cssDefaultContent") ?? {}
    let content = ""
    content = Object.entries(cssDefaultContent).reduce((acc, prev) => {
        const [key, value] = prev
        acc += `${key}:${value};\n`
        return acc
    }, "")
    return content
}

export default getCssDefaultContent
