const filterOptions = (options: { [key: string]: string }): { [key: string]: string } => {
  const filteredOptions: { [key: string]: string } = {};
  for (const key in options) {
    if (
      options[key] !== null &&
      options[key] !== undefined &&
      options[key].trim() !== '' &&
      options[key].trim() !== 'undefined' &&
      options[key].trim() !== 'null'
    ) {
      filteredOptions[key] = options[key];
    }
  }
  return filteredOptions;
};

export default filterOptions;