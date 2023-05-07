import lenientJsonParse from './lenientJsonParse';

const processJson = <T>(response: string): T => {
  try {
    // Parse the JSON-formatted response string into a JavaScript object
    const responseObject = lenientJsonParse(response);

    // Extract and process the data based on the provided type T
    const processedData: T = responseObject;

    // Return the processed data as a TypeScript object of type T
    return processedData;
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw error;
  }
};

export default processJson;