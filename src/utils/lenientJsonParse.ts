const lenientJsonParse = (json: string): any => {
  let fixedJson = json;

  // Add double quotes around property names only if they don't have them
  fixedJson = fixedJson.replace(/(\s*{?\s*)(?<!")(\w+)(?!")(\s*:)/g, '$1"$2"$3');

  // Remove trailing commas before closing braces or brackets
  fixedJson = fixedJson.replace(/,\s*(}|])/g, '$1');

  // Ensuring that every opening bracket ({ or [) has a corresponding closing bracket (} or ])
  const curlyBrackets = Array.from(fixedJson.matchAll(/[{}]/g)).map(m => m[0]);
  const squareBrackets = Array.from(fixedJson.matchAll(/[\[\]]/g)).map(m => m[0]);
  

  if (curlyBrackets.filter(x => x === '{').length !== curlyBrackets.filter(x => x === '}').length
      || squareBrackets.filter(x => x === '[').length !== squareBrackets.filter(x => x === ']').length) {
    console.error('Unbalanced brackets in JSON');
    return { error: 'Unbalanced brackets in JSON' };
  }

  try {
    return JSON.parse(fixedJson);
  } catch (e) {
    const castedError = e as Error;
    console.error('Error parsing JSON with lenientJsonParse:', castedError);
    return { error: castedError.message };
  }
};

export default lenientJsonParse;

