export const wrapText = (text) => {
  const words = text.split(" ");
  const wrappedText = [];
  for (let i = 0; i < words.length; i += 12) {
    wrappedText.push(words.slice(i, i + 12).join(" "));
    if (i + 12 < words.length) wrappedText.push(<br key={i} />);
  }
  return wrappedText;
};
