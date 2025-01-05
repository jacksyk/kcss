/** 识别import css的语句 */
function extractImportName(text: string): Array<string> {
    // 如果没有匹配到module.less，则尝试匹配普通的less文件
    const importRegex = /import\s+(\w+)\s+from\s+['"`].+?(?:\.module\.less|\.less)['"`]/g

    const match = importRegex.exec(text)

    // 匹配引入的文件名
    const fileRegex = /import\s+(\w+)\s+from\s+['"`](.+?(?:\.module\.less|\.less))['"`]/g
    const fileMatch = fileRegex.exec(text)

    const lastSlashIndex = fileMatch?.[2].lastIndexOf("/") // 获取最后一个斜杠的索引
    const afterSlashStr = fileMatch?.[2].slice(lastSlashIndex) // 获取最后一个斜杠后面的字符串
    const afterSlashStrArr = afterSlashStr?.split(".")
    afterSlashStrArr?.shift()
    const suffix = afterSlashStrArr?.join(".")

    if (match && suffix) {
        return [match[1], `.${suffix}`]
    }
    return ["",""]
}

export default extractImportName
