import lenientJsonParse from './lenientJsonParse';

const processJson = <T>(response: string): T => {
  let responseObject;

  try {
    // Try to parse the JSON-formatted response string into a JavaScript object
    responseObject = JSON.parse(response);
  } catch (error) {
    const castedError = error as Error;
    console.error('Error parsing JSON response:', castedError);

    // Use lenientJsonParse if standard JSON parsing fails
    responseObject = lenientJsonParse(response, castedError.message);
  }

  // If lenientJsonParse also fails, throw an error
  if ('error' in responseObject) {
    throw new Error('Both standard JSON parsing and lenientJsonParse failed');
  }

  // Extract and process the data based on the provided type T
  const processedData: T = responseObject;

  // Return the processed data as a TypeScript object of type T
  return processedData;
};

export default processJson;