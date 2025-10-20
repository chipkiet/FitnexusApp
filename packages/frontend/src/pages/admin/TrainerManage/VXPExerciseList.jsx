import React from "react";

export default function VXPExerciseList({
  exercises,
  q,
  setQ,
  group,
  exError,
  exLoading,
  setSearch,
  goBack,
}) {
  const filtered = React.useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return exercises;
    return exercises.filter((ex) =>
      [ex.name, ex.name_en, ex.slug].some((t) =>
        (t || "").toLowerCase().includes(kw)
      )
    );
  }, [q, exercises]);

  const visible = filtered.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="px-3 py-1.5 rounded border hover:bg-gray-50">
            ← Back
          </button>
          <h2 className="text-lg font-semibold">Bài tập cho: {group?.name || "Không rõ"}</h2>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm bài tập..."
          className="w-72 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="rounded-lg border bg-white">
        {exLoading ? (
          <div className="p-4 text-sm text-gray-500">Đang tải bài tập...</div>
        ) : exError ? (
          <div className="p-4 text-sm text-red-600">{exError}</div>
        ) : visible.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">Không có bài tập.</div>
        ) : (
          <>
            <ul className="divide-y">
              {visible.map((ex) => (
                <li
                  key={ex.exercise_id}
                  onClick={() => {
                    const current = new URLSearchParams(window.location.search);
                    const currentExercise = Number(current.get("exercise")) || null;
                    if (currentExercise === ex.exercise_id) {
                      // ép reload khi click lại cùng bài
                      window.history.replaceState({}, "", window.location.href);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    } else {
                      setSearch({
                        group: String(group.muscle_group_id),
                        exercise: String(ex.exercise_id),
                      });
                    }
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="font-medium">{ex.name}</div>
                      {ex.name_en && (
                        <div className="text-xs text-gray-500">{ex.name_en}</div>
                      )}
                    </div>
                    {ex.ExerciseMuscleGroup && (
                      <div className="text-xs text-gray-600 text-right">
                        <div>Impact: {ex.ExerciseMuscleGroup.impact_level || "-"}</div>
                        <div>Intensity%: {ex.ExerciseMuscleGroup.intensity_percentage ?? "-"}</div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-3 border-t text-xs text-gray-500">
              Tối đa 10 bài hiển thị. Bấm 1 bài để xem chi tiết.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
