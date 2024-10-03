/** 识别import css的语句 */
function extractImportName(text: string): string {
    const importRegex = /import\s+(\w+)\s+from\s+['"`](.+?\.module\.less)['"`]/g
    const match = importRegex.exec(text)
    console.log("match", match?.[1])
    if (match) {
        return match[1]
    }
    return ""
}

export default extractImportName
