export function parsePinnedString(pinnedString) {
  const pinnedArray = pinnedString?.split("|");
  const pinnedObject = {};

  pinnedArray?.forEach((item) => {
    const [key, value] = item?.split(":");
    pinnedObject[key?.trim()] = value?.trim();
  });

  return pinnedObject;
}

export const getPinString = (newPinnedObject) =>{
  const result = Object.entries(newPinnedObject)
  .map(([key, value]) => `${key}:${value}`)
  .join("|")

  return result;
}
 
