const lenientJsonParse = (json: string): any => {
  // Add double quotes around property names only if they don't have them
  const quotedPropertyJson = json.replace(/(\s*{?\s*)(?<!")(\w+)(?!")(\s*:)/g, '$1"$2"$4');

  // Remove trailing commas before closing braces or brackets
  const cleanedJson = quotedPropertyJson.replace(/,\s*(}|])/g, '$1');
  
  // Add missing closing double quotes in property values
  const missingClosingQuoteJson = cleanedJson.replace(/:"([^"]*)[^"]([^"]{0,1}[,|\n|\]|\}])/g, ':"$1"$2');

  return JSON.parse(missingClosingQuoteJson);
};

export default lenientJsonParse;