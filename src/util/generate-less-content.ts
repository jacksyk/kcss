import getCssDefaultContent from "../config/css-default-content"

/** 生成less文件的内容 */
function generateLessContent(classNames: string[]): string {
    const content = getCssDefaultContent()
    return "\n" + classNames.map((cls) => `.${cls} {\n ${content} \n}`).join("\n\n")
}

export default generateLessContent
