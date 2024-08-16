export default function controlLineWidth(text: string, lineLength: number) {
  let result = "";
  if (text.length > lineLength) {
    const splitetText = text.split(" ");
    if (splitetText[0].length > lineLength) {
      // console.log(splitetText[0].slice(0, lineLength - 2) + " ...");
      return `${splitetText[0].slice(0, lineLength - 2)} ...`;
    }
    for (const element of splitetText) {
      if (result.length + element.length < lineLength) {
        result += `${element} `;
      } else {
        // result += " ...";
        result += "...";
        break;
      }
    }
  } else {
    result = text;
  }
  return result;
}
