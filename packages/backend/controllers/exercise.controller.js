import Exercise from "../models/exercise.model.js";
import { sequelize } from "../config/database.js";

function normalize(str = "") {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const CANONICAL_CHILD = new Set([
  'upper-chest','mid-chest','lower-chest',
  'latissimus-dorsi','trapezius','rhomboids','erector-spinae','teres-major',
  'anterior-deltoid','lateral-deltoid','posterior-deltoid','rotator-cuff','serratus-anterior',
  'biceps-brachii','brachialis','brachioradialis','triceps-brachii','wrist-flexors','wrist-extensors',
  'rectus-abdominis','obliques','transversus-abdominis',
  'quadriceps','hamstrings','gluteus-maximus','gluteus-medius','gluteus-minimus','hip-adductors','hip-flexors','gastrocnemius','soleus','tibialis-anterior'
]);

const PARENT_ALIASES = new Map([
  ['chest', ['chest','nguc','upper arms?','torso']],
  ['back', ['back','lung','upper-back','lower-back','lats','latissimus-dorsi','trapezius','rhomboids','erector-spinae','teres-major']],
  ['shoulders', ['shoulders','vai','delts','anterior-deltoid','lateral-deltoid','posterior-deltoid','rotator-cuff','serratus-anterior']],
  ['arms', ['arms','tay','biceps','biceps-brachii','triceps','triceps-brachii','forearms','brachialis','brachioradialis','wrist-flexors','wrist-extensors']],
  ['core', ['core','abs','abdominals','rectus-abdominis','obliques','transversus-abdominis','bung','bung']],
  ['legs', ['legs','chan','quadriceps','hamstrings','gluteus-maximus','gluteus-medius','gluteus-minimus','hip-adductors','hip-flexors','gastrocnemius','soleus','tibialis-anterior','calf','calves']]
]);

function guessSlugOrParent(input) {
  const raw = normalize(input);
  const candidate = raw.replace(/\s+/g, '-');
  if (CANONICAL_CHILD.has(candidate)) return { childSlug: candidate };
  for (const [parent, aliases] of PARENT_ALIASES) {
    const s = new Set(aliases.map(a => normalize(a)));
    if (s.has(raw) || s.has(candidate)) return { parentSlug: parent };
  }
  return { any: raw };
}

export const getExercisesByMuscleGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const guessed = guessSlugOrParent(muscleGroup);

    let rows = [];
    if (guessed.childSlug) {
      const [result] = await sequelize.query(
        `SELECT DISTINCT e.*
         FROM exercises e
         JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
         JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
         WHERE mg.slug = :slug
         ORDER BY e.popularity_score DESC NULLS LAST, e.name ASC
         LIMIT 100`,
        { replacements: { slug: guessed.childSlug } }
      );
      rows = result;
    } else if (guessed.parentSlug) {
      const [result] = await sequelize.query(
        `SELECT DISTINCT e.*
         FROM exercises e
         JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
         JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
         JOIN muscle_groups parent ON parent.muscle_group_id = mg.parent_id
         WHERE parent.slug = :parent
         ORDER BY e.popularity_score DESC NULLS LAST, e.name ASC
         LIMIT 100`,
        { replacements: { parent: guessed.parentSlug } }
      );
      rows = result;
    } else {
      // Fallback: try by slug, then by Vietnamese/English name
      const [bySlug] = await sequelize.query(
        `SELECT DISTINCT e.*
         FROM exercises e
         JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
         JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
         WHERE mg.slug = :slug
         LIMIT 100`,
        { replacements: { slug: muscleGroup.toLowerCase().replace(/\s+/g, '-') } }
      );
      if (bySlug.length) {
        rows = bySlug;
      } else {
        const [byName] = await sequelize.query(
          `SELECT DISTINCT e.*
           FROM exercises e
           JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
           JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
           WHERE mg.name ILIKE :q OR mg.name_en ILIKE :q
           LIMIT 100`,
          { replacements: { q: `%${muscleGroup}%` } }
        );
        rows = byName;
      }
    }

    // Map DB fields to FE shape minimally
    const data = rows.map(r => ({
      id: r.exercise_id,
      name: r.name || r.name_en,
      description: r.description,
      difficulty: r.difficulty_level,
      equipment: r.equipment_needed,
      imageUrl: r.thumbnail_url || r.gif_demo_url || null,
      instructions: null,
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching exercises",
      error: error.message,
    });
  }
};

export const getAllExercises = async (_req, res) => {
  try {
    const list = await Exercise.findAll({ limit: 100, order: [["popularity_score", "DESC"], ["name", "ASC"]] });
    const data = list.map((r) => ({
      id: r.exercise_id,
      name: r.name || r.name_en,
      description: r.description,
      difficulty: r.difficulty_level,
      equipment: r.equipment_needed,
      imageUrl: r.thumbnail_url || r.gif_demo_url || null,
      instructions: null,
    }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching all exercises:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching exercises",
      error: error.message,
    });
  }
};
