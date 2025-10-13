import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Brain, Leaf, ImagePlus, Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './NutritionAI.css';

function centerCropToSquare(imgEl, size = 224) {
  const s = Math.min(imgEl.naturalWidth, imgEl.naturalHeight);
  const sx = Math.floor((imgEl.naturalWidth - s) / 2);
  const sy = Math.floor((imgEl.naturalHeight - s) / 2);
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d');
  ctx.drawImage(imgEl, sx, sy, s, s, 0, 0, size, size);
  return c;
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().trim().replace(/\s+/g,'_');
}

export default function FoodCalorie() {
  const [ready, setReady] = useState(false);
  const [labels, setLabels] = useState([]);
  const [calo, setCalo] = useState({});
  const [portion, setPortion] = useState({});
  const [macrosMap, setMacrosMap] = useState({}); // per 100g: { protein, carbs, fat }
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const gramsRef = useRef();
  const sizeRef = useRef();
  const fileRef = useRef();

  const models = useMemo(() => ({ net: null, clf: null }), []);

  // Merge both raw and normalized keys for robust lookup
  const setMacrosWithNormalization = (macros) => {
    const map = {};
    if (Array.isArray(macros)) {
      for (const item of macros) {
        const k1 = item?.key || (item?.name ? norm(item.name) : null);
        if (item?.name) map[item.name] = item;
        if (k1) {
          map[k1] = item;
          map[norm(k1)] = item;
        }
      }
    } else {
      for (const [k, v] of Object.entries(macros || {})) {
        map[k] = v;
        map[norm(k)] = v;
      }
    }
    setMacrosMap(map);
  };
  
  useEffect(() => {
    (async () => {
      try {
        // Try WebGL, then gracefully fall back to CPU if unavailable
        try {
          await tf.setBackend('webgl');
        } catch (_) {
          await tf.setBackend('cpu');
        }
        await tf.ready();

        // Prefer loading a local MobileNetV2 if present, else fall back to remote
        const tryLocalMobileNet = async () => {
          const candidates = [
            // Plain folders (tfjs-models layout)
            '/model/mobilenet/model.json',
            '/model/mobilenet_v2/model.json',
            '/model/mobilenet_v2_1.0_224/model.json',
            '/model/mobilenet_v2_100_224/model.json',
            // TFHub-style layout (your link usually expands to this)
            '/model/mobilenet_v2_1.0_224/classification/2/model.json',
            '/model/mobilenet_v2_100_224/classification/2/model.json',
          ];
          for (const url of candidates) {
            try {
              const res = await fetch(url, { method: 'GET', cache: 'no-store' });
              if (res.ok) {
                return await mobilenet.load({ version: 2, alpha: 1.0, modelUrl: url });
              }
            } catch(_) { /* try next */ }
          }
          // Fallback to remote CDN (requires network)
          return await mobilenet.load({ version: 2, alpha: 1.0 });
        };

        const net = await tryLocalMobileNet();
        const clf = await tf.loadLayersModel('/model/classifier/model.json');
        const lbs = await (await fetch('/model/labels.json')).json();
        const cal = await (await fetch('/tables/calorie_table.json')).json();
        const por = await (await fetch('/tables/portion_defaults.json')).json();
        // Optional macros table
        let macros = {};
        try {
          const r = await fetch('/tables/macros_table.json', { cache: 'no-store' });
          if (r.ok) macros = await r.json();
        } catch {}
        models.net = net; models.clf = clf;
        setLabels(lbs);
        setCalo(cal);
        setPortion(por?.default_portions || por || {});
        setMacrosWithNormalization(macros || {});
        setReady(true);
        setError('');
        console.log('Loaded. output=', clf.outputs[0].shape, 'labels=', lbs.length);
      } catch (e) {
        console.error(e);
        setError('Không thể tải mô hình/dữ liệu. Nếu môi trường chặn internet, hãy thêm MobileNetV2 vào /public/model/mobilenet và kiểm tra các tệp trong /public/model và /public/tables.');
        setReady(false);
      }
    })();
    return () => {
      try { models.clf?.dispose(); } catch {}
    };
  }, [models]);

  function computePortionGrams(key, userGrams, size) {
    const baseFromMacros = (macrosMap[key] && macrosMap[key].serving_g) ? Number(macrosMap[key].serving_g) : null;
    const base = portion[key] ?? baseFromMacros ?? 250;
    if (userGrams && userGrams > 0) return userGrams;
    if (size === 's') return Math.round(base * 0.7);
    if (size === 'l') return Math.round(base * 1.3);
    return base;
  }

  function computeMacros(key, grams) {
    const entry = macrosMap[key] || null;
    if (!entry) return null;

    const src = entry?.per_100g && typeof entry.per_100g === 'object' ? entry.per_100g : entry;

    const canon = (k) => {
      const s = String(k || '').toLowerCase();
      const base = s.replace(/_(g|mg)$/,'');
      if (["protein","proteins","prot"].includes(base)) return "protein";
      if (["carb","carbs","carbohydrate","carbohydrates"].includes(base)) return "carbs";
      if (["fat","fats"].includes(base)) return "fat";
      if (["alcohol"].includes(base)) return "alcohol";
      if (["sugar","sugars"].includes(base)) return "sugar";
      if (["fiber","fibre"].includes(base)) return "fiber";
      if (["sodium","salt"].includes(base)) return "sodium";
      if (["kcal","calories","energy"].includes(base)) return base;
      return base;
    };
    const detectUnit = (k) => {
      const s = String(k || '').toLowerCase();
      if (/_mg$/.test(s)) return 'mg';
      if (/_g$/.test(s)) return 'g';
      if (["kcal","calories","energy"].includes(s.replace(/_(g|mg)$/,''))) return 'kcal';
      return 'g';
    };
    const niceName = (id) => {
      const map = {
        protein: "Protein",
        carbs: "Carb",
        fat: "Fat",
        alcohol: "Alcohol",
        sugar: "Sugar",
        fiber: "Fiber",
        sodium: "Sodium",
        kcal: "Calories",
        calories: "Calories",
        energy: "Energy",
      };
      const s = String(id || "");
      return map[s] || s.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    };

    const per100By = {};
    const amountBy = {}; // portion amount for energy macros in grams
    const details = [];
    for (const [k, v] of Object.entries(src)) {
      const id = canon(k);
      const unit = detectUnit(k);
      const per100 = Number(v) || 0;
      per100By[id] = per100;
      const value = unit === 'mg'
        ? Math.round((per100 * grams) / 100)
        : +(per100 * grams / 100).toFixed(1);
      details.push({ id, name: niceName(id), value, unit });
      if ((id === 'protein' || id === 'carbs' || id === 'fat' || id === 'alcohol') && unit === 'g') {
        amountBy[id] = value;
      }
    }

    const pG = amountBy.protein || 0;
    const cG = amountBy.carbs || 0;
    const fG = amountBy.fat || 0;
    const aG = amountBy.alcohol || 0;
    const pKcal = pG * 4;
    const cKcal = cG * 4;
    const fKcal = fG * 9;
    const aKcal = aG * 7;
    const kcalFromMacros = pKcal + cKcal + fKcal + aKcal;
    const kcal100Field = per100By.kcal ?? per100By.calories ?? per100By.energy ?? null;
    const kcal100FromMacros = (per100By.protein || per100By.carbs || per100By.fat || per100By.alcohol)
      ? (per100By.protein || 0) * 4 + (per100By.carbs || 0) * 4 + (per100By.fat || 0) * 9 + (per100By.alcohol || 0) * 7
      : null;
    const kcal100Effective = Number.isFinite(kcal100Field) ? kcal100Field
      : (Number.isFinite(kcal100FromMacros) ? Math.round(kcal100FromMacros) : null);
    const pct = kcalFromMacros > 0 ? {
      p: +(pKcal / kcalFromMacros * 100).toFixed(0),
      c: +(cKcal / kcalFromMacros * 100).toFixed(0),
      f: +(fKcal / kcalFromMacros * 100).toFixed(0),
      a: +(aKcal / kcalFromMacros * 100).toFixed(0),
    } : { p: 0, c: 0, f: 0, a: 0 };

    const order = ["protein","carbs","fat","alcohol"];
    details.sort((a,b) => {
      const ia = order.indexOf(a.id); const ib = order.indexOf(b.id);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      return a.name.localeCompare(b.name);
    });

    return {
      grams: { p: pG, c: cG, f: fG, a: aG },
      kcal: { p: Math.round(pKcal), c: Math.round(cKcal), f: Math.round(fKcal), a: Math.round(aKcal), total: Math.round(kcalFromMacros) },
      pct,
      details,
      per100By,
      kcal100Field,
      kcal100FromMacros,
      kcal100Effective,
    };
  }

  function recalcFromControls(cur) {
    if (!cur) return;
    const userGrams = gramsRef.current?.value ? Number(gramsRef.current.value) : null;
    const size = sizeRef.current?.value || '';
    const grams = computePortionGrams(cur.key, userGrams, size);
    const macros = computeMacros(cur.key, grams);
    const kcal100Eff = macros?.kcal100Effective ?? cur.kcal100;
    const total = Math.round((kcal100Eff || 0) * grams / 100);
    setResult({ ...cur, grams, total, macros, kcal100: kcal100Eff });
  }

  // Allow user to click a predicted dish to view its nutrition
  function showDishInfo(dish, confidence) {
    try {
      const key = calo[dish] != null ? dish : norm(dish);
      const macros0 = computeMacros(key, 100);
      const kcal100 = macros0?.kcal100Effective ?? (calo[key] ?? 150);
      const userGrams = gramsRef.current?.value ? Number(gramsRef.current.value) : null;
      const size = sizeRef.current?.value || '';
      const grams = computePortionGrams(key, userGrams, size);
      const total = Math.round(kcal100 * grams / 100);
      const macros = computeMacros(key, grams);
      setResult((prev) => ({
        ...(prev || {}),
        dish,
        confidence: confidence ?? prev?.confidence ?? null,
        key,
        kcal100,
        grams,
        total,
        macros,
      }));
    } catch (e) {
      // noop
    }
  }

  async function onPickFile(e) {
    if (!ready) return;
    const f = e.target.files?.[0];
    if (!f) return;

    const img = new Image();
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    img.src = url;
    await new Promise(r => (img.onload = () => r()));
    const canvas = centerCropToSquare(img, 224);

    const prediction = tf.tidy(() => {
      const x = tf.browser.fromPixels(canvas); // 0..255, RGB
      const emb = models.net.infer(x.expandDims(0), 'global_average');
      const probs = models.clf.predict(emb).dataSync();
      const arr = Array.from(probs);
      const top = arr.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v).slice(0,3);
      return { arr, top };
    });

    const top1 = prediction.top[0];
    const dish = labels[top1.i];
    const key = calo[dish] != null ? dish : norm(dish);
    // Prefer kcal/100g from macros table if available; fallback to calorie_table
    const macros0 = computeMacros(key, 100); // probe for kcal100Effective
    const kcal100 = macros0?.kcal100Effective ?? (calo[key] ?? 150);

    const userGrams = gramsRef.current?.value ? Number(gramsRef.current.value) : null;
    const size = sizeRef.current?.value || '';
    const grams = computePortionGrams(key, userGrams, size);
    const total = Math.round(kcal100 * grams / 100);
    const macros = computeMacros(key, grams);

    setResult({
      dish,
      confidence: top1.v,
      top3: prediction.top.map(t => ({ dish: labels[t.i], confidence: t.v })),
      grams, kcal100, total,
      key,
      macros,
    });
  }

  return (
<html style={{backgroundColor: '#0a1320'}}>
    <div className="fc-page">
      {/* Hidden global file input so both hero and scanner can trigger it */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onPickFile}
        hidden
        disabled={!ready}
      />

      {/* Swap hero with scanner after image is selected */}
      {!previewUrl ? (
        <section className="fc-hero fc-container">
          <div className="fc-card">
            <div className="fc-hero-inner">
              <h1 className="fc-hero-title">It's Like Shazam, But For Your Meals</h1>
              <p className="fc-hero-sub">Drag & drop or upload an image of your meal to get instant AI-powered analysis and macro tracking.</p>
              <div className="fc-hero-cta">
                <button className="fc-btn-primary" onClick={() => fileRef.current?.click()} disabled={!ready}>
                  <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
                    <ImagePlus size={18} /> Upload Your Food Image
                  </span>
                </button>
                <button
                  className="fc-btn-secondary"
                  style={{marginLeft:12}}
                  onClick={() => {
                    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
                    // Navigate via URL change to keep it simple here
                    window.location.assign('/nutrition-ai/personalize');
                  }}
                >
                  Cá nhân hoá chế độ dinh dưỡng
                </button>
              </div>
              {!ready && !error && (
                <div className="fc-loading" style={{display:'inline-flex',alignItems:'center',gap:8}}>
                  <Loader2 className="animate-spin" size={18} /> Đang tải mô hình…
                </div>
              )}
              {/* Small benefits row */}
              <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:12,flexWrap:'wrap'}}>
                <div className="fc-badge" style={{display:'inline-flex',alignItems:'center',gap:6}}>
                  <Brain size={16} /> Cá nhân hoá theo mục tiêu
                </div>
                <div className="fc-badge" style={{display:'inline-flex',alignItems:'center',gap:6}}>
                  <Leaf size={16} /> Gợi ý bữa ăn cân bằng
                </div>
              </div>
              {error && <div className="fc-error">{error}</div>}
            </div>
          </div>
        </section>
      ) : (
        <section className="fc-container">
        <div className="fc-card">
          <div className="fc-header">
            <h3>Tính calo món ăn</h3>
            <p className="fc-sub">Nhận diện món từ ảnh và ước tính kcal</p>
          </div>

          <div className="fc-grid">
            <div className="fc-col">
              <div className="fc-preview">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" loading="lazy" decoding="async" />
                ) : (
                  <div className="fc-placeholder">Chưa có ảnh</div>
                )}
              </div>
            </div>

            <div className="fc-col">
              <label className="fc-label">Thiết lập khẩu phần</label>
              <div className="fc-controls">
                <input className="fc-input" ref={gramsRef} type="number" placeholder="Khối lượng (gram) – tuỳ chọn" onChange={() => recalcFromControls(result)} />
                <select className="fc-select" ref={sizeRef} defaultValue="" onChange={() => recalcFromControls(result)}>
                  <option value="">Kích cỡ khẩu phần</option>
                  <option value="s">Nhỏ (S)</option>
                  <option value="m">Vừa (M)</option>
                  <option value="l">Lớn (L)</option>
                </select>
                <button className="fc-btn-secondary" onClick={() => fileRef.current?.click()} disabled={!ready}>Chọn/đổi ảnh</button>
              </div>

              {result && (
                <div className="fc-result" aria-live="polite">
                  <div className="fc-row">
                    <span className="fc-key">Món ăn:</span>
                    <span className="fc-val">
                      {result.dish}
                    </span>
                  </div>
                  <div className="fc-row"><span className="fc-key">Khối lượng:</span><span className="fc-val">{result.grams} g</span></div>
                  <div className="fc-row"><span className="fc-key">Calo / 100g:</span><span className="fc-val">{result.kcal100}</span></div>
                  <div className="fc-total">Tổng: {result.total} kcal</div>
                  <div className="fc-top3">
                    {result.top3.map((t,idx)=> {
                      const active = result.dish === t.dish;
                      const cls = `fc-chip clickable${active ? ' active' : ''}`;
                      return (
                        <span
                          key={idx}
                          className={cls}
                          role="button"
                          tabIndex={0}
                          aria-pressed={active}
                          title="Xem dinh dưỡng món này"
                          onClick={() => showDishInfo(t.dish, t.confidence)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDishInfo(t.dish, t.confidence); } }}
                        >
                          {t.dish} {(t.confidence*100).toFixed(1)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {result && (
                result.macros ? (
                  <div className="fc-macros">
                    <div className="fc-macros-head">
                      <div className="fc-macros-title">Thành phần dinh dưỡng (ước tính cho {result.grams}g)</div>
                      <div className="fc-macros-sub">Tính từ bảng macro/100g nếu có dữ liệu</div>
                    </div>
                    <div className="fc-macro-rows">
                      {result.macros.details.map((it) => {
                        const pctBadge = it.id === 'protein' ? result.macros.pct.p
                          : it.id === 'carbs' ? result.macros.pct.c
                          : it.id === 'fat' ? result.macros.pct.f
                          : it.id === 'alcohol' ? result.macros.pct.a
                          : null;
                        return (
                          <div key={it.id} className="fc-macro-row">
                            <div className="fc-macro-name">{it.name}</div>
                            <div className="fc-macro-val">
                              {it.value} {it.unit}{pctBadge !== null && pctBadge !== undefined ? (
                                <> <span className="fc-badge">{pctBadge}%</span></>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="fc-macro-stack" aria-label="Macro energy split">
                      <div className="seg protein" style={{ width: `${result.macros.pct.p}%` }} />
                      <div className="seg carb" style={{ width: `${result.macros.pct.c}%` }} />
                      <div className="seg fat" style={{ width: `${result.macros.pct.f}%` }} />
                      {result.macros.grams.a > 0 ? (
                        <div className="seg alcohol" style={{ width: `${result.macros.pct.a}%` }} />
                      ) : null}
                    </div>
                    <div className="fc-macro-legend">
                      <span className="dot protein" /> Protein
                      <span className="dot carb" /> Carb
                      <span className="dot fat" /> Fat
                      {result.macros.grams.a > 0 ? (<><span className="dot alcohol" /> Alcohol</>) : null}
                    </div>
                  </div>
                ) : (
                  <div className="fc-error">Chưa có dữ liệu macro chi tiết cho món này. Thêm vào file /public/tables/macros_table.json để hiển thị tỉ lệ protein/carb/fat.</div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Static sections remain visible regardless of upload */}
      <section className="fc-features fc-container">
        <h2 className="fc-section-title">Why Use Our AI Food Scanner?</h2>
        <div className="fc-features-grid">
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">🔎</div>
            <h3 className="fc-feature-title">Instant Food Detection</h3>
            <p className="fc-feature-text">Get nutritional info from any food image in seconds with advanced AI.</p>
          </div>
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">📊</div>
            <h3 className="fc-feature-title">Comprehensive Results</h3>
            <p className="fc-feature-text">View calories, macros, serving sizes, and insights in one place.</p>
          </div>
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">🏃‍♂️</div>
            <h3 className="fc-feature-title">Macro Tracking App</h3>
            <p className="fc-feature-text">Perfect for planning your meals and checking nutritional values on the go.</p>
          </div>
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">🍲</div>
            <h3 className="fc-feature-title">Calorie Counter By Recipe</h3>
            <p className="fc-feature-text">Estimate total calories based on recognized dish or recipe.</p>
          </div>
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">🆓</div>
            <h3 className="fc-feature-title">Cost Effective</h3>
            <p className="fc-feature-text">Free to use for personal analysis — no signup required.</p>
          </div>
          <div className="fc-feature-card">
            <div className="fc-feature-emoji">👩‍🍳</div>
            <h3 className="fc-feature-title">AI Recipe Generator</h3>
            <p className="fc-feature-text">Discover ingredients, nutrition facts, and easy-to-follow preparations.</p>
          </div>
        </div>
      </section>

      <section className="fc-steps fc-container">
        <h2 className="fc-section-title">How Does It Work?</h2>
        <div className="fc-steps-grid">
          <div className="fc-step-card">
            <span className="fc-step-badge">1</span>
            <h3 className="fc-step-title">Upload Food Image</h3>
            <p className="fc-step-text">Take a photo or upload an existing image from your device.</p>
          </div>
          <div className="fc-step-card">
            <span className="fc-step-badge">2</span>
            <h3 className="fc-step-title">AI Analyzes Food</h3>
            <p className="fc-step-text">We identify food items and their nutritional content in seconds.</p>
          </div>
          <div className="fc-step-card">
            <span className="fc-step-badge">3</span>
            <h3 className="fc-step-title">Get Detailed Results</h3>
            <p className="fc-step-text">See calories, macros, serving sizes, and helpful insights.</p>
          </div>
        </div>
      </section>

      <section className="fc-faq fc-container">
        <h2 className="fc-section-title">Frequently Asked Questions</h2>
        <div className="fc-faq-list">
          <div className="fc-faq-item">
            <h4 className="fc-faq-q">How accurate is the Food Calorie Analyzer?</h4>
            <p className="fc-faq-a">Our AI provides estimates with approximately 85–90% accuracy for common foods. Results may vary by image quality and dish complexity.</p>
          </div>
          <div className="fc-faq-item">
            <h4 className="fc-faq-q">Can I analyze multiple items in one image?</h4>
            <p className="fc-faq-a">Yes, we aim to identify and provide nutrition for multiple food items in a single image depending on clarity.</p>
          </div>
          <div className="fc-faq-item">
            <h4 className="fc-faq-q">What types of nutritional info do you provide?</h4>
            <p className="fc-faq-a">Calories, macronutrients, estimated serving size, and additional insights about identified foods.</p>
          </div>
          <div className="fc-faq-item">
            <h4 className="fc-faq-q">Is this service free to use?</h4>
            <p className="fc-faq-a">We offer a limited number of free analyses per day. For more, consider premium options.</p>
          </div>
        </div>
      </section>
    </div>
    </html>
  );
}
