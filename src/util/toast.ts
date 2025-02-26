import vscode from 'vscode'

export const toast = (str: string)=>{
    vscode.window.showWarningMessage(str)
}