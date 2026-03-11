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
כתוב
