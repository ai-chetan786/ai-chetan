export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { query, max_results } = req.body;
    const TAVILY_KEY = process.env.TAVILY_KEY;

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_KEY,
        query: query || 'India news today',
        max_results: max_results || 4,
        search_depth: 'basic'
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
