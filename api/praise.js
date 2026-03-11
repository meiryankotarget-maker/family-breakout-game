export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { childName, playerName } = req.body;

  if (!childName) {
    return res.status(400).json({ error: 'Missing childName' });
  }

  try {
    const isSelf = playerName && playerName === childName;

    const prompt = isSelf
      ? `אתה כותב מחמאות קצרות וחמות בעברית לילדים.
הילד ${childName} משחק ושבר את הלבנה שלו עצמו.
כתוב מחמאה אישית וחמה אליו, משפט אחד עד שניים.
השתמש בשם ${childName} במחמאה.
ענה רק את המחמאה, ללא הסבר.`
      : `אתה כותב מחמאות קצרות וחמות בעברית לילדים במשפחה גדולה.
השחקן שמשחק: ${playerName || 'ילד מהמשפחה'}.
הלבנה שנשברה שייכת ל: ${childName}.
כתוב מחמאה חמה מ${playerName || 'המשפחה'} אל ${childName}, משפט אחד עד שניים.
השתמש בשמות שניהם במחמאה.
ענה רק את המחמאה, ללא הסבר.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    const praise = data.content[0].text.trim();
    res.status(200).json({ praise });

  } catch (err) {
    console.error('Praise API error:', err);
    res.status(500).json({ error: 'Failed to generate praise' });
  }
}
