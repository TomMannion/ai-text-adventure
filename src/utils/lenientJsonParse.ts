const lenientJsonParse = (json: string, error: string): any => {
  let fixedJson = json;

  // Remove newlines and backslashes
  fixedJson = fixedJson
    .replace(/\\n/g, '')
    .replace(/\\/g, '');

  if (error.includes("Expected double-quoted property name")) {
    // Add double quotes around property names only if they don't have them
    fixedJson = fixedJson.replace(/(\s*{?\s*)(?<!")(\w+)(?!")(\s*:)/g, '$1"$2"$4');
  }

  // Add other fixes based on the error message here

  try {
    return JSON.parse(fixedJson);
  } catch (e) {
    const castedError = e as Error;
    console.error('Error parsing JSON with lenientJsonParse:', castedError);
    return { error: castedError.message };
  }
};

export default lenientJsonParse;