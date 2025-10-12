import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModelViewer from './ModelViewer';
import ExerciseList from './ExerciseList';

function ModelingPage() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMuscleGroup) {
      fetchExercises(selectedMuscleGroup);
    }
  }, [selectedMuscleGroup]);

  const fetchExercises = async (muscleGroup) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/exercises/muscle/${muscleGroup}`);
      if (response.data.success) {
        setExercises(response.data.data);
      } else {
        setError('Failed to fetch exercises');
      }
    } catch (err) {
      setError(err.message || 'Error fetching exercises');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left side - 3D Model */}
      <div className="w-1/2 h-full border-r">
        <ModelViewer onSelectMuscleGroup={setSelectedMuscleGroup} />
      </div>

      {/* Right side - Exercise List */}
      <div className="w-1/2 h-full overflow-y-auto">
        <ExerciseList 
          exercises={exercises}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default ModelingPage;