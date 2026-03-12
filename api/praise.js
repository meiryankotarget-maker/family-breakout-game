const CHILDREN = {
  'תמר':        { gender:'נקבה', age:16,  role:'בכורה',            traits:'בגרות, תבונה, דוגמה לאחיות, עוגן הבית',
    praises:['תמר, את דוגמה מדהימה לאחיות הקטנות שלך.','הבגרות והתבונה של תמר הן נכס לכל המשפחה.','איזה כיף שיש אחות גדולה שאפשר תמיד להתייעץ איתה.'] },
  'חיים':       { gender:'זכר',   age:15,  role:'צדיק ומתמיד',      traits:'התמדה, צדיקות, לב רחב, רגוע',
    praises:['חיים, ההתמדה שלך בלימוד ובצדיקות מעוררת השראה.','איזה לב רחב יש לחיים, תמיד חושב על אחרים.','חיים הוא אח שפשוט כיף ורגוע להיות לידו.'] },
  'נחמי':       { gender:'נקבה', age:14,  role:'לב רגיש',           traits:'רגישות, עדינות, אצילות, עזרה לאחרים',
    praises:['נחמי תמיד מרגישה כשמישהו צריך מילה טובה.','העדינות והאצילות של נחמי מוסיפות המון אור לבית.','איזו אלופה נחמי בעזרה ובארגון מכל הלב!'] },
  'יהודית':    { gender:'נקבה', age:13,  role:'שמחה וחיוך',        traits:'חיוך, אנרגיה טובה, דאגה לאחים קטנים',
    praises:['החיוך של יהודית יכול להמיס כל לב.','יהודית, את אלופה בלהכניס אנרגיות טובות לכולם.','כמה יופי יש בדרך שבה יהודית דואגת לאחים הקטנים.'] },
  'אלישבע':   { gender:'נקבה', age:10,  role:'חן וויתור',          traits:'ויתור, חן, נועם, השקעה, רצון טוב',
    praises:['אלישבע, את פשוט צדיקה בדרך שבה את יודעת לוותר.','כמה חן ונועם יש בדיבור של אלישבע המתוקה.','כל הכבוד לאלישבע על ההשקעה והרצון הטוב!'] },
  'מירי':       { gender:'נקבה', age:8,   role:'נסיכת הפרגון',      traits:'פרגון, חברות טובה, שמחה, חיוניות',
    praises:['מירי, את פשוט מלכה בפרגון ובחברות טובה.','איזה כיף לראות את מירי משחקת בכזאת שמחה.','מירי היא ילדה שפשוט אי אפשר להפסיק לחבק!'] },
  'שרי':        { gender:'נקבה', age:5,   role:'מתוקת הבית',        traits:'מתיקות, נשיקות, חיוכים, אהבת סיפורי צדיקים',
    praises:['שרי שלנו, את הפרח הכי יפה בגינה של משפחת ינקו.','איזה מותק של ילדה שרי, תמיד מחלקת נשיקות וחיוכים.','שרי צדיקה קטנה, איך היא אוהבת לשמוע סיפורים על צדיקים!'] },
  'ישראל דוד': { gender:'זכר',   age:2.5, role:'נחת המשפחה',        traits:'מאחד, תינוק צדיק, מתנה, אהבה',
    praises:['ישראל דוד, אתה התינוק הצדיק שמאחד את כולנו.','איזה נחת זה לראות את ישראל דוד גדל בתוך כל האהבה הזאת.','ישראל דוד הוא המתנה הכי מתוקה שקיבלנו מהשם.'] }
};

const TORAH_EXAMPLES = [
  'הידעת? "איזהו עשיר? השמח בחלקו" – מי ששמח במה שיש לו, הוא העשיר האמיתי!',
  'הידעת? "אמור מעט ועשה הרבה" – צדיקים מבטיחים מעט, אבל עושים המון בשביל אחרים.',
  'הידעת? "הוי מקבל את כל האדם בסבר פנים יפות" – חיוך קטן לכל אחד זה חסד ענק.',
  'הידעת? "אל תסתכל בקנקן אלא במה שיש בו" – מה שחשוב זה הלב הטוב שבפנים, לא המראה מבחוץ.',
  'הידעת? "ואהבת לרעך כמוך" – התורה מלמדת אותנו להתייחס לכל אחד כמו שאנחנו רוצים שיתייחסו אלינו.',
  'הידעת? "כל ישראל ערבים זה בזה" – כולנו משפחה אחת גדולה ודואגים זה לזה.',
  'הידעת? "והדרת פני זקן" – לכבד סבא, סבתא ואנשים מבוגרים זו מצווה יקרה מהתורה.',
  'הידעת? "אם אין אני לי, מי לי?" – לכל אחד מאיתנו יש כוח מיוחד לעשות דברים טובים בעצמו.',
  'הידעת? "סור מרע ועשה טוב" – הדרך הכי טובה לנצח את היצר היא פשוט להוסיף עוד מעשים טובים.',
];

function cleanText(text) {
  return text
    .replace(/^["״«»]+|["״«»]+$/g, '')
    .replace(/^\s+|\s+$/g, '')
    .split('\n')[0]
    .split(' ').slice(0, 30).join(' ');
}

async function callClaude(prompt, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
    if (!response.ok) throw new Error(data.error?.message || 'API error');
    return cleanText(data.content[0].text);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { childName, playerName, type } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ══════════════════════════════════════════
  //  לבנת תורה
  // ══════════════════════════════════════════
  if (type === 'torah') {
    const useFromList = Math.random() < 0.4; // 40% מהרשימה, 60% חדש מ-Claude
    if (useFromList) {
      const praise = TORAH_EXAMPLES[Math.floor(Math.random() * TORAH_EXAMPLES.length)];
      return res.status(200).json({ praise });
    }

    const prompt = `אתה מנוע חינוכי יהודי חם למשחק משפחתי של משפחת ינקו.
צור משפט "הידעת?" קצר ומרתק לילדים בגיל 5-16.
הבא פנינת חוכמה מפרקי אבות, מהתורה, או מחז"ל.
הסבר אותה בשפה פשוטה, חמה ומתוקה שילדים יוכלו להתחבר אליה.

דוגמאות לסגנון הרצוי:
${TORAH_EXAMPLES.slice(0, 3).join('\n')}

כללים:
- התחל תמיד במילה "הידעת?"
- עד 25 מילים בלבד
- עברית תקינה וטבעית
- אל תחזור על הדוגמאות שלמעלה

ענה רק את המשפט, ללא הסבר נוסף.`;

    try {
      const praise = await callClaude(prompt, apiKey);
      return res.status(200).json({ praise });
    } catch (err) {
      // Fallback לרשימה
      const praise = TORAH_EXAMPLES[Math.floor(Math.random() * TORAH_EXAMPLES.length)];
      return res.status(200).json({ praise });
    }
  }

  // ══════════════════════════════════════════
  //  לבנת ילד — מחמאה
  // ══════════════════════════════════════════
  if (!childName) {
    return res.status(400).json({ error: 'Missing childName' });
  }

  const child  = CHILDREN[childName];
  const player = CHILDREN[playerName];

  if (!child) {
    return res.status(400).json({ error: 'Unknown child' });
  }

  const isSelf      = playerName && playerName === childName;
  const hasPlayer   = player && playerName !== childName;
  const useFromList = Math.random() < 0.5;

  if (useFromList) {
    const praise = child.praises[Math.floor(Math.random() * child.praises.length)];
    return res.status(200).json({ praise });
  }

  let prompt;

  if (isSelf) {
    prompt = `אתה כותב מחמאה קצרה בעברית ישראלית טבעית לילד${child.gender==='נקבה'?'ה':''} בשם ${childName}.
גיל: ${child.age}. תפקיד במשפחה: ${child.role}. תכונות: ${child.traits}.
${childName} שיחק${child.gender==='נקבה'?'ה':''} ושבר${child.gender==='נקבה'?'ה':''} את הלבנה שלו${child.gender==='נקבה'?'ה':''} במשחק.
דוגמאות לסגנון:
${child.praises.join('\n')}
כתוב מחמאה חדשה באותו סגנון — חמה, אישית, בעברית תקינה. עד 20 מילים.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;

  } else if (hasPlayer) {
    prompt = `אתה כותב מחמאה קצרה בעברית ישראלית טבעית, מופנית לילד${child.gender==='נקבה'?'ה':''} ${childName}.
${childName} — גיל ${child.age}, ${child.role}. תכונות: ${child.traits}.
דוגמאות לסגנון:
${child.praises.join('\n')}
כתוב מחמאה חדשה ל${childName} באותו סגנון — חמה, אישית, בעברית תקינה. עד 20 מילים.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;

  } else {
    prompt = `אתה כותב מחמאה קצרה בעברית ישראלית טבעית לילד${child.gender==='נקבה'?'ה':''} ${childName}.
גיל: ${child.age}. תפקיד: ${child.role}. תכונות: ${child.traits}.
דוגמאות לסגנון:
${child.praises.join('\n')}
כתוב מחמאה חדשה באותו סגנון — חמה, אישית, בעברית תקינה. עד 20 מילים.
ענה רק את המחמאה, ללא הסבר או מרכאות.`;
  }

  try {
    const praise = await callClaude(prompt, apiKey);
    return res.status(200).json({ praise });
  } catch (err) {
    // Fallback לרשימה תמיד
    const praise = child.praises[Math.floor(Math.random() * child.praises.length)];
    return res.status(200).json({ praise });
  }
}
