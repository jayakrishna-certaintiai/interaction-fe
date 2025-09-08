export const DiffBwDays = (dates) => {
  const dateObjects = dates
    ?.filter((dateString) => dateString) 
    .map((dateString) => new Date(dateString));

  if (!dateObjects || dateObjects.length === 0) {
    console.error("Invalid or empty date array");
    return [];
  }

  // Find the minimum date
  const minDate = new Date(Math.min(...dateObjects));
  // minDate.setDate(minDate.getDate() - 7);

  // Calculate the differences against the minimum date
  const differences = dateObjects.map(
    (date) => (date - minDate) / (1000 * 60 * 60 * 24)
  ); // in days


  return differences;
};

export function createObjectFromArray(arr1, arr2) {
  const obj = {};
  for (let i = 0; i < arr1?.length && i < arr2?.length; i++) {
    obj[arr1[i]] = arr2[i];
  }
  return obj;
}
