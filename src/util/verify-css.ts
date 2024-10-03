/** 校验less文件能力 */
function verifyCss(input: string) {
    return input.replace(/var\(\s*---([\w-]+)\s*,\s*/g, (match, p1) => {
        // 将 ---bg_2 转换为 --bg-2
        const convertedName = `--${p1.replace(/_/g, "-")}`
        return `var(${convertedName}, `
    })
}
export default verifyCss
