export function ConvertDateToMonths(dateString) {
    const [year, month] = dateString.split("-").map(Number);
    return `${month}/${year}`;
  }