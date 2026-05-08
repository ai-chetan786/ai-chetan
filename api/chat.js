export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { messages, model, provider } = req.body;

    // Keys come from Vercel Environment Variables — NEVER from code!
    const GROQ_KEY       = process.env.GROQ_KEY;
    const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

    let response, data;

    if (provider === 'groq') {
      // Call Groq API
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: messages,
          max_tokens: 1500
        })
      });
      data = await response.json();
      if (!data.choices || !data.choices[0]) throw new Error(data.error?.message || 'Groq error');
      res.status(200).json({ reply: data.choices[0].message.content });

    } else {
      // Call OpenRouter API
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://ai-chetan.vercel.app',
          'X-Title': 'AI Chetan'
        },
        body: JSON.stringify({
          model: model || 'meta-llama/llama-3.3-70b-instruct:free',
          messages: messages,
          max_tokens: 1500
        })
      });
      data = await response.json();
      if (!data.choices || !data.choices[0]) throw new Error(data.error?.message || 'OpenRouter error');
      res.status(200).json({ reply: data.choices[0].message.content });
    }

  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ error: error.message || 'AI service failed' });
  }
}
