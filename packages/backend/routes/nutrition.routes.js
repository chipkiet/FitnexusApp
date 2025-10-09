import express from 'express';

const router = express.Router();

const GDEBUG = (process.env.GEMINI_DEBUG === '1') || (process.env.NODE_ENV !== 'production');
const dbg = (...args) => { if (GDEBUG) console.log('[GEMINI]', ...args); };

function isNutritionRelated(text = '') {
  const s = String(text || '').toLowerCase();
  if (!s.trim()) return true;
  const allow = ['ăn','an ','dinh dưỡng','dinh duong','calo','kcal','protein','carb','fat','lipid','bữa','khẩu phần','giảm cân','tăng cân','giữ cân','giảm mỡ','tăng cơ','macro','meal','diet','nutrition','calorie','plan','thực đơn','ăn kiêng','keto','low carb','high protein','bữa sáng','bữa trưa','bữa tối','snack'];
  return allow.some(k => s.includes(k));
}

async function callGemini(prompt, apiKey) {
  if (!apiKey) {
    dbg('missing apiKey → demo response');
    return 'Bản nháp kế hoạch (demo, thiếu GEMINI_API_KEY)\n\n- Mục tiêu: theo yêu cầu\n- Bữa sáng/trưa/tối + snack: gợi ý mẫu\n- Macro ước tính theo mục tiêu\n\nHãy cấu hình GEMINI_API_KEY ở backend để nhận đề xuất chi tiết từ AI.';
  }

  const model = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();
  dbg('model in use', model);
  const versions = ['v1', 'v1beta'];
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    safetySettings: [],
  };

  const postJson = async (fullUrl, payloadObj) => {
    const payload = JSON.stringify(payloadObj);
    if (typeof fetch === 'function') {
      const r = await fetch(fullUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload });
      const txt = await r.text();
      let json = {};
      try { json = JSON.parse(txt); } catch {}
      if (!r.ok) {
        const msg = json?.error?.message || `Gemini API error ${r.status}`;
        const err = new Error(msg);
        err.status = r.status; err.body = json; err.url = fullUrl;
        throw err;
      }
      return json;
    }
    // Node < 18 fallback
    const https = await import('https');
    const { URL } = await import('url');
    const u = new URL(fullUrl);
    const options = { method: 'POST', hostname: u.hostname, path: u.pathname + u.search, headers: { 'Content-Type': 'application/json' } };
    const data = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = '';
        res.on('data', (d) => (chunks += d));
        res.on('end', () => { try { resolve(JSON.parse(chunks)); } catch (e) { reject(e); } });
      });
      req.on('error', reject); req.write(JSON.stringify(payloadObj)); req.end();
    });
    if (data?.error) { const err = new Error(data.error.message || 'Gemini API error'); err.status = data.error.code; err.body = data; throw err; }
    return data;
  };

  let lastErr = null;
  for (const v of versions) {
    const url = `https://generativelanguage.googleapis.com/${v}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    try {
      dbg('request', { version: v, model, promptLen: String(prompt).length });
      const data = await postJson(url, body);
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('\n') || '';
      dbg('success', { version: v, model, textLen: text.length });
      return text;
    } catch (e) {
      dbg('error', { version: v, model, status: e?.status, message: e?.message });
      lastErr = e;
      if (e?.status !== 404) break; // only fallback to next version on 404
    }
  }
  throw lastErr || new Error('Gemini API call failed');
}

router.post('/plan', async (req, res) => {
  try {
    const goalRaw = String(req.body?.goal || '').toUpperCase();
    const extra = String(req.body?.extra || '').trim();
    const allowed = ['LOSE_WEIGHT','GAIN_WEIGHT','MAINTAIN'];
    const goal = allowed.includes(goalRaw) ? goalRaw : 'MAINTAIN';
    if (!isNutritionRelated(extra)) {
      dbg('off-topic blocked', { goal: goalRaw, extraLen: extra.length });
      return res.status(400).json({ success: false, offTopic: true, message: 'Tôi chỉ được thiết kế để lên kế hoạch dinh dưỡng' });
    }
    const systemGuard = 'Bạn là trợ lý dinh dưỡng. Chỉ trả lời về kế hoạch ăn uống, gợi ý bữa ăn, macro\nNếu câu hỏi không liên quan đến dinh dưỡng, hãy trả lời đúng 1 câu: "Tôi chỉ được thiết kế để lên kế hoạch dinh dưỡng".';
    const goalText = goal === 'LOSE_WEIGHT' ? 'Giảm cân' : goal === 'GAIN_WEIGHT' ? 'Tăng cân' : 'Giữ cân/balanced';
    const userPrompt = `Mục tiêu: ${goalText}.\nThông tin bổ sung: ${extra || '(không có)'}.\nHãy gợi ý thực đơn 3-4 bữa/ngày trong 3 ngày, kèm macro ước tính, tổng kcal/ngày gợi ý theo mục tiêu.`;
    const prompt = `${systemGuard}\n\n${userPrompt}`;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    dbg('incoming', { goal: goalRaw, extraLen: extra.length, model: process.env.GEMINI_MODEL || 'gemini-2.0-flash', apiKeySet: !!apiKey });
    const resp = await callGemini(prompt, apiKey);
    return res.json({ success: true, data: { text: resp } });
  } catch (err) {
    console.error('nutrition plan error:', err);
    // Graceful fallback so FE still gets a plan
    const fallback = `Kế hoạch (fallback do lỗi gọi AI)\n\n- Mục tiêu: ${String(req.body?.goal || '')}\n- Gợi ý: ăn cân bằng, ưu tiên thực phẩm tươi, tránh đồ siêu chế biến.\n- Bữa sáng/trưa/tối kèm snack tuỳ ngân sách.\n\n(Thiết lập GEMINI_API_KEY và đảm bảo model hợp lệ để nhận gợi ý chi tiết từ AI.)`;
    dbg('fallback-used', { message: err?.message });
    return res.json({ success: true, data: { text: fallback }, meta: { fallback: true, error: err?.message || 'unknown' } });
  }
});

export default router;
