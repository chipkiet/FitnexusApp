import { useNavigate } from "react-router-dom";

export default function ExerciseLibrary() {
  const navigate = useNavigate();
  const PARTS = [
    { key: 'chest', label: 'Chest' },
    { key: 'back', label: 'Back' },
    { key: 'shoulders', label: 'Shoulders' },
    { key: 'arms', label: 'Arms' },
    { key: 'core', label: 'Core' },
    { key: 'legs', label: 'Legs' },
  ];
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#101014,#0b0a12)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">Exercise Library</h1>
          <button onClick={()=>navigate('/model3d')} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Open 3D Explorer</button>
        </div>
        <p className="text-white/70 mb-6">Pick a muscle group to view exercises. This is a placeholder; wire to API as needed.</p>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {PARTS.map(p => (
            <button key={p.key} className="p-5 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 text-left">
              <div className="text-sm text-white/60">Muscle Group</div>
              <div className="text-lg font-semibold">{p.label}</div>
              <div className="mt-2 text-xs text-white/60">View curated exercises and tips.</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

