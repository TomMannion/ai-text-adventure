const filterOptions = (options: { [key: string]: { text: string; risk: string } }): { [key: string]: { text: string; risk: string } } => {
  const filteredOptions: { [key: string]: { text: string; risk: string } } = {};
  for (const key in options) {
    const option = options[key];
    if (
      option.text !== null &&
      option.text !== undefined &&
      option.text.trim() !== '' &&
      option.text.trim() !== 'undefined' &&
      option.text.trim() !== 'null'
    ) {
      filteredOptions[key] = option;
    }
  }
  return filteredOptions;
};

export default filterOptions;