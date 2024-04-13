import axios, { AxiosResponse } from 'axios';

// Define interfaces for better type management
interface BaseProviderConfig {
  model: string;
  url?: string;
  apiKey: string;
  function: (prompt: string, config: ProviderConfig) => Promise<string[]>;
}

interface GroqProviderConfig extends BaseProviderConfig {
  sdk: GroqSDK;
}

interface ProviderConfig extends BaseProviderConfig {
  sdk?: GroqSDK;
}

interface GroqSDK {
  new (config: { apiKey: string; dangerouslyAllowBrowser: boolean }): GroqInstance;
}

interface GroqInstance {
  chat: {
    completions: {
      create: (options: GroqOptions) => Promise<GroqResponse>;
    };
  };
}

interface GroqOptions {
  messages: { role: string; content: string }[];
  model: string;
  temperature: number;
  stream: boolean;
  response_format: { type: string };
  stop: null;
}

interface GroqResponse {
  choices: { message: { content: string } }[];
}

const Groq: GroqSDK = require("groq-sdk");

// Configuration for each provider
const config: { [key: string]: ProviderConfig } = {
  'groq': {
    model: 'mixtral-8x7b-32768',
    sdk: Groq,
    apiKey: '',
    function: groqRequest as any // Casting to any to bypass TypeScript complaints temporarily
  },
  'chatgpt': {
    model: 'gpt-4.0-turbo',
    url: 'https://api.openai.com/v1/engines/gpt-4.0-turbo/completions',
    apiKey: '',
    function: chatgptRequest
  }
  // 'claud': {
  //   model: 'claud-base',
  //   url: 'https://api.claud.ai/v1/completions',
  //   apiKey: '',
  //   function: claudRequest
  // }
};

// Central request function to switch between providers
const request = async (prompt: string, apiKey: string, provider: string): Promise<string[]> => {
  const providerConfig = config[provider];
  if (!providerConfig) {
    throw new Error('Unsupported provider');
  }
  providerConfig.apiKey = apiKey || providerConfig.apiKey;
  return providerConfig.function(prompt, providerConfig);
};

// Groq request function
async function groqRequest(prompt: string, { sdk, apiKey, model }: GroqProviderConfig): Promise<string[]> {
  if (!sdk) {
    throw new Error('SDK configuration is missing for Groq request.');
  }
  const groq: GroqInstance = new sdk({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  while (true) {
    try {
      const response: GroqResponse = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: model,
        temperature: 1,
        stream: false,
        response_format: { type: "json_object" },
        stop: null
      });
      return response.choices.map(choice => choice.message.content);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        console.log('Rate limit exceeded, retrying in 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('Error occurred while making request:', error);
        throw error;
      }
    }
  }
};

// ChatGPT request function
async function chatgptRequest(prompt: string, config: BaseProviderConfig): Promise<string[]> {
  const { url, apiKey, model } = config;  // Destructuring for ease of use

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const data = {
    model: model,
    prompt: prompt,
    // max_tokens: 150,
    temperature: 0.7,
    // stop: ["\n", "<|endoftext|>"]
  };

  try {
    const response: AxiosResponse = await axios.post(url!, data, { headers });
    return response.data.choices.map((choice: any) => choice.text);
  } catch (error: any) {
    if (error.response && error.response.status === 429) {
      console.log('Rate limit exceeded, retrying in 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return chatgptRequest(prompt, config); // Retry with the same config object
    } else {
      console.error('Error occurred while making request:', error);
      throw error;
    }
  }
}

// // Placeholder function for Claud API requests
// async function claudRequest(prompt: string, { url, apiKey, model }: BaseProviderConfig): Promise<string[]> {
//   // Implementation details needed for Claud API
// }

export default request;


