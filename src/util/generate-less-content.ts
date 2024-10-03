/** 生成less文件的内容 */
function generateLessContent(classNames: string[]): string {
    return "\n" + classNames.map((cls) => `.${cls} {\n    \n}`).join("\n\n")
}

export default generateLessContent
