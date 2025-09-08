export const areFiltersApplied = (filters) => {
  return Object?.values(filters)?.some(
    (value) => value !== undefined && value !== ""
  );
};
