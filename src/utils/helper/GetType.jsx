export const getType = (file) => {
  const type = file?.split(".")?.[1];
  return type;
};
