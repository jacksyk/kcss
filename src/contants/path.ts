import * as vscode from "vscode"

export const currentlySelectedFilePath = vscode.window.activeTextEditor?.document.fileName ?? "" // 目前选中的文件路径
export const curPath = currentlySelectedFilePath.replace(/\.tsx$/, ".module.less") // 当前目录同级less文件的路径
