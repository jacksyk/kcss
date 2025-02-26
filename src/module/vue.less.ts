import * as vscode from "vscode"
import getShowToast from "../config/show-toast"
import { parser } from "posthtml-parser"

type NodeType = {
    tag: string
    attrs: Record<string, string>
    content: NodeType[]
} | string

// 不保持递归关系的收集，深度优先遍历
const collectClassNames = (ast: any) => {
    const classNames = new Set()
    const dfs = (nodeList: NodeType[]) => {
        if (typeof nodeList === 'string') {
            return
        }
        for (let i = 0; i < nodeList.length; i++) {
            if (typeof nodeList[i] === 'string') {
                continue
            }

            const node = nodeList[i] as {
                tag: string
                attrs: Record<string, string>
                content: NodeType[]
            }

            if (node.attrs && node.attrs.class) {
                classNames.add(node.attrs.class)
            }

            if (node.content) {
                dfs(node.content)
            }
        }
    }

    dfs(ast)

    return classNames
}



/** vue */
export const extractVue = async () => {
    const editor = vscode.window.activeTextEditor
    const isShowToast = getShowToast()

    if (editor) {
        const documentText = editor.document.getText()
        /** 获取vue文件的template内容 */
        const templateContent = documentText.match(/<template>([\s\S]*?)<\/template>/)?.[1] ?? ''
        const trimTemplateContent = templateContent.trim()
        const templateAst = parser(trimTemplateContent)
        console.log(templateAst)
        /** 获取templateAst所有标签中的class */
        const classNames = collectClassNames(templateAst)
        // 获取当前文件全部内容
        const fullText = editor.document.getText();
        // console.log(classNames)
        let lessContent = ''
        Array.from(classNames).forEach((className) => {
            lessContent += `.${className} {}\n`
        })
        const styleContent = `\n\n<style>\n${lessContent}\n</style>`;
        const updatedText = fullText + styleContent;

        // 执行编辑操作
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                editor.document.positionAt(0),
                editor.document.positionAt(fullText.length)
            );
            editBuilder.replace(fullRange, updatedText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Style标签已添加到文件末尾');
            } else {
                vscode.window.showErrorMessage('添加Style标签失败');
            }
        });
    }
}