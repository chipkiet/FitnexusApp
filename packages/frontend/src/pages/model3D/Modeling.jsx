import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModelViewer from '../../components/ModelViewer';

function Modeling() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null); // single selection
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // confirmation → show lists
  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false);
  const [primaryExercises, setPrimaryExercises] = useState([]);
  const [secondaryExercises, setSecondaryExercises] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore state from URL when coming back
  useEffect(() => {
    const group = searchParams.get('group');
    const openPanel = searchParams.get('openPanel') === '1';
    const openP = searchParams.get('openP') === '1';
    const openS = searchParams.get('openS') === '1';
    if (group) {
      setSelectedMuscleGroup(group);
      setIsPanelOpen(openPanel);
      setIsPrimaryOpen(openP);
      setIsSecondaryOpen(openS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lazy fetch: only when panel is opened
  useEffect(() => {
    if (!selectedMuscleGroup) {
      setExercises([]);
      setPrimaryExercises([]);
      setSecondaryExercises([]);
      return;
    }
    if (isPanelOpen) {
      fetchExercises(selectedMuscleGroup);
    }
  }, [selectedMuscleGroup, isPanelOpen]);

  const fetchExercises = async (muscleGroup) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/exercises/muscle/${muscleGroup}`);
      if (response.data.success) {
        const list = response.data.data || [];
        setExercises(list);
        // Partition by impact if provided by backend; otherwise default to primary
        const prim = [];
        const sec = [];
        for (const ex of list) {
          const impact = ex.impact_level || ex.impact || ex.impactLevel || null;
          if (impact === 'primary') prim.push(ex);
          else if (impact === 'secondary') sec.push(ex);
          // ignore others (stabilizer/unknown) for now
        }
        setPrimaryExercises(prim);
        setSecondaryExercises(sec);
      } else {
        setExercises([]);
        setPrimaryExercises([]);
        setSecondaryExercises([]);
        setError('Failed to fetch exercises');
      }
    } catch (err) {
      setExercises([]);
      setPrimaryExercises([]);
      setSecondaryExercises([]);
      setError(err.message || 'Error fetching exercises');
    } finally {
      setLoading(false);
    }
  };

  const formatGroupLabel = (str) =>
    (str || '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleSelectMuscle = (group) => {
    // Selecting a new group collapses the panel until confirmed
    setSelectedMuscleGroup(group);
    setIsPanelOpen(false);
    setIsPrimaryOpen(false);
    setIsSecondaryOpen(false);

    const next = new URLSearchParams(searchParams);
    next.set('group', group);
    next.set('openPanel', '0');
    next.set('openP', '0');
    next.set('openS', '0');
    setSearchParams(next, { replace: false });
  };

  return (
    <div className="flex h-full">
      {/* Left side - 3D Model */}
      <div className="w-1/2 h-full border-r">
        <ModelViewer onSelectMuscleGroup={handleSelectMuscle} />
      </div>

      {/* Right side - Confirm then show grouped lists */}
      <div className="w-1/2 h-full p-4 overflow-y-auto">
        {/* Empty state when no muscle selected */}
        {!selectedMuscleGroup && (
          <div className="text-gray-600">Hãy chọn một nhóm cơ trên mô hình 3D để xem bài tập.</div>
        )}

        {selectedMuscleGroup && (
          <div className="space-y-4">
            {/* Confirmation button to toggle panel */}
            <button
              type="button"
              onClick={() => {
                const nextOpen = !isPanelOpen;
                setIsPanelOpen(nextOpen);
                const next = new URLSearchParams(searchParams);
                next.set('group', selectedMuscleGroup);
                next.set('openPanel', nextOpen ? '1' : '0');
                next.set('openP', isPrimaryOpen ? '1' : '0');
                next.set('openS', isSecondaryOpen ? '1' : '0');
                setSearchParams(next, { replace: false });
                if (nextOpen && selectedMuscleGroup) {
                  // Lazy fetch only when user confirms to view
                  fetchExercises(selectedMuscleGroup);
                }
              }}
              className="flex items-center justify-between w-full p-4 transition bg-white rounded-lg shadow hover:shadow-md"
            >
              <div className="text-left">
                <div className="text-sm text-gray-500">
                  {isPanelOpen
                    ? 'Thu gọn danh sách bài tập'
                    : `Bạn muốn chọn nhóm cơ ${formatGroupLabel(selectedMuscleGroup)} này?`}
                </div>
                <div className="text-lg font-semibold text-gray-800">{formatGroupLabel(selectedMuscleGroup)}</div>
              </div>
              <div className="flex items-center gap-3">
                {isPanelOpen && (
                  <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">{exercises.length}</span>
                )}
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${isPanelOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isPanelOpen && (
              <>
                {/* Primary group */}
                <button
                  type="button"
                  onClick={() => {
                    const nextOpen = !isPrimaryOpen;
                    setIsPrimaryOpen(nextOpen);
                    const next = new URLSearchParams(searchParams);
                    next.set('group', selectedMuscleGroup);
                    next.set('openPanel', '1');
                    next.set('openP', nextOpen ? '1' : '0');
                    next.set('openS', isSecondaryOpen ? '1' : '0');
                    setSearchParams(next, { replace: false });
                  }}
                  className="flex items-center justify-between w-full p-4 transition bg-white rounded-lg shadow hover:shadow-md"
                >
                  <div className="text-left">
                    <div className="text-sm text-gray-500">Bài tập tác động chính</div>
                    <div className="text-lg font-semibold text-gray-800">Primary</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">{primaryExercises.length}</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isPrimaryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Loading state */}
                {loading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <span>Đang tải danh sách bài tập...</span>
                  </div>
                )}

                {/* Error state */}
                {error && !loading && (
                  <div className="text-red-600">{error}</div>
                )}

                {/* Primary list */}
                {isPrimaryOpen && !loading && !error && (
                  <div className="bg-white divide-y rounded-lg shadow">
                    {primaryExercises.length === 0 ? (
                      <div className="p-4 text-gray-500">Không có bài tập phù hợp.</div>
                    ) : (
                      primaryExercises.map((ex) => (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => navigate(`/exercises/${ex.id}`, { state: ex })}
                          className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
                        >
                          <span className="text-gray-800">{ex.name}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Secondary group */}
                <button
                  type="button"
                  onClick={() => {
                    const nextOpen = !isSecondaryOpen;
                    setIsSecondaryOpen(nextOpen);
                    const next = new URLSearchParams(searchParams);
                    next.set('group', selectedMuscleGroup);
                    next.set('openPanel', '1');
                    next.set('openP', isPrimaryOpen ? '1' : '0');
                    next.set('openS', nextOpen ? '1' : '0');
                    setSearchParams(next, { replace: false });
                  }}
                  className="flex items-center justify-between w-full p-4 transition bg-white rounded-lg shadow hover:shadow-md"
                >
                  <div className="text-left">
                    <div className="text-sm text-gray-500">Bài tập hỗ trợ/phụ</div>
                    <div className="text-lg font-semibold text-gray-800">Secondary</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50">{secondaryExercises.length}</span>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isSecondaryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Secondary list */}
                {isSecondaryOpen && !loading && !error && (
                  <div className="bg-white divide-y rounded-lg shadow">
                    {secondaryExercises.length === 0 ? (
                      <div className="p-4 text-gray-500">Không có bài tập phù hợp.</div>
                    ) : (
                      secondaryExercises.map((ex) => (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => navigate(`/exercises/${ex.id}`, { state: ex })}
                          className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
                        >
                          <span className="text-gray-800">{ex.name}</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modeling;
