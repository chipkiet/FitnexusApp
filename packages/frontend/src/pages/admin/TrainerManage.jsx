// src/pages/admin/TrainerManage.jsx
import React from "react";
import chestImg from "../../assets/muscles/chest.png";
import lungImg  from "../../assets/muscles/lung.png";
import vaiImg   from "../../assets/muscles/vai.png";
import tayImg   from "../../assets/muscles/tay.png";
import coreImg  from "../../assets/muscles/core.png";
import mongImg  from "../../assets/muscles/mong.png";
import duiImg   from "../../assets/muscles/dui.png";
import chanImg  from "../../assets/muscles/chan.png";

export default function VXPTrainerManage() {
  const API = import.meta.env.VITE_API_URL || "";

  // dùng URLSearchParams “thủ công” để điều khiển ?group
  const [searchParams, setSearchParams] = React.useState(
    new URLSearchParams(window.location.search)
  );
  const groupFromURL = Number(searchParams.get("group")) || null;

  const [groups, setGroups] = React.useState([]);
  const [groupsLoading, setGroupsLoading] = React.useState(true);
  const [groupsError, setGroupsError] = React.useState("");

  const [mainGroup, setMainGroup] = React.useState(null); // Ngực | Lưng | Vai | Tay | Core | Mông | Đùi | Chân

  const [exercises, setExercises] = React.useState([]);
  const [exLoading, setExLoading] = React.useState(false);
  const [exError, setExError] = React.useState("");
  const [q, setQ] = React.useState("");

  // Ảnh cho nhóm chính
  const MAIN_GROUP_IMAGES = {
    Ngực: chestImg,
    Lưng: lungImg,
    Vai:  vaiImg,
    Tay:  tayImg,
    Core: coreImg,
    Mông: mongImg,
    Đùi:  duiImg,
    Chân: chanImg,
  };

  // Ảnh cho nhóm con – tự quét tất cả .png trong từng thư mục
// Ảnh cho nhóm con – dùng query '?url'
const SUB_IMAGES = {
  Ngực: import.meta.glob("../../assets/chest/*.png", { eager: true, query: "?url", import: "default" }),
  Lưng: import.meta.glob("../../assets/lung/*.png",  { eager: true, query: "?url", import: "default" }),
  Vai:  import.meta.glob("../../assets/vai/*.png",   { eager: true, query: "?url", import: "default" }),
  Tay:  import.meta.glob("../../assets/tay/*.png",   { eager: true, query: "?url", import: "default" }),
  Core: import.meta.glob("../../assets/core/*.png",  { eager: true, query: "?url", import: "default" }),
  Mông: import.meta.glob("../../assets/mong/*.png",  { eager: true, query: "?url", import: "default" }),
  Đùi:  import.meta.glob("../../assets/dui/*.png",   { eager: true, query: "?url", import: "default" }),
  Chân: import.meta.glob("../../assets/chan/*.png",  { eager: true, query: "?url", import: "default" }),
};


  // chuẩn hóa chuỗi để match tên ảnh
  function norm(s = "") {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "");
  }

  // chọn ảnh cho 1 nhóm con dựa theo mainGroup + title/slug
  function getSubImage(main, subgroup) {
    const bank = SUB_IMAGES[main] || {};
    const entries = Object.entries(bank); // [[fullPath, url], ...]

    const candidates = [
      norm(subgroup?.slug),
      norm(subgroup?.name_en),
      norm(subgroup?.name),
    ].filter(Boolean);

    // ưu tiên khớp đầy đủ
    for (const c of candidates) {
      const hit = entries.find(([p]) => norm(p).includes(c));
      if (hit) return hit[1];
    }
    // fallback: thử theo token
    const tokens = candidates.join(" ").match(/[a-z0-9]+/g) || [];
    for (const t of tokens) {
      const hit = entries.find(([p]) => norm(p).includes(t));
      if (hit) return hit[1];
    }
    return null;
  }

  // ====== lấy danh sách nhóm cơ ======
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setGroupsLoading(true);
        const res = await fetch(`${API}/api/trainer/muscle-groups`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setGroups(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setGroupsError("Không tải được danh sách nhóm cơ.");
      } finally {
        if (mounted) setGroupsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [API]);

  // ====== gom nhóm về 8 nhóm chính ======
  const MAIN_GROUPS = ["Ngực", "Lưng", "Vai", "Tay", "Core", "Mông", "Đùi", "Chân"];

  const KEYWORDS = {
    Ngực: ["ngực","chest","pectoralis","pec","upper chest","mid chest","lower chest","upper-chest","mid-chest","lower-chest"],
    Lưng: ["lưng","back","latissimus","lats","latissimus dorsi","trapezius","traps","rhomboid","erector spinae","rear back"],
    Vai: [
  "vai","shoulder","deltoid","delt",
  "anterior deltoid","posterior deltoid","medial deltoid",
  "rear delt","front delt","side delt",
  // ↓ thêm 2 dòng này
  "rotator cuff","chóp xoay"
],
    Tay:  ["tay","arm","biceps","triceps","brachialis","brachioradialis","forearm","wrist flexors","wrist extensors","cẳng tay"],
    Core: ["core","abs","abdominal","oblique","obliques","transversus","tva","rectus abdominis","bụng","xiên"],
    Mông: ["mông","glute","glutes","gluteus","gluteus maximus","gluteus medius","gluteus minimus","glute max","glute med","glute min","hip thrust","bridge"],
    Đùi:  ["đùi","quad","quadriceps","hamstring","hamstrings","adductor","adductors","vastus","rectus femoris","biceps femoris","semimembranosus","hip flexor","hip flexors","gập háng","semitendinosus","hip adductor"],
    Chân: ["chân","leg","legs","calf","calves","gastrocnemius","soleus","tibialis","tibialis anterior","bắp chân","cơ dép","chày trước"],
  };

  function classifyToMain(group) {
    const hay = `${group?.name || ""} ${group?.name_en || ""} ${group?.slug || ""}`.toLowerCase();
    if (hay.includes("delt")) return "Vai";

    const exactToGlutes = new Set(["mông lớn","gluteus maximus","mông trung","gluteus medius","mông bé","gluteus minimus"]);
    if ([group?.name, group?.name_en, group?.slug].some(t => exactToGlutes.has((t||"").toLowerCase()))) return "Mông";

    const exactToThigh = new Set(["tứ đầu đùi","quadriceps","gân kheo","hamstrings","khép háng","hip adductors","adductors"]);
    if ([group?.name, group?.name_en, group?.slug].some(t => exactToThigh.has((t||"").toLowerCase()))) return "Đùi";

    const exactToLeg = new Set(["cơ bụng chân","gastrocnemius","cơ dép","soleus","chày trước","tibialis anterior"]);
    if ([group?.name, group?.name_en, group?.slug].some(t => exactToLeg.has((t||"").toLowerCase()))) return "Chân";

    for (const main of MAIN_GROUPS) {
      const keys = KEYWORDS[main];
      if (keys.some(k => hay.includes(k))) return main;
    }
    if (MAIN_GROUPS.includes(group?.name)) return group.name;
    return "Core";
  }

  const grouped = React.useMemo(() => {
    const bucket = MAIN_GROUPS.reduce((acc, k) => (acc[k] = [], acc), {});
    for (const g of groups) {
      const main = classifyToMain(g);
      bucket[MAIN_GROUPS.includes(main) ? main : "Core"].push(g);
    }
    return bucket;
  }, [groups]);

  const subGroupsOfMain = React.useMemo(() => {
    if (!mainGroup) return [];
    return (grouped[mainGroup] || []).filter(g => g.name !== mainGroup);
  }, [grouped, mainGroup]);

  // ====== lấy bài tập khi chọn nhóm con ======
  React.useEffect(() => {
    if (!groupFromURL) { setExercises([]); return; }
    let mounted = true;
    (async () => {
      try {
        setExLoading(true); setExError("");
        const res = await fetch(`${API}/api/trainer/muscle-groups/${groupFromURL}/exercises`, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setExercises(Array.isArray(data?.Exercises) ? data.Exercises : []);
      } catch (e) {
        console.error(e);
        if (mounted) setExError("Không tải được bài tập của nhóm cơ.");
      } finally {
        if (mounted) setExLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [API, groupFromURL]);

  // ====== search + phân trang cho bài tập ======
  const [exPage, setExPage] = React.useState(1);
  const exPerPage = 15;
  React.useEffect(() => { setExPage(1); }, [q, groupFromURL, exercises.length]);

  const filteredExercises = React.useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return exercises;
    return exercises.filter(ex =>
      [ex?.name, ex?.name_en, ex?.slug].some(t => (t || "").toLowerCase().includes(kw))
    );
  }, [q, exercises]);

  const exTotalPages = Math.max(1, Math.ceil(filteredExercises.length / exPerPage));
  const exStart = (exPage - 1) * exPerPage;
  const exPageItems = filteredExercises.slice(exStart, exStart + exPerPage);
  const goExPage = (p) => setExPage(Math.min(exTotalPages, Math.max(1, p)));

  // ====== điều khiển ?group ======
  const setSearch = (obj, options) => {
    const sp = new URLSearchParams(obj);
    setSearchParams(sp);
    const url = `${window.location.pathname}?${sp.toString()}`;
    window.history[options?.replace ? "replaceState" : "pushState"]({}, "", url);
  };

  const goBack = () => {
    if (groupFromURL) setSearch({}, { replace: true });
    else if (mainGroup) setMainGroup(null);
  };

  // ====== UI ======

  // 1) chọn NHÓM CHÍNH (nút to + ảnh bên phải)
  if (!mainGroup && !groupFromURL) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Chọn nhóm cơ chính</h2>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {MAIN_GROUPS.map((m) => (
            <button
              key={m}
              onClick={() => setMainGroup(m)}
              className="group w-full rounded-xl border-2 p-5 h-24 sm:h-28
                         flex items-center justify-between gap-4
                         hover:bg-gray-50 hover:shadow-md transition"
            >
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-semibold truncate">{m}</div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {grouped[m]?.length
                    ? `${grouped[m].length - (grouped[m].some((g) => g.name === m) ? 1 : 0)} nhóm con`
                    : "0 nhóm con"}
                </div>
              </div>

              {MAIN_GROUP_IMAGES[m] && (
                <img
                  src={MAIN_GROUP_IMAGES[m]}
                  alt={m}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain pointer-events-none
                             translate-x-1 group-hover:translate-x-0 transition-transform"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>

        {groupsLoading && <div className="text-sm text-gray-500">Đang tải nhóm cơ…</div>}
        {groupsError && <div className="text-sm text-red-600">{groupsError}</div>}
      </div>
    );
  }

  // 2) chọn NHÓM CON (có ảnh bên phải nếu tìm được)
  if (mainGroup && !groupFromURL) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="px-3 py-1.5 rounded border hover:bg-gray-50">← Back</button>
          <h2 className="text-lg font-semibold">Chọn nhóm nhỏ của {mainGroup}</h2>
        </div>

        {subGroupsOfMain.length === 0 ? (
          <div className="text-sm text-gray-500">Không tìm thấy nhóm con phù hợp.</div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {subGroupsOfMain.map((g) => {
              const img = getSubImage(mainGroup, g);
              return (
                <button
                  key={g.muscle_group_id}
                  onClick={() => setSearch({ group: String(g.muscle_group_id) })}
                  className="text-left rounded-xl border-2 p-5 h-24 sm:h-28
                             flex items-center justify-between gap-4
                             hover:bg-gray-50 hover:shadow-md transition"
                  title={g.name_en ? `${g.name} (${g.name_en})` : g.name}
                >
                  <div className="min-w-0">
                    <div className="font-medium text-base sm:text-lg truncate">{g.name}</div>
                    {g.name_en && <div className="text-xs text-gray-500 truncate">{g.name_en}</div>}
                    {g.description && (
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">{g.description}</p>
                    )}
                  </div>

                  {img && (
                    <img
                      src={img}
                      alt={g.name}
                      className="h-16 w-16 sm:h-20 sm:w-20 object-contain pointer-events-none
                                 translate-x-1 group-hover:translate-x-0 transition-transform"
                      loading="lazy"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3) DANH SÁCH BÀI TẬP (1 bài/1 dòng + phân trang)
  const selectedGroup = groups.find(g => g.muscle_group_id === groupFromURL);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="px-3 py-1.5 rounded border hover:bg-gray-50">← Back</button>
          <h2 className="text-lg font-semibold">
            {selectedGroup
              ? `Bài tập cho: ${selectedGroup.name}${selectedGroup.name_en ? ` (${selectedGroup.name_en})` : ""}`
              : "Bài tập"}
          </h2>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm bài tập (tên/slug)…"
          className="w-72 rounded-md border px-3 py-2 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="rounded-lg border bg-white">
        {exLoading ? (
          <div className="p-4 text-sm text-gray-500">Đang tải bài tập…</div>
        ) : exError ? (
          <div className="p-4 text-sm text-red-600">{exError}</div>
        ) : filteredExercises.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Không có bài tập phù hợp.</div>
        ) : (
          <>
            <ul className="divide-y">
              {exPageItems.map((ex) => (
                <li key={ex.exercise_id} className="p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{ex.name}</div>
                      {ex.name_en && <div className="text-xs text-gray-500 truncate">{ex.name_en}</div>}
                      {ex.slug && <div className="text-xs text-gray-400 truncate">slug: {ex.slug}</div>}
                    </div>
                    {ex.ExerciseMuscleGroup && (
                      <div className="text-xs text-right shrink-0 text-gray-600">
                        <div><span className="text-gray-500">Impact:</span> {ex.ExerciseMuscleGroup.impact_level || "-"}</div>
                        <div><span className="text-gray-500">Intensity%:</span> {ex.ExerciseMuscleGroup.intensity_percentage ?? "-"}</div>
                      </div>
                    )}
                  </div>
                  {ex.description && <p className="mt-1 text-sm text-gray-700 line-clamp-2">{ex.description}</p>}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between p-3 border-t">
              <button
                onClick={() => goExPage(exPage - 1)}
                disabled={exPage === 1}
                className="px-3 py-1.5 rounded border disabled:opacity-50"
              >
                ← Prev
              </button>
              <div className="text-sm">
                Trang <span className="font-semibold">{exPage}</span> / {exTotalPages}
              </div>
              <button
                onClick={() => goExPage(exPage + 1)}
                disabled={exPage >= exTotalPages}
                className="px-3 py-1.5 rounded border disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
