const lenientJsonParse = (json: string): any => {
  // Add double quotes around property names only if they don't have them
  const quotedPropertyJson = json.replace(/(\s*{?\s*)(?<!")(\w+)(?!")(\s*:)/g, '$1"$2"$4');

  // Remove trailing commas before closing braces or brackets
  const cleanedJson = quotedPropertyJson.replace(/,\s*(}|])/g, '$1');

  return JSON.parse(cleanedJson);
};

export default lenientJsonParse;