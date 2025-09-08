export function formatCurrency(amount, locale, currency) {
    // Create a new Intl.NumberFormat instance
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });

    // Format the amount
    let formattedAmount = formatter.format(amount);

    // Remove only alphabetic characters from the formatted string
    formattedAmount = formattedAmount.replace(/[a-zA-Z]/g, '').trim();

    return formattedAmount;
  }