
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../../assets/logo.png";
import absIcon from "../../assets/body/coreIcon.svg";
import backIcon from "../../assets/body/backIcon.svg";
import bicepsIcon from "../../assets/body/bicepsIcon.svg";
import cardioIcon from "../../assets/body/cardioIcon.svg";
import chestIcon from "../../assets/body/chestIcon.svg";
import forearmsIcon from "../../assets/body/forearmsIcon.svg";
import glutesIcon from "../../assets/body/glutesIcon.svg";
import shouldersIcon from "../../assets/body/shouldersIcon.svg";
import tricepsIcon from "../../assets/body/tricepsIcon.svg";
import upperLegsIcon from "../../assets/body/upperLegsIcon.svg";
import lowerLegsIcon from "../../assets/body/lowerLegsIcon.svg";

import ExerciseList from "../../components/ExerciseList.jsx";

export default function Exercises(props) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const muscleGroups = [
    { id: "abs", label: "Abs", icon: absIcon },
    { id: "back", label: "Back", icon: backIcon },
    { id: "biceps", label: "Biceps", icon: bicepsIcon },
    { id: "cardio", label: "Cardio", icon: cardioIcon },
    { id: "chest", label: "Chest", icon: chestIcon },
    { id: "forearms", label: "Forearms", icon: forearmsIcon },
    { id: "glutes", label: "Glutes", icon: glutesIcon },
    { id: "shoulders", label: "Shoulders", icon: shouldersIcon },
    { id: "triceps", label: "Triceps", icon: tricepsIcon },
    { id: "upper-legs", label: "Upper Legs", icon: upperLegsIcon },
    { id: "lower-legs", label: "Lower Legs", icon: lowerLegsIcon },
  ];

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [level, setLevel] = useState("");
  const [impact, setImpact] = useState("");
  const [population, setPopulation] = useState("");
  const [search, setSearch] = useState("");

  const rawExercises = useMemo(() => {
    if (Array.isArray(props?.exercises)) return props.exercises;
    if (Array.isArray(state?.exercises)) return state.exercises;
    if (typeof window !== "undefined" && Array.isArray(window.__EXERCISES__)) {
      return window.__EXERCISES__;
    }
    return [];
  }, [props?.exercises, state?.exercises]);

  const fieldMap = props?.fieldMap || {
    id: ["id", "_id", "uuid"],
    name: ["name", "title"],
    image: ["imageUrl", "gifUrl", "image", "img"],
    description: ["description", "desc"],
    level: ["level", "difficulty", "experience", "skillLevel"],
    impact: ["impact", "impact_level", "impactLevel", "mechanic", "force"],
    population: ["population", "gender", "targetPopulation"],
    bodyParts: [
      "bodyPart",
      "target",
      "muscle",
      "muscles",
      "primaryMuscles",
      "secondaryMuscles",
      "muscle_target",
    ],
  };

  const groupSynonyms = {
    "abs": ["abs", "abdominals", "core", "stomach"],
    "back": ["back", "lats", "latissimus", "lower back", "upper back"],
    "biceps": ["biceps"],
    "cardio": ["cardio", "aerobic"],
    "chest": ["chest", "pectorals", "pecs"],
    "forearms": ["forearms", "forearm"],
    "glutes": ["glutes", "glute", "butt", "gluteus"],
    "shoulders": ["shoulders", "delts", "deltoids"],
    "triceps": ["triceps"],
    "upper-legs": [
      "upper legs",
      "quadriceps",
      "quads",
      "hamstrings",
      "thighs",
      "adductors",
      "abductors",
    ],
    "lower-legs": ["lower legs", "calves", "calf", "gastrocnemius", "soleus"],
  };

  const pickFirst = (obj, keys) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (v != null) return v;
    }
    return undefined;
  };

  const normalizeStr = (v) =>
    String(v || "")
      .toLowerCase()
      .trim();

  const toArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    return [v];
  };

  const normalized = useMemo(() => {
    return rawExercises.map((ex) => {
      const id = pickFirst(ex, fieldMap.id);
      const name = pickFirst(ex, fieldMap.name);
      const image = pickFirst(ex, fieldMap.image);
      const description = pickFirst(ex, fieldMap.description);
      const levelVal = pickFirst(ex, fieldMap.level);
      const impactVal = pickFirst(ex, fieldMap.impact);
      const populationVal = pickFirst(ex, fieldMap.population);
      const partsRaw = toArray(pickFirst(ex, fieldMap.bodyParts));

      const parts = partsRaw
        .flatMap((p) => toArray(p))
        .map((p) => normalizeStr(p).replace(/_/g, " "))
        .filter(Boolean);

      return {
        id: id ?? name ?? Math.random().toString(36).slice(2),
        name: name ?? "",
        imageUrl: image ?? "",
        description: description ?? "",
        difficulty: levelVal ?? "",
        impact: impactVal ?? "",
        population: populationVal ?? "",
        parts,
        __raw: ex,
      };
    });
  }, [rawExercises]);

  const optionSets = useMemo(() => {
    const levels = new Set();
    const impacts = new Set();
    const populations = new Set();
    for (const ex of normalized) {
      if (ex.difficulty) levels.add(String(ex.difficulty));
      if (ex.impact) impacts.add(String(ex.impact));
      if (ex.population) populations.add(String(ex.population));
    }
    return {
      levels: Array.from(levels),
      impacts: Array.from(impacts),
      populations: Array.from(populations),
    };
  }, [normalized]);

  const matchesGroup = (ex, groupId) => {
    if (!groupId) return true;
    const synonyms = groupSynonyms[groupId] || [groupId];
    const tokens = ex.parts || [];
    for (const t of tokens) {
      for (const s of synonyms) {
        const ss = normalizeStr(s).replace(/-/g, " ");
        if (t.includes(ss)) return true;
      }
    }
    return false;
  };

  const filtered = useMemo(() => {
    const q = normalizeStr(search);
    return normalized.filter((ex) => {
      if (selectedGroup && !matchesGroup(ex, selectedGroup)) return false;
      if (level && normalizeStr(ex.difficulty) !== normalizeStr(level)) return false;
      if (impact && normalizeStr(ex.impact) !== normalizeStr(impact)) return false;
      if (population && normalizeStr(ex.population) !== normalizeStr(population)) return false;
      if (q && !normalizeStr(ex.name).includes(q)) return false;
      return true;
    });
  }, [normalized, selectedGroup, level, impact, population, search]);

  const clearFilters = () => {
    setSelectedGroup(null);
    setLevel("");
    setImpact("");
    setPopulation("");
    setSearch("");
  };

  return (
    <div className="min-h-screen text-black bg-white">
      <header className="border-b border-gray-200">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <button className="shrink-0" onClick={() => navigate("/")}> 
            <img src={logo} alt="logo" className="h-36" />
          </button>
          <nav className="items-center hidden gap-6 text-sm text-gray-700 md:flex">
            <button onClick={() => navigate("/modeling-preview")} className="hover:underline">
              Mô hình hoá
            </button>
            <button onClick={() => navigate("/exercises")} className="hover:underline">
              Thư viện tập
            </button>
            <button onClick={() => navigate("/nutrition-ai")} className="hover:underline">
              Dinh dưỡng
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/login")} className="text-sm hover:underline">
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 mx-auto max-w-7xl">
        <h1 className="mb-4 text-2xl font-semibold">Thư viện bài tập</h1>

        <section aria-label="Chọn nhóm cơ">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {muscleGroups.map((g) => {
              const active = selectedGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGroup(active ? null : g.id)}
                  className={[
                    "flex flex-col items-center justify-center gap-2 border rounded-lg p-3",
                    active ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  <img src={g.icon} alt={g.label} className="w-8 h-8" />
                  <span className="text-sm">{g.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6" aria-label="Bộ lọc">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex gap-3">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="">Level: Tất cả</option>
                {optionSets.levels.map((lv) => (
                  <option key={lv} value={lv}>{lv}</option>
                ))}
              </select>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="">Impact: Tất cả</option>
                {optionSets.impacts.map((im) => (
                  <option key={im} value={im}>{im}</option>
                ))}
              </select>
              <select
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="">Population: Tất cả</option>
                {optionSets.populations.map((po) => (
                  <option key={po} value={po}>{po}</option>
                ))}
              </select>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài tập"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg md:w-64"
              />
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xoá lọc
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6" aria-label="Kết quả">
          {selectedGroup ? (
            <div className="mb-2 text-sm text-gray-600">
              Nhóm cơ đã chọn: <span className="font-medium">{muscleGroups.find((m) => m.id === selectedGroup)?.label}</span>
            </div>
          ) : null}

          <ExerciseList exercises={filtered} loading={false} error={null} />
        </section>
      </main>
    </div>
  );
}
