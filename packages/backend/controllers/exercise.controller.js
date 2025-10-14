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
  ['chest', ['chest','nguc','torso']],
  ['back', ['back','lung','upper-back','lower-back','lats','latissimus-dorsi','trapezius','rhomboids','erector-spinae','teres-major']],
  ['shoulders', ['shoulders','vai','delts','anterior-deltoid','lateral-deltoid','posterior-deltoid','rotator-cuff','serratus-anterior']],
  ['arms', ['arms','tay','upper arms','upper-arms','biceps','biceps-brachii','triceps','triceps-brachii','forearms','brachialis','brachioradialis','wrist-flexors','wrist-extensors']],
  ['core', ['core','abs','abdominals','rectus-abdominis','obliques','transversus-abdominis','bung','bung']],
  ['legs', ['legs','chan','upper legs','upper-legs','lower legs','lower-legs','quadriceps','hamstrings','gluteus-maximus','gluteus-medius','gluteus-minimus','hip-adductors','hip-flexors','gastrocnemius','soleus','tibialis-anterior','calf','calves']]
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
        `WITH classified AS (
           SELECT e.exercise_id,
                  CASE
                    WHEN bool_or(emg.impact_level = 'primary') THEN 'primary'
                    WHEN bool_or(emg.impact_level = 'secondary') THEN 'secondary'
                    WHEN bool_or(emg.impact_level = 'stabilizer') THEN 'stabilizer'
                    ELSE NULL
                  END AS impact_level
           FROM exercises e
           JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
           JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
           WHERE mg.slug = :slug
           GROUP BY e.exercise_id
         )
         SELECT e.*, c.impact_level
         FROM classified c
         JOIN exercises e ON e.exercise_id = c.exercise_id
         ORDER BY e.popularity_score DESC NULLS LAST, e.name ASC
         LIMIT 100`,
        { replacements: { slug: guessed.childSlug } }
      );
      rows = result;
    } else if (guessed.parentSlug) {
      const [result] = await sequelize.query(
        `WITH classified AS (
          SELECT e.exercise_id,
                 CASE
                   WHEN bool_or(emg.impact_level = 'primary') THEN 'primary'
                   WHEN bool_or(emg.impact_level = 'secondary') THEN 'secondary'
                   WHEN bool_or(emg.impact_level = 'stabilizer') THEN 'stabilizer'
                   ELSE NULL
                 END AS impact_level
          FROM exercises e
          JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
          JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
          JOIN muscle_groups parent ON parent.muscle_group_id = mg.parent_id
          WHERE parent.slug = :parent
          GROUP BY e.exercise_id
        )
        SELECT e.*, c.impact_level
        FROM classified c
        JOIN exercises e ON e.exercise_id = c.exercise_id
         ORDER BY e.popularity_score DESC NULLS LAST, e.name ASC
         LIMIT 100`,
        { replacements: { parent: guessed.parentSlug } }
      );
      rows = result;
    } else {
      // Fallback: try by slug, then by Vietnamese/English name
      const [bySlug] = await sequelize.query(
        `WITH classified AS (
           SELECT e.exercise_id,
                  CASE
                    WHEN bool_or(emg.impact_level = 'primary') THEN 'primary'
                    WHEN bool_or(emg.impact_level = 'secondary') THEN 'secondary'
                    WHEN bool_or(emg.impact_level = 'stabilizer') THEN 'stabilizer'
                    ELSE NULL
                  END AS impact_level
           FROM exercises e
           JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
           JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
           WHERE mg.slug = :slug
           GROUP BY e.exercise_id
         )
         SELECT e.*, c.impact_level
         FROM classified c
         JOIN exercises e ON e.exercise_id = c.exercise_id
         LIMIT 100`,
        { replacements: { slug: muscleGroup.toLowerCase().replace(/\s+/g, '-') } }
      );
      if (bySlug.length) {
        rows = bySlug;
      } else {
        const [byName] = await sequelize.query(
          `WITH classified AS (
            SELECT e.exercise_id,
                   CASE
                     WHEN bool_or(emg.impact_level = 'primary') THEN 'primary'
                     WHEN bool_or(emg.impact_level = 'secondary') THEN 'secondary'
                     WHEN bool_or(emg.impact_level = 'stabilizer') THEN 'stabilizer'
                     ELSE NULL
                   END AS impact_level
            FROM exercises e
            JOIN exercise_muscle_group emg ON emg.exercise_id = e.exercise_id
            JOIN muscle_groups mg ON mg.muscle_group_id = emg.muscle_group_id
            WHERE mg.name ILIKE :q OR mg.name_en ILIKE :q
            GROUP BY e.exercise_id
          )
          SELECT e.*, c.impact_level
          FROM classified c
          JOIN exercises e ON e.exercise_id = c.exercise_id
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
      impact_level: r.impact_level || null,
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
      impact_level: r.impact_level || null,
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

// Return steps (JSON preferred) by exercise id
export const getExerciseStepsById = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    // Prefer JSON table
    const [jsonRows] = await sequelize.query(
      `SELECT steps FROM exercise_steps_json WHERE exercise_id = $1 LIMIT 1`,
      { bind: [exerciseId] }
    );
    if (jsonRows.length) {
      return res.status(200).json({ success: true, data: jsonRows[0].steps });
    }
    // Fallback to row-level steps
    const [rows] = await sequelize.query(
      `SELECT step_number, title, instruction_text, media_url, media_type
       FROM exercise_steps WHERE exercise_id = $1 ORDER BY step_number ASC`,
      { bind: [exerciseId] }
    );
    const steps = rows.map(r => ({
      step_number: r.step_number,
      instruction_text: r.instruction_text,
      title: r.title,
      media_url: r.media_url,
      media_type: r.media_type,
    }));
    return res.status(200).json({ success: true, data: steps });
  } catch (error) {
    console.error('Error fetching steps by id:', error);
    return res.status(500).json({ success: false, message: 'Error fetching steps', error: error.message });
  }
};

// Return steps by slug
export const getExerciseStepsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [exRows] = await sequelize.query(
      `SELECT exercise_id FROM exercises WHERE slug = $1 LIMIT 1`,
      { bind: [slug] }
    );
    if (!exRows.length) return res.status(404).json({ success: false, message: 'Exercise not found' });
    const exerciseId = exRows[0].exercise_id;
    const [jsonRows] = await sequelize.query(
      `SELECT steps FROM exercise_steps_json WHERE exercise_id = $1 LIMIT 1`,
      { bind: [exerciseId] }
    );
    if (jsonRows.length) {
      return res.status(200).json({ success: true, data: jsonRows[0].steps });
    }
    const [rows] = await sequelize.query(
      `SELECT step_number, title, instruction_text, media_url, media_type
       FROM exercise_steps WHERE exercise_id = $1 ORDER BY step_number ASC`,
      { bind: [exerciseId] }
    );
    const steps = rows.map(r => ({
      step_number: r.step_number,
      instruction_text: r.instruction_text,
      title: r.title,
      media_url: r.media_url,
      media_type: r.media_type,
    }));
    return res.status(200).json({ success: true, data: steps });
  } catch (error) {
    console.error('Error fetching steps by slug:', error);
    return res.status(500).json({ success: false, message: 'Error fetching steps', error: error.message });
  }
};
