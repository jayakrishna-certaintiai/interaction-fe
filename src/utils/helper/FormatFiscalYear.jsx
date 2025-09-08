export function formatFyscalYear(year) {
    return (`FY ${+(year) - 1}-${year?.toString()?.slice(-2)}`)
}