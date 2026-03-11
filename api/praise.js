const GENDER = {
  'תמר':'נקבה','נחמי':'נקבה','יהודית':'נקבה',
  'אלישבע':'נקבה','מירי':'נקבה','שרי':'נקבה',
  'חיים':'זכר','ישראל דוד':'זכר'
};

function cleanText(text) {
  return text
    .replace(/^["״«»]+|["״«»]+$/g, '')
    .replace(/^\s+|\s+$/g, '')
    .split('\n')[0]
    .split(' ').slice(0, 25).join(' '); // חתוך ל-25 מילים מקסימום
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { childName, playerName } = req.body;

  if (!childName) {
    return res.status(400).json({ error: 'Missing childName' });
  }

  const childGender  = GENDER[childName]  || 'זכר';
  const playerGender = GENDER[playerName] || 'זכר';
  const isSelf   = playerName && playerName === childName;
  const hasPlayer = playerName && playerName !== childName;

  let prompt;

  if (isSelf) {
    prompt = `אתה כותב מחמאה קצרה וחמה בעברית לילד${childGender==='נקבה'?'ה':''} בשם ${childName}.
${childName} (${childGender}) שיחק${childGender==='נקבה'?'ה':''} ושבר${childGender==='נקבה'?'ה':''} את הלבנה שלו${childGender==='נקבה'?'ה':''}.
כתוב מחמאה אישית וחמה בלשון ${childGender}, עד 20 מילים בלבד.
השתמש בשם ${childName}.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;

  } else if (hasPlayer) {
    prompt = `אתה כותב מחמאה קצרה וחמה בעברית.
${playerName} (${playerGender}) שבר${playerGender==='נקבה'?'ה':''} את הלבנה של ${childName} (${childGender}) במשחק משפחתי.
כתוב מחמאה חמה מ${playerName} אל ${childName}, עד 20 מילים בלבד.
פנה ל${childName} בלשון ${childGender}.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;

  } else {
    prompt = `אתה כותב מחמאה קצרה וחמה בעברית לילד${childGender==='נקבה'?'ה':''} בשם ${childName} (${childGender}).
כתוב מחמאה חמה ומעודדת, עד 20 מילים בלבד, בלשון ${childGender}.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 80,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    const praise = cleanText(data.content[0].text);
    res.status(200).json({ praise });

  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout' });
    }
    console.error('Praise API error:', err);
    res.status(500).json({ error: 'Failed to generate praise' });
  }
}
