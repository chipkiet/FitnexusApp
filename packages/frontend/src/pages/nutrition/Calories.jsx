import { useMemo, useState } from "react";

function calcBMR({ gender='MALE', weight=70, height=170, age=25 }) {
  // Mifflin-St Jeor
  if (gender === 'FEMALE') return 10*weight + 6.25*height - 5*age - 161;
  return 10*weight + 6.25*height - 5*age + 5;
}

const ACTIVITY = [
  { k:'SEDENTARY', label:'Sedentary (x1.2)', factor: 1.2 },
  { k:'LIGHT', label:'Light (x1.375)', factor: 1.375 },
  { k:'MODERATE', label:'Moderate (x1.55)', factor: 1.55 },
  { k:'ACTIVE', label:'Active (x1.725)', factor: 1.725 },
  { k:'ATHLETE', label:'Athlete (x1.9)', factor: 1.9 },
];

export default function CaloriesPage() {
  const [gender, setGender] = useState('MALE');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(68);
  const [activity, setActivity] = useState('MODERATE');

  const bmr = useMemo(() => Math.round(calcBMR({ gender, weight, height, age })), [gender, weight, height, age]);
  const tdee = useMemo(() => {
    const f = ACTIVITY.find(a => a.k === activity)?.factor || 1.55;
    return Math.round(bmr * f);
  }, [bmr, activity]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#101014,#0b0a12)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">Calories & Macros</h1>
        <p className="text-white/70 mt-2 mb-6">Estimate your daily calorie needs with the Mifflin-St Jeor formula.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-5 rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>setGender('MALE')} className={`px-3 py-2 rounded-lg ${gender==='MALE'?'bg-white text-black':'bg-white/10'}`}>Male</button>
                <button onClick={()=>setGender('FEMALE')} className={`px-3 py-2 rounded-lg ${gender==='FEMALE'?'bg-white text-black':'bg-white/10'}`}>Female</button>
              </div>
              <label className="text-sm text-white/70">Age
                <input type="number" className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10" value={age} onChange={(e)=>setAge(Number(e.target.value)||0)} />
              </label>
              <label className="text-sm text-white/70">Height (cm)
                <input type="number" className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10" value={height} onChange={(e)=>setHeight(Number(e.target.value)||0)} />
              </label>
              <label className="text-sm text-white/70">Weight (kg)
                <input type="number" className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10" value={weight} onChange={(e)=>setWeight(Number(e.target.value)||0)} />
              </label>
              <label className="text-sm text-white/70">Activity level
                <select className="mt-1 w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10" value={activity} onChange={(e)=>setActivity(e.target.value)}>
                  {ACTIVITY.map(a => <option key={a.k} value={a.k}>{a.label}</option>)}
                </select>
              </label>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 ring-1 ring-white/10">
            <div className="text-sm text-white/70">Results</div>
            <div className="mt-3 text-lg">BMR: <span className="font-bold">{bmr}</span> kcal/day</div>
            <div className="mt-2 text-lg">TDEE: <span className="font-bold">{tdee}</span> kcal/day</div>
            <div className="mt-4 text-sm text-white/70">Macro suggestions (balanced):</div>
            <ul className="mt-2 text-sm list-disc pl-5 space-y-1 text-white/80">
              <li>Protein: ~{Math.round(weight*1.6)} g/day</li>
              <li>Fat: ~{Math.round(tdee*0.25/9)} g/day</li>
              <li>Carbs: rest of calories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

