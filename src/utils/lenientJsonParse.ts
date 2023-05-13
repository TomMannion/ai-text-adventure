const lenientJsonParse = (json: string): any => {
  // Remove newlines and backslashes
  const removedJson = json
    .replace(/\\n/g, '')
    .replace(/\\/g, '');

  // Add double quotes around property names only if they don't have them
  const quotedPropertyJson = removedJson.replace(/(\s*{?\s*)(?<!")(\w+)(?!")(\s*:)/g, '$1"$2"$4');

  // Remove trailing commas before closing braces or brackets
  const cleanedJson = quotedPropertyJson.replace(/,\s*(}|])/g, '$1');

  // Add missing closing double quotes in property values
  const missingClosingQuoteJson = cleanedJson.replace(/:"([^"]*)[^"]([^"]{0,1}[,|\]|\}])/g, ':"$1"$2');

  // Replace single quotes with double quotes within property values
  const doubleQuotedJson = missingClosingQuoteJson.replace(/:('[^']*')/g, (match, p1) => `:"${p1.slice(1, -1).replace(/"/g, '\\"')}"`);

  // Escape unescaped double quotes within property values
  const escapedDoubleQuotesJson = doubleQuotedJson.replace(/:("[^"]*")/g, (match, p1) => {
    const escapedValue = p1.slice(1, -1).split('').reduce((acc: string, char: string, idx: number, arr: string[]) => {
      if (char === '"' && (idx === 0 || arr[idx - 1] !== '\\')) {
        return acc + '\\"';
      }
      return acc + char;
    }, '');
    return `:"${escapedValue}"`;
  });

  return JSON.parse(escapedDoubleQuotesJson);
};

export default lenientJsonParse;