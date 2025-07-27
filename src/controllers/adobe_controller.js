// the openAI docs were very useful and easy to read
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// prompts created by Thomas Clark
export async function genDocDescription(content) {
  const prompt = `Provide a 1 sentence description that highlights only the most essential things to know about ${countryName}. This response MUST include mentions of the country's full name (in english chracters and official language characters), capital city, languages spoken, population, and leader(s), BUT KEEP IT LIGHTHEARTED BUT NOT CORNY AND CUT DOWN ON THE CLICHES. DO NOT EXCEED 200 CHARACTERS IN LENGTH`;

  // the following setup is documented in the openAI API docs
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200, // ensure that there is enough tokens to create a full length response. prevent cut-offs
      temperature: 0.3, // temperature is how random or creative the response can get. good for variety in fun facts, suggested by chatGPT
      store: true,
    });

    const description = completion.choices[0].message.content.trim();
    return description;
  } catch (error) {
    console.error('Error generating country description:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}
