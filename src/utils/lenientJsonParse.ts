const lenientJsonParse = (json: string): any => {
  const cleanedJson = json.replace(/,\s*(}|])/g, '$1');
  return JSON.parse(cleanedJson);
};

export default lenientJsonParse;