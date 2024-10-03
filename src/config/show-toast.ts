import * as vscode from "vscode"

function getShowToast() {
    const config = vscode.workspace.getConfiguration("DcdCss")
    const isShowToast: boolean = config.get("showToast") ?? true

    return isShowToast
}

export default getShowToast
