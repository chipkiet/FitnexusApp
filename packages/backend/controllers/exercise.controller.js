// controllers/exercise.controller.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST =
  process.env.RAPID_API_HOST || "exercisedb.p.rapidapi.com";

if (!RAPID_API_KEY) {
  console.error("⚠️ RAPID_API_KEY is missing in .env");
}

export const getExercisesByBodyPart = async (req, res) => {
  const { bodyPart } = req.params;

  if (!RAPID_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "API configuration is missing",
    });
  }

  const options = {
    method: "GET",
    url: `https://${RAPID_API_HOST}/exercises/bodyPart/${bodyPart}`,
    headers: {
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": RAPID_API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    // Transform data to match our format
    const exercises = response.data.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      description: exercise.instructions,
      type: exercise.type,
      equipment: exercise.equipment,
      difficulty: exercise.difficulty || "intermediate",
      muscle_target: exercise.target,
      video_url: exercise.videoUrl || null,
      image_url: exercise.gifUrl || null,
    }));

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Exercise API Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching exercises",
      error: error.response?.data || error.message,
    });
  }
};
