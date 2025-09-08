export const formatFilters = (filters) => {
  if (!filters || Object.keys(filters).length === 0) return "";

  return Object.entries(filters)
    .filter(([key, value]) => value !== undefined && value !== "" && value !== null)
    .map(([key, value]) => {
      const friendlyKey = key?.replace(/([A-Z])/g, " $1")?.trim();
      return `${friendlyKey} (${value})`;
    })
    .join(", ");
};
