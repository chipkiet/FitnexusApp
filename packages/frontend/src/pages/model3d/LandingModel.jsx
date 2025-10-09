import React, { useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import { HumanModel } from "../../components/3d/HumanModel";
import ExerciseList from "../../components/exercise/ExerciseList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import api from "../../lib/api";

export default function LandingModel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [selectedPart, setSelectedPart] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [activeTab, setActiveTab] = useState("exercises"); // overview | muscles | exercises

  const BODY_PARTS = [
    { key: "chest", label: "Chest" },
    { key: "shoulders", label: "Shoulders" },
    { key: "arms", label: "Arms" },
    { key: "back", label: "Back" },
    { key: "core", label: "Core" },
    { key: "legs", label: "Legs" },
  ];

  const filteredExercises = useMemo(() => {
    if (!search) return exercises;
    const q = search.toLowerCase();
    return (exercises || []).filter((e) =>
      [e?.name, e?.name_en, e?.slug]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(q))
    );
  }, [exercises, search]);

  const fetchExercises = async (part) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/exercises/${part}`);
      setExercises(res.data);
    } catch (e) {
      setError("Failed to fetch exercises. Please try again later.");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBodyPartClick = async (part) => {
    if (!part || part === selectedPart) return;
    setSelectedPart(part);
    setActiveTab("exercises");
    await fetchExercises(part);
  };

  const displayName = (user?.username || "").replaceAll("_", " ");

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(96,56,255,.25),transparent),linear-gradient(135deg,#1f1b2e,#0c0a12)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
            <h1 className="text-xl font-bold text-white tracking-tight">FitNexus 3D Explorer</h1>
            <span className="ml-3 text-xs px-2 py-1 rounded-full bg-white/10 text-fuchsia-200">Beta</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <span>Homepage</span>
            </button>
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white grid place-items-center text-sm font-semibold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-white">{displayName}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                >Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">Login</button>
                <button onClick={() => navigate('/register')} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">Sign up</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid lg:grid-cols-3 gap-6">
        {/* 3D Panel */}
        <section className="relative lg:col-span-2 rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 p-5 flex items-center justify-between pointer-events-none">
            <div>
              <h2 className="text-white font-semibold text-lg">3D Human Body</h2>
              <p className="text-xs text-purple-200">Click a muscle group on the model to explore</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="px-2 py-1 rounded bg-white/10">Drag to rotate</span>
              <span className="px-2 py-1 rounded bg-white/10">Scroll to zoom</span>
            </div>
          </div>

          <Canvas camera={{ position: [0, 1.6, 9], fov: 45, near: 0.01, far: 10000 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 12, 8]} intensity={1.0} />
            <Suspense fallback={null}>
              <Bounds fit observe margin={1.3}>
                <HumanModel onBodyPartClick={handleBodyPartClick} />
              </Bounds>
            </Suspense>
            <OrbitControls makeDefault target={[0, 1, 0]} enablePan={false} minDistance={0.01} maxDistance={Infinity} zoomSpeed={0.9} />
          </Canvas>

          {/* Floating HUD */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="px-3 py-2 rounded-xl bg-black/40 text-white border border-white/10">
              <div className="text-xs uppercase tracking-wide text-white/60">Selected</div>
              <div className="text-sm font-semibold">{selectedPart || 'None'}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/onboarding/entry')} className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 text-sm font-semibold">Personalize Plan</button>
              <button onClick={() => navigate('/plan-preview')} className="px-4 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-sm font-semibold">View Plan Preview</button>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <aside className="space-y-4">
          {/* Quick filters */}
          <div className="p-4 rounded-2xl ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
            <div className="text-sm font-semibold text-white mb-2">Quick Select</div>
            <div className="flex flex-wrap gap-2">
              {BODY_PARTS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => handleBodyPartClick(b.key)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${selectedPart===b.key?'bg-fuchsia-600 border-fuchsia-500 text-white':'border-white/20 text-white/80 hover:bg-white/10'}`}
                >{b.label}</button>
              ))}
              <button onClick={() => {setSelectedPart(""); setExercises([]);}} className="px-3 py-1.5 rounded-full text-sm border border-white/20 text-white/60 hover:bg-white/10">Clear</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="p-1 rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex p-1 gap-1">
              {[
                {k:'overview', label:'Overview'},
                {k:'muscles', label:'Muscles'},
                {k:'exercises', label:'Exercises'},
              ].map(t => (
                <button key={t.k} onClick={()=>setActiveTab(t.k)} className={`flex-1 px-3 py-2 rounded-lg text-sm ${activeTab===t.k? 'bg-white text-black font-semibold':'text-white/80 hover:bg-white/10'}`}>{t.label}</button>
              ))}
            </div>

            {/* Content */}
            {activeTab === 'overview' && (
              <div className="p-4 text-sm text-white/80 space-y-2">
                <p>Explore the 3D human model and pick a muscle group to see recommended exercises. Use Plan Preview to see a generated training outline after onboarding.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click model parts or use Quick Select.</li>
                  <li>Filter exercises using the search below.</li>
                  <li>Start Onboarding to personalize your plan.</li>
                </ul>
              </div>
            )}

            {activeTab === 'muscles' && (
              <div className="p-4 text-sm text-white/80 grid grid-cols-2 gap-2">
                {BODY_PARTS.map((b) => (
                  <button key={b.key} onClick={() => handleBodyPartClick(b.key)} className={`px-3 py-2 rounded-lg border ${selectedPart===b.key?'border-fuchsia-500 bg-fuchsia-600 text-white':'border-white/20 hover:bg-white/10'}`}>{b.label}</button>
                ))}
              </div>
            )}

            {activeTab === 'exercises' && (
              <div className="p-4">
                {/* Search */}
                <div className="mb-3">
                  <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search exercises..." className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                </div>
                <div className="border-t border-white/10 -mx-4 mb-2" />
                {/* List */}
                <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                  <ExerciseList exercises={filteredExercises} loading={loading} error={error} />
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
