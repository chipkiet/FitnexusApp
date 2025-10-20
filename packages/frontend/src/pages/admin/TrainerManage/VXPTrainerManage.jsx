import React from "react";
import VXPExerciseDetail from "./VXPExerciseDetail.jsx";
import VXPExerciseList from "./VXPExerciseList.jsx";
import { VXP_MAIN_GROUP_IMAGES, vxpGetSubImage } from "./vxpImages.js";

export default function VXPTrainerManage() {
  const API = import.meta.env.VITE_API_URL || "";

  // ===== URL params =====
  const [searchParams, setSearchParams] = React.useState(
    new URLSearchParams(window.location.search)
  );
  const groupFromURL = Number(searchParams.get("group")) || null;
  const exerciseFromURL = Number(searchParams.get("exercise")) || null;

  React.useEffect(() => {
    const onPop = () =>
      setSearchParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ===== State =====
  const [groups, setGroups] = React.useState([]);
  const [groupsLoading, setGroupsLoading] = React.useState(true);
  const [groupsError, setGroupsError] = React.useState("");
  const [mainGroup, setMainGroup] = React.useState(null);

  const [exercises, setExercises] = React.useState([]);
  const [exLoading, setExLoading] = React.useState(false);
  const [exError, setExError] = React.useState("");
  const [q, setQ] = React.useState("");

  // ===== Fetch groups =====
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setGroupsLoading(true);
        const res = await fetch(`${API}/api/trainer/muscle-groups`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setGroups(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (mounted) setGroupsError("Không tải được danh sách nhóm cơ.");
      } finally {
        if (mounted) setGroupsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API]);

  // ===== Phân nhóm lớn =====
  const MAIN_GROUPS = ["Ngực", "Lưng", "Vai", "Tay", "Core", "Mông", "Đùi", "Chân"];
  const KEYWORDS = {
    Ngực: ["ngực", "chest", "upper chest", "mid chest", "lower chest"],
    Lưng: ["lưng", "back", "lat", "trapezius", "erector spinae"],
    Vai: ["vai", "shoulder", "deltoid", "delt", "rotator cuff", "chóp xoay"],
    Tay: ["tay", "arm", "biceps", "triceps", "forearm"],
    Core: ["core", "abs", "oblique", "bụng"],
    Mông: ["mông", "glute"],
    Đùi: ["đùi", "quad", "hamstring", "gập háng"],
    Chân: ["chân", "leg", "calf", "bắp chân"],
  };
  function classifyToMain(group) {
    const text = `${group?.name || ""} ${group?.name_en || ""}`.toLowerCase();
    for (const main of MAIN_GROUPS) if (KEYWORDS[main].some((k) => text.includes(k))) return main;
    return "Core";
  }
  const grouped = React.useMemo(() => {
    const bucket = MAIN_GROUPS.reduce((acc, k) => ((acc[k] = []), acc), {});
    for (const g of groups) bucket[classifyToMain(g)].push(g);
    return bucket;
  }, [groups]);

  const subGroupsOfMain = React.useMemo(() => {
    if (!mainGroup) return [];
    return (grouped[mainGroup] || []).filter((g) => g.name !== mainGroup);
  }, [grouped, mainGroup]);

  // ===== Fetch exercises of selected subgroup =====
  React.useEffect(() => {
    if (!groupFromURL) {
      setExercises([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        setExLoading(true);
        setExError("");
        const res = await fetch(
          `${API}/api/trainer/muscle-groups/${groupFromURL}/exercises`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) setExercises(Array.isArray(data?.Exercises) ? data.Exercises : []);
      } catch (e) {
        console.error(e);
        if (mounted) setExError("Không tải được bài tập của nhóm cơ.");
      } finally {
        if (mounted) setExLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API, groupFromURL]);

  // ===== Guard: nếu exercise không thuộc nhóm hiện tại, bỏ param exercise =====
  React.useEffect(() => {
    if (!groupFromURL || !exerciseFromURL) return;
    if (exLoading) return;
    const exists = exercises.some(
      (e) => Number(e.exercise_id) === Number(exerciseFromURL)
    );
    if (!exists) {
      const sp = new URLSearchParams({ group: String(groupFromURL) });
      setSearchParams(sp);
      const url = `${window.location.pathname}?${sp.toString()}`;
      window.history.replaceState({}, "", url);
    }
  }, [exercises, exLoading, groupFromURL, exerciseFromURL]);

  // ===== Không có endpoint chi tiết → lấy từ list =====
  const selectedExercise = React.useMemo(() => {
    if (!exerciseFromURL) return null;
    return (
      exercises.find((e) => Number(e.exercise_id) === Number(exerciseFromURL)) ||
      null
    );
  }, [exerciseFromURL, exercises]);

  // ===== Helpers =====
  const setSearch = (obj, options) => {
    const sp = new URLSearchParams(obj);
    setSearchParams(sp);
    const url = `${window.location.pathname}?${sp.toString()}`;
    window.history[options?.replace ? "replaceState" : "pushState"]({}, "", url);
  };
  const goBack = () => {
    if (exerciseFromURL) setSearch({ group: groupFromURL }, { replace: true });
    else if (groupFromURL) setSearch({}, { replace: true });
    else if (mainGroup) setMainGroup(null);
  };

  // ===== UI =====
  if (groupFromURL && exerciseFromURL) {
    const group = groups.find((g) => g.muscle_group_id === groupFromURL);
    return (
      <VXPExerciseDetail
        key={exerciseFromURL}
        detail={selectedExercise}
        loading={exLoading && !selectedExercise}
        error={exError}
        groupName={group?.name}
        onBack={goBack}
      />
    );
  }

  if (!mainGroup && !groupFromURL) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Chọn nhóm cơ chính</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {MAIN_GROUPS.map((m) => (
            <button
              key={m}
              onClick={() => setMainGroup(m)}
              className="group w-full rounded-xl border-2 p-5 h-24 sm:h-28 flex items-center justify-between hover:bg-gray-50"
            >
              <div>
                <div className="text-lg font-semibold">{m}</div>
                <div className="text-xs text-gray-500">
                  {(grouped[m]?.length || 0) -
                    (grouped[m]?.some((g) => g.name === m) ? 1 : 0)}{" "}
                  nhóm con
                </div>
              </div>
              {VXP_MAIN_GROUP_IMAGES[m] && (
                <img
                  src={VXP_MAIN_GROUP_IMAGES[m]}
                  alt={m}
                  className="h-16 w-16 object-contain"
                />
              )}
            </button>
          ))}
        </div>

        {groupsLoading && (
          <div className="text-sm text-gray-500">Đang tải nhóm cơ…</div>
        )}
        {groupsError && (
          <div className="text-sm text-red-600">{groupsError}</div>
        )}
      </div>
    );
  }

  if (mainGroup && !groupFromURL) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="px-3 py-1.5 rounded border hover:bg-gray-50"
          >
            ← Back
          </button>
          <h2 className="text-lg font-semibold">Chọn nhóm nhỏ của {mainGroup}</h2>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {subGroupsOfMain.map((g) => {
            const img = vxpGetSubImage(mainGroup, g);
            return (
              <button
                key={g.muscle_group_id}
                onClick={() => setSearch({ group: String(g.muscle_group_id) })}
                className="rounded-xl border-2 p-5 h-24 sm:h-28 flex items-center justify-between hover:bg-gray-50"
                title={g.name_en ? `${g.name} (${g.name_en})` : g.name}
              >
                <div className="min-w-0">
                  <div className="font-medium text-base sm:text-lg truncate">
                    {g.name}
                  </div>
                  {g.name_en && (
                    <div className="text-xs text-gray-500 truncate">
                      {g.name_en}
                    </div>
                  )}
                </div>
                {img && (
                  <img
                    src={img}
                    alt={g.name}
                    className="h-16 w-16 object-contain"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Danh sách bài tập của nhóm con
  const group = groups.find((g) => g.muscle_group_id === groupFromURL);
  return (
    <VXPExerciseList
      exercises={exercises}
      q={q}
      setQ={setQ}
      group={group}
      exError={exError}
      exLoading={exLoading}
      setSearch={setSearch}
      goBack={goBack}
    />
  );
}
