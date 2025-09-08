// The following function is used to capitalize and format the words of the provided status after evry ' ' abd '-'.
export function formatStatus(status) {
    if (!status) return '';

    return status
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalizes first letter of each word
        .replace(/(?<=-)\w/g, (char) => char.toUpperCase()); // Capitalizes letter after '-'
}
