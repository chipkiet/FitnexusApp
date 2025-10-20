// src/pages/admin/TrainerManage/vxpImages.js
import chestImg from "../../../assets/muscles/chest.png";
import lungImg  from "../../../assets/muscles/lung.png";
import vaiImg   from "../../../assets/muscles/vai.png";
import tayImg   from "../../../assets/muscles/tay.png";
import coreImg  from "../../../assets/muscles/core.png";
import mongImg  from "../../../assets/muscles/mong.png";
import duiImg   from "../../../assets/muscles/dui.png";
import chanImg  from "../../../assets/muscles/chan.png";

export const VXP_MAIN_GROUP_IMAGES = {
  Ngực: chestImg,
  Lưng: lungImg,
  Vai:  vaiImg,
  Tay:  tayImg,
  Core: coreImg,
  Mông: mongImg,
  Đùi:  duiImg,
  Chân: chanImg,
};

// ========= Sub group (Ngực trên / giữa / dưới...) =========
export const VXP_SUB_IMAGES = {
  Ngực: import.meta.glob("../../../assets/chest/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Lưng: import.meta.glob("../../../assets/lung/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Vai: import.meta.glob("../../../assets/vai/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Tay: import.meta.glob("../../../assets/tay/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Core: import.meta.glob("../../../assets/core/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Mông: import.meta.glob("../../../assets/mong/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Đùi: import.meta.glob("../../../assets/dui/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
  Chân: import.meta.glob("../../../assets/chan/**/*.{png,jpg,jpeg,webp}", {
    eager: true, query: "?url", import: "default",
  }),
};

// ========= Ảnh động tác (quét toàn bộ assets) =========
export const EXERCISE_IMAGES = import.meta.glob(
  "../../../assets/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Ảnh trong thư mục Lưng để ưu tiên khi group = Lưng =========
const BACK_FOLDER_IMAGES = import.meta.glob(
  "../../../assets/lung/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Utils =========
export function vxpNorm(s = "") {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function stemNorm(path = "") {
  const file = (path.split("/").pop() || "").toLowerCase();
  const stem = file.replace(/\.(png|jpe?g|webp)$/i, "");
  return vxpNorm(stem);
}
function endsWithAnyExt(p, base) {
  const stem = stemNorm(p);           // "leverngucday"
  const b = vxpNorm(base);            // "leverngucday"
  return stem === b || stem.endsWith(b);
}

// ✅ Ưu tiên exact theo STEM, sau đó includes theo STEM
function pickImageByKeyword(entriesObj, keyword) {
  if (!keyword) return null;
  const key = vxpNorm(keyword);
  const entries = Object.entries(entriesObj);

  // exact by stem
  const exact = entries.find(([p]) => stemNorm(p) === key);
  if (exact) return exact[1];

  // fuzzy by stem includes
  const hit = entries.find(([p]) => stemNorm(p).includes(key));
  return hit ? hit[1] : null;
}

// ========= Pin ảnh card cho 3 subgroup của Ngực (ảnh nằm ở assets/chest) =========
const CHEST_CARD_IMAGES = {
  nguctren:  "../../../assets/chest/nguctren.png",
  ngucgiua:  "../../../assets/chest/ngucgiua.png",
  ngucduoi:  "../../../assets/chest/ngucduoi.png",
};
const CHEST_CARD_ALIASES = {
  upperchest: "nguctren",
  upper:      "nguctren",
  midchest:   "ngucgiua",
  middlechest:"ngucgiua",
  mid:        "ngucgiua",
  lowerchest: "ngucduoi",
  lower:      "ngucduoi",
};

// ========= Ảnh trong thư mục Mông để ưu tiên khi group = Mông =========
const GLUTE_FOLDER_IMAGES = import.meta.glob(
  "../../../assets/mong/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Alias cho các bài Mông (gom stem) =========
// Key bên trái là dạng đã vxpNorm (không dấu/khoảng trắng/ký tự lạ)
const GLUTE_ALIAS = {
  // Seated hip abduction (máy/lever)
  seatedhipabductionmachine: "lever-seated-hip-abduction",
  seatedhipabduction:        "lever-seated-hip-abduction",
  leverseatedhipabduction:   "lever-seated-hip-abduction",
  hipabductionmachine:       "lever-seated-hip-abduction",

  // Band seated hip abduction
  bandseatedhipabduction:                "resistance-band-seated-hip-abduction",
  resistancebandseatedhipabduction:      "resistance-band-seated-hip-abduction",
  faststyleresistancebandseatedhipabduction: "fast-style-resistance-band-seated-hip-abduction",

  // Side-lying / side-bridge / standing abduction
  sidelyinghipabduction: "side-hip-abduction",
  sidehipabduction:      "side-hip-abduction",
  sidebridgehipabduction:"side-bridge-hip-abduction",
  straightlegouterhipabductor: "straight-leg-outer-hip-abductor",

  // Compound (Mông lớn)
  dumbbellsinglelegsquat:            "dumbbell-single-leg-squat",
  kettlebellgobletsquat:             "kettlebell-goblet-squat",
  dumbbellcontralateralforwardlunge: "dumbbell-contralateral-forward-lunge",
  barbellfullsquat:                  "barbell-full-squat-back-pov",
  squatonbosuball:                   "squat-on-bosu-ball",
  pushupinsidelegkick:               "push-up-inside-leg-kick",
  barbellcleanandpress:              "barbell-clean-and-press", // nếu có rơi nhầm vào mông
};
// ========= Ảnh trong thư mục Core (ƯU TIÊN khi group = Core) =========
const CORE_FOLDER_IMAGES = import.meta.glob(
  "../../../assets/core/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Alias cho Core/Obliques (gom theo stem đã vxpNorm) =========
const CORE_ALIAS = {
  // Pallof
  bandhorizontalpallofpress: "band-horizontal-pallof-press",
  pallofpress:               "band-horizontal-pallof-press",
  paloffpress:               "band-horizontal-pallof-press", // sai chính tả phổ biến
  horizontalpallofpress:     "band-horizontal-pallof-press",
  bandpallofpress:           "band-horizontal-pallof-press",

  // Side plank
  bodyweightinclinesideplank: "bodyweight-incline-side-plank",
  sideplank:                   "bodyweight-incline-side-plank",
  inclinesideplank:            "bodyweight-incline-side-plank",

  // Bottoms-up
  bottomsup: "bottoms-up",
  kbbottomsup: "bottoms-up",

  // Crunch
  leverseatedcrunch: "lever-seated-crunch",
  seatedcrunch:      "lever-seated-crunch",
  weightedcrunch:    "weighted-crunch",
  crunch:            "weighted-crunch",
  // ===== Rectus Abdominis =====
"bandstandingcrunch":     "band-standing-crunch",
"cableseatedcrunch":      "cable-seated-crunch",
"leverseatedcrunch":      "lever-seated-crunch",
"weightedcrunch":         "weighted-crunch",
"crunch":                 "weighted-crunch",

// ===== Serratus Anterior =====
"scapulapushup":                "scapula-push-up",
"inclinescapulapushup":         "incline-scapula-push-up",
"highstylescapulapushup":       "high-style-scapula-push-up",
"suspendedpushup":              "suspended-push-up",
"dumbbellinclineshoulderraise": "dumbbell-incline-shoulder-raise",
"barbellinclineshoulderraise":  "barbell-incline-shoulder-raise",
};
// ========= Ảnh NGỰC GIỮA riêng (map 1–1) =========
const MID_CHEST_IMAGES = import.meta.glob(
  "../../../assets/chest/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);
// ========= Map override cho 10 bài "Ngực giữa" =========
const MID_CHEST_OVERRIDE = {
  "tadondeclineclosegriptoskulldaypress": "decline close grip",
  "barbelldeclineclosegriptoskullpress": "decline close grip",
  "maydaycapinclineepngucflyonbongtapswissball": "incline ep nguc",
  "cableinclineflyonstabilityball": "incline ep nguc",
  "tadondaypresssitup": "ta don day sit up",
  "barbellpresssitup": "ta don day sit up",
  "leverngucdaypress": "lever nguc day",
  "leverchestpress": "lever nguc day",
  "closegriphitdat": "close grip hit dat",
  "closegrippushup": "close grip hit dat",
  "maydaycapstandingupstraightcrossovers": "standing up straight crossovers",
  "cablestandingupstraightcrossovers": "standing up straight crossovers",
  "mayhotrowidegripngucdipkneeling": "wide grip nguc dip",
  "assistedwidegripchestdipkneeling": "wide grip nguc dip",
  "ngucdiponstraightbar": "nguc dip on straight bar",
  "chestdiponstraightbar": "nguc dip on straight bar",
  "tadonfrontnangandpullover": "nang and pullover",
  "barbellfrontraiseandpullover": "nang and pullover",
  "fullplanchehitdat": "full planche",
  "fullplanchepushup": "full planche",
};

// ========= Alias cho các bài Lưng (gom stem) =========
const BACK_ALIAS = {
  pullupwide: "pullupwide",
  widegrippullup: "pullupwide",
  chinup: "chinup",
  sidetosidechin: "sidetosidechin",
  sidetosidechinup: "sidetosidechin",
  archerpullup: "archerkeoxa",
  archerchinup: "archerkeoxa",
  archerkeoxa: "archerkeoxa",

  assistedpullup: "khanglucmayhotrokeoxa",
  bandassistedpullup: "khanglucmayhotrokeoxa",
  resistanceassistedpullup: "khanglucmayhotrokeoxa",
  khanglucmayhotrokeoxa: "khanglucmayhotrokeoxa",

  latpulldown: "latpulldown",
  cablelatpulldown: "latpulldown",
  pulldown: "latpulldown",
  leverfrontpulldown: "leverfrontpulldown",
  machinefrontpulldown: "leverfrontpulldown",
  frontpulldown: "leverfrontpulldown",
  reversegriplatpulldown: "reversegripmachinelatpulldown",
  reversegripmachinelatpulldown: "reversegripmachinelatpulldown",

  barbellrow: "barbellrow",
  bentoverbarbellrow: "barbellrow",
  onearmdumbbellrow: "onearmdbrow",
  onearmdbrow: "onearmdbrow",

  lyingcablepullover: "maydaycaplyingduoipullover",
  cablelyingpullover: "maydaycaplyingduoipullover",
  pullover: "maydaycaplyingduoipullover",

  onearmagainstwall: "onearmagainstwall",
  standinglateralstretch: "standinglateralstretch",
  exerciseballalternatingarmups: "exerciseballalternatingarmups",
  kicklungonexerciseball: "kicklungonexerciseball",

   // --- Lưng Thang / Trapezius & scapula control ---
  bandshrug: "bandshrug",
  shrug: "bandshrug",
  dbshrug: "bandshrug",
  dumbbellshrug: "bandshrug",

  cablestandingshoulderexternalrotation: "cable-standing-shoulder-external-rotation",
  standingshoulderexternalrotation: "cable-standing-shoulder-external-rotation",
  externalrotationstanding: "cable-standing-shoulder-external-rotation",

  cablesupinereversefly: "cable-supine-reverse-fly",
  supinereversefly: "cable-supine-reverse-fly",
  cablereversefly: "cable-supine-reverse-fly",

  dumbbellinclinetraise: "dumbbell-incline-t-raise",
  tincline: "dumbbell-incline-t-raise",

  dumbbellrotationreversefly: "dumbbell-rotation-reverse-fly",
  rotationreversefly: "dumbbell-rotation-reverse-fly",

  dumbbellsinglearmoverheadcarry: "dumbbell-single-arm-overhead-carry",
  overheadcarry: "dumbbell-single-arm-overhead-carry",
  farmercarryoverhead: "dumbbell-single-arm-overhead-carry",

  dumbbelluprightshoulderexternalrotation: "dumbbell-upright-shoulder-external-rotation",
  uprightshoulderexternalrotation: "dumbbell-upright-shoulder-external-rotation",

  smithinclineshoulderraises: "smith-incline-shoulder-raises",
  shoulderraisesinclinesmith: "smith-incline-shoulder-raises",

  sidepushneckstretch: "side-push-neck-stretch",
  neckstretchsidepush: "side-push-neck-stretch",
};
// ========= Ảnh trong thư mục Vai để ưu tiên khi group = Vai =========
const SHOULDER_FOLDER_IMAGES = import.meta.glob(
  "../../../assets/vai/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Alias cho Vai (map stem) =========
const SHOULDER_ALIAS = {
  
  // Rear / high row / crossover / pulldown biến thể
  cablerearpulldown: "cable-rear-pulldown",
  rearpulldown: "cable-rear-pulldown",

  cableseatedhighrowvbar: "cable-seated-high-row-v-bar",
  seatedhighrowvbar: "cable-seated-high-row-v-bar",
  highrowvbar: "cable-seated-high-row-v-bar",

  cablestandingcrossoverhighreverse: "cable-standing-cross-over-high-reverse",
  standingcrossoverhighreverse: "cable-standing-cross-over-high-reverse",

  cablecrossoverlateralpulldown: "cable-cross-over-lateral-pulldown",
  crossoverlateralpulldown: "cable-cross-over-lateral-pulldown",

  leverhighrow: "lever-high-row",
  highrow: "lever-high-row",

  leverreversegriplateralpulldown: "lever-reverse-grip-lateral-pulldown",
  reversegriplateralpulldown: "lever-reverse-grip-lateral-pulldown",

  smithnarrowrow: "smith-narrow-row",
  narrowsmithrow: "smith-narrow-row",

  twinhandleparallelgriplatpulldown: "twin-handle-parallel-grip-lat-pulldown",
  parallelgriplatpulldown: "twin-handle-parallel-grip-lat-pulldown",

  girondasternumchin: "gironda-sternum-chin",

  anteriordeltoid: "anterior deltoid",
  lateraldeltoid: "lateral deltoid",
  posteriordeltoid: "posterior deltoid",
    // ==== Chop/Xoay (rotator cuff & lateral raise có hỗ trợ) ====
    cableseatedshoulderinternalrotation: "cable-seated-shoulder-internal-rotation",
  dumbbelllyingexternalshoulderrotation: "dumbbell-lying-external-shoulder-rotation",
  pronedumbbelluprightshoulderexternalrotation: "prone-dumbbell-upright-shoulder-external-rotation",
  dumbbellonearmlateralraisewithsupport: "dumbbell-one-arm-lateral-raise-with-support",
  // (tuỳ chọn) vài biến thể tên hay gặp
  shoulderinternalrotation: "cable-seated-shoulder-internal-rotation",
  shoulderexternalrotation: "dumbbell-lying-external-shoulder-rotation",
  sidelyingexternalrotation: "dumbbell-lying-external-shoulder-rotation",
  lateralraisewithsupport: "dumbbell-one-arm-lateral-raise-with-support",
};
// ========= Ảnh trong thư mục Tay để ưu tiên khi group = Tay =========
const ARM_FOLDER_IMAGES = import.meta.glob(
  "../../../assets/tay/**/*.{png,jpg,jpeg,webp}",
  { eager: true, query: "?url", import: "default" }
);

// ========= Alias cho Nhị đầu cánh tay (map theo stem đã vxpNorm) =========
const ARM_ALIAS = {
  "barbellwristcurl": "barbell-wrist-curl",
  "cablereverseonearmcurl": "cable-reverse-one-arm-curl",
  "dumbbellhammercurlswitharmblaster": "dumbbell-hammer-curls-with-arm-blaster",
  "dumbbellinclinebicepscurl": "dumbbell-incline-biceps-curl",
  "dumbbellseatedbicepscurltoshoulderpress": "dumbbell-seated-biceps-curl-to-shoulder-press",
  "dumbbellseatedinnerbicepscurl": "dumbbell-seated-inner-biceps-curl",
  "invertedrowbentknees": "inverted-row-bent-knees",
  "kettlebelldoublealternatinghangclean": "kettlebell-double-alternating-hang-clean",

  // file hàng xóm nhưng có thể rơi vào biceps
  "barbellreversegripinclinebenchrow": "barbell-reverse-grip-incline-bench-row",

  // biến thể tên hay gặp
  "reverseonearmcurl": "cable-reverse-one-arm-curl",
  "reversecurl": "cable-reverse-one-arm-curl",
  "hammercurlsarmblaster": "dumbbell-hammer-curls-with-arm-blaster",
  "innerbicepscurl": "dumbbell-seated-inner-biceps-curl",
  "inclinecurl": "dumbbell-incline-biceps-curl",
  "wristcurl": "barbell-wrist-curl",

  // ==== CanhTayTruoc (Forearm / Wrist curl) ====
  "barbellpalmsdownwristcurloverabench": "barbell-palms-down-wrist-curl-over-a-bench",
  "barbellreversewristcurl": "barbell-reverse-wrist-curl",
  "barbellreversewristcurlv2": "barbell-revers-wrist-curl-v-2", 
  "barbellwristcurlv2": "barbell-wrist-curl-v-2",
  "cablewristcurl": "cable-wrist-curl",

  "dumbbellonearmseatedneutralwristcurl": "dumbbell-one-arm-seated-neutral-wrist-curl",
  "dumbbelloverbenchonearmreversewristcurl": "dumbbell-over-bench-one-arm-reverse-wrist-curl",

  // tên file bị thiếu chữ 'e' trong 'reverse'
  "dumbbelloverbenchreverswristcurl": "dumbbell-over-bench-revers-wrist-curl",

  "smithseatedwristcurl": "smith-seated-wrist-curl",

  // alias ngắn
  "reversewristcurl": "barbell-reverse-wrist-curl",
  "wristcurlv2": "barbell-wrist-curl-v-2",
  "wristcurlcable": "cable-wrist-curl",
  "neutralwristcurl": "dumbbell-one-arm-seated-neutral-wrist-curl"
};

// ========= Ảnh subgroup (card) =========
export function vxpGetSubImage(main, subgroup) {
  // Pin ảnh card cố định cho 3 subgroup của Ngực
  if (main === "Ngực") {
    let key =
      vxpNorm(subgroup?.name) ||
      vxpNorm(subgroup?.slug) ||
      vxpNorm(subgroup?.name_en) ||
      "";
    key = CHEST_CARD_ALIASES[key] || key; // map upper/mid/lower → vi
    const fixedPath = CHEST_CARD_IMAGES[key];
    if (fixedPath && VXP_SUB_IMAGES["Ngực"][fixedPath]) {
      return VXP_SUB_IMAGES["Ngực"][fixedPath];
    }
  }

  const bank = VXP_SUB_IMAGES[main] || {};
  const entries = Object.entries(bank);
  if (!subgroup) return null;

  const folderRaw = (subgroup?.slug || subgroup?.name_en || subgroup?.name || "").toString().trim();
  const lc = folderRaw.toLowerCase();
  const guess1 = lc.replace(/\s+/g, "");
  const guess2 = lc.replace(/\s+/g, "-");

  const inFolder = entries.filter(([p]) => {
    const lp = p.toLowerCase();
    return (
      lp.includes("/assets/") &&
      (lp.includes(`/${lc}/`) || lp.includes(`/${guess1}/`) || lp.includes(`/${guess2}/`))
    );
  });

  if (inFolder.length) {
    const preview = inFolder.find(([p]) => p.toLowerCase().includes("preview"));
    if (preview) return preview[1];

    const exact = inFolder.find(([p]) => {
      const sn = stemNorm(p);
      return sn === vxpNorm(folderRaw) || sn.includes(vxpNorm(folderRaw));
    });
    if (exact) return exact[1];

    return inFolder.sort(([a], [b]) => a.localeCompare(b))[0][1];
  }

  const candidates = [subgroup?.slug, subgroup?.name_en, subgroup?.name].filter(Boolean);
  for (const c of candidates) {
    const exact = entries.find(([p]) => endsWithAnyExt(p, vxpNorm(c)));
    if (exact) return exact[1];
  }
  for (const c of candidates) {
    const hit = entries.find(([p]) => vxpNorm(p).includes(vxpNorm(c)));
    if (hit) return hit[1];
  }
  return null;
}

// ========= Ảnh bài tập cụ thể =========
export function vxpGetExerciseImage(ex, groupName) {
  if (!ex) return null;

  const allEntries = Object.entries(EXERCISE_IMAGES);
  const candidates = [vxpNorm(ex?.slug), vxpNorm(ex?.name_en), vxpNorm(ex?.name)].filter(Boolean);

  // ==== Ngực giữa (override) ====
  for (const c of candidates) {
    const overrideKey = MID_CHEST_OVERRIDE[c];
    if (overrideKey) {
      const img = pickImageByKeyword(MID_CHEST_IMAGES, overrideKey);
      if (img) return img;
    }
  }

  // ==== Lưng ====
  const isBackGroup =
    vxpNorm(groupName) === "lung" ||
    vxpNorm(ex?.MuscleGroup?.name || "").includes("lung") ||
    candidates.some((c) => c.includes("lat") || c.includes("back"));

  if (isBackGroup) {
    const backEntries = Object.entries(BACK_FOLDER_IMAGES).map(([p, url]) => [stemNorm(p), url]);
    const backKeys = candidates.map((n) => BACK_ALIAS[n] || n);

    for (const k of backKeys) {
      const exact = backEntries.find(([stem]) => stem === k);
      if (exact) return exact[1];
    }
    for (const k of backKeys) {
      const hit = backEntries.find(([stem]) => stem.includes(k));
      if (hit) return hit[1];
    }
  }

  // ==== Vai ====
  const isShoulderGroup =
    vxpNorm(groupName) === "vai" ||
    vxpNorm(ex?.MuscleGroup?.name || "").includes("vai") ||
    candidates.some((c) => c.includes("deltoid") || c.includes("shoulder"));

  if (isShoulderGroup) {
    const shoulderEntries = Object.entries(SHOULDER_FOLDER_IMAGES).map(([p, url]) => [stemNorm(p), url]);
    const shoulderKeys = candidates.map((n) => SHOULDER_ALIAS[n] || n);

    for (const k of shoulderKeys) {
      const exact = shoulderEntries.find(([stem]) => stem === k);
      if (exact) return exact[1];
    }
    for (const k of shoulderKeys) {
      const hit = shoulderEntries.find(([stem]) => stem.includes(k));
      if (hit) return hit[1];
    }
  }

  // ==== Mông (GLUTES) –– bổ sung mới ====
  const isGluteGroup =
    vxpNorm(groupName) === "mong" ||
    vxpNorm(ex?.MuscleGroup?.name || "").includes("mong") ||
    vxpNorm(ex?.MuscleGroup?.name_en || "").includes("glute") ||
    // fallback từ khoá
    ["glute", "abduction", "kickback", "hipthrust"].some(k =>
      (vxpNorm(ex?.slug || "") + vxpNorm(ex?.name_en || "") + vxpNorm(ex?.name || "")).includes(k)
    );

  if (isGluteGroup) {
    const gluteEntries = Object.entries(GLUTE_FOLDER_IMAGES).map(([p, url]) => [stemNorm(p), url]);
    const gluteKeys = candidates.map((n) => (GLUTE_ALIAS?.[n] || n));

    // exact theo stem
    for (const k of gluteKeys) {
      const exact = gluteEntries.find(([stem]) => stem === k);
      if (exact) return exact[1];
    }
    // fuzzy theo stem
    for (const k of gluteKeys) {
      const hit = gluteEntries.find(([stem]) => stem.includes(k));
      if (hit) return hit[1];
    }
  }
const isCoreGroup =
  vxpNorm(groupName) === "core" ||
  vxpNorm(ex?.MuscleGroup?.name || "").includes("core") ||
  // fallback theo từ khóa
  ["oblique","pallof","plank","crunch","antirotation","sidebend"].some(k =>
    (vxpNorm(ex?.slug||"") + vxpNorm(ex?.name_en||"") + vxpNorm(ex?.name||"")).includes(k)
  );

if (isCoreGroup) {
  const coreEntries = Object.entries(CORE_FOLDER_IMAGES).map(([p, url]) => [stemNorm(p), url]);
  const coreKeys = candidates.map((n) => CORE_ALIAS[n] || n);

  for (const k of coreKeys) {
    const exact = coreEntries.find(([stem]) => stem === k);
    if (exact) return exact[1];
  }
  for (const k of coreKeys) {
    const hit = coreEntries.find(([stem]) => stem.includes(k));
    if (hit) return hit[1];
  }
}
  // ==== Alias chung (fallback toàn bộ assets) ====
  const aliasMap = {
    dumbbellarnoldpressv2: "dumbbellarnoldpress",
    arnoldpressv2: "arnoldpress",
    arnoldpresswithstrength: "arnoldpress",
    levermilitarypresswithstrength: "levermilitarypress",
    militarypresswithstrength: "levermilitarypress",
  };
  const normalized = candidates.map((c) => aliasMap[c] || c);

  for (const c of normalized) {
    const exact = allEntries.find(([p]) => endsWithAnyExt(p, c));
    if (exact) return exact[1];
  }
  for (const c of normalized) {
    const hit = allEntries.find(([p]) => vxpNorm(p).includes(c));
    if (hit) return hit[1];
  }

  return null;
}
