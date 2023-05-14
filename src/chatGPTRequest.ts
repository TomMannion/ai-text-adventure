import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

const chatGPTRequest = async (prompt: string, apiKey: string): Promise<string[]> => {
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
  };

  const body = {
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
      temperature: 1,
  };

  while (true) {
    try {
      const response = await axios.post(API_URL, body, { headers: headers });
      console.log(response.data)
      return response.data.choices.map((choice: any) => choice.message.content);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        console.log('Rate limit exceeded, retrying in 3 second...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('Error occurred while making request:', error);
        throw error;
      }
    }
  }
};

export default chatGPTRequest;
