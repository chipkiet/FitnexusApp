import React from 'react';

function ExerciseList({ exercises, loading, error }) {
  if (loading) {
    return <div className="p-4">Loading exercises...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!exercises || exercises.length === 0) {
    return <div className="p-4">No exercises found. Select a muscle group to see exercises.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exercises</h2>
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="border rounded p-4">
            <h3 className="font-semibold">{exercise.name}</h3>
            {exercise.imageUrl && (
              <img 
                src={exercise.imageUrl} 
                alt={exercise.name} 
                className="w-full h-48 object-cover my-2 rounded"
              />
            )}
            <p className="text-gray-600 mt-2">{exercise.description}</p>
            <div className="mt-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                {exercise.difficulty}
              </span>
              <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {exercise.equipment}
              </span>
            </div>
            {exercise.instructions && (
              <div className="mt-4">
                <h4 className="font-semibold">Instructions:</h4>
                <p className="text-gray-700">{exercise.instructions}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseList;