// the openAI docs were very useful and easy to read
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// prompts created by Thomas Clark
export async function genDocSummary(docContent) {
  const prompt = `Provide a one paragraph summary of the following document. Focus on reading comprehension: ${docContent}`;

  // the following setup is documented in the openAI API docs
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500, // ensure that there is enough tokens to create a full length response. prevent cut-offs
      temperature: 0.2, // temperature is how random or creative the response can get. 0.2 is 'more focused and deterministic'
      store: true,
    });

    const summary = completion.choices[0].message.content.trim();
    return summary;
  } catch (error) {
    console.error('Error generating country description:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}