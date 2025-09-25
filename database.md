// ==== Bảng trung tâm ====
Table Users {
  user_id INT [pk, increment]
  username VARCHAR(50) [unique, not null]
  email VARCHAR(255) [unique, not null]
  password_hash VARCHAR(255) [null]
  full_name VARCHAR(100)
  avatar_url VARCHAR(255)
  date_of_birth DATE
  gender VARCHAR(10)
  provider VARCHAR(50) [not null, default: 'local']
  provider_id VARCHAR(255) [null]
  role VARCHAR(20) [not null, default: 'user']
  status VARCHAR(20) [not null, default: 'active']
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
  last_login_at TIMESTAMP
  user_plan varchar(20) [not null, default: 'FREE'] 
}

// ==== Bảng Thư viện & Giải phẫu ====
Table Exercises {
  exercise_id INT [pk, increment]
  name VARCHAR(255) [not null]
  description TEXT
  difficulty_level VARCHAR(50)
  exercise_type VARCHAR(50) 
  equipment_needed VARCHAR(255)
  primary_video_url VARCHAR(255)
  is_public BOOLEAN [default: TRUE]
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
}

Table ExerciseSteps {
  step_id INT [pk, increment]
  exercise_id INT [ref: > Exercises.exercise_id, not null] // Mối quan hệ 3
  step_number INT [not null]
  instruction_text TEXT [not null]
  media_url VARCHAR(255)
}

Table MuscleGroups {
  muscle_group_id INT [pk, increment]
  name VARCHAR(100) [not null]
  description TEXT
  image_url VARCHAR(255)
  model_identifier VARCHAR(100) [unique]
  parent_id INT [ref: > MuscleGroups.muscle_group_id] // Mối quan hệ 4
  created_at TIMESTAMP [default: `now()`]
}

// Bảng trung gian - Cầu nối quan trọng nhất
Table Exercise_MuscleGroup {
  exercise_id INT [ref: > Exercises.exercise_id] // Mối quan hệ 5
  muscle_group_id INT [ref: > MuscleGroups.muscle_group_id] // Mối quan hệ 5
  impact_level VARCHAR(20) [not null, default: 'primary']
  Primary Key (exercise_id, muscle_group_id)
}


// ==== Bảng theo dõi người dùng ====
Table UserProgress {
  progress_id INT [pk, increment]
  user_id INT [ref: > Users.user_id, not null] // Mối quan hệ 1
  date_recorded DATE [not null]
  weight_kg DECIMAL(5, 2)
  height_cm DECIMAL(5, 1)
  chest_cm DECIMAL(5, 1) [null]
  waist_cm DECIMAL(5, 1) [null]
  biceps_cm DECIMAL(5, 1) [null]
  thigh_cm DECIMAL(5, 1) [null]
  body_fat_percentage DECIMAL(4, 2) [null]
  notes TEXT
  created_at TIMESTAMP [default: `now()`]
}

Table ProgressPhotos {
  photo_id INT [pk, increment]
  progress_id INT [ref: > UserProgress.progress_id, not null] // Mối quan hệ 2
  image_url VARCHAR(255) [not null]
  photo_type VARCHAR(20)
  uploaded_at TIMESTAMP [default: `now()`]
}

// ==== Bảng mới : Kế hoạch tập và nhật ký ====
Table WorkoutPlans {
  plan_id INT [pk, increment]
  name VARCHAR(255) [not null]
  description text
  creator_id INT [ref: > Users.user_id, null]
  difficult_level VARCHAR(50)
  is_public BOOLEAN
}

Table Plan_Exercise_Details {
  plan_exercise_id INT [pk, increment]
  plan_id INT [ref: > WorkoutPlans.plan_id, not null]
  exercise_id INT [ref: > Exercises.exercise_id, not null]
  session_order INT 
  sets_recommended INT 
  reps_recommended VARCHAR(50)
  rest_period_seconds INT 
}

Table UserWorkoutLogs {
  log_id INT [pk, increment]
  user_id INT [ref: > Users.user_id, not null]
  plan_id INT [ref: <> WorkoutPlans.plan_id]
  started_at TIMESTAMP [not null]
  completed_at TIMESTAMP
  notes TEXT
}

Table UserWorkoutLog_Details {
  log_detail_id INT [pk, increment]
  log_id INT [ref: > UserWorkoutLogs.log_id, not null]
  exercise_id INT [ref: > Exercises.exercise_id, not null]
  set_number INT [not null]
  reps_achieved INT
  weight_kg DECIMAL(6, 2)
  duration_seconds INT
}

Table PasswordResets {
  id INT [pk, increment]                      // hoặc UUID nếu bạn muốn
  user_id INT [ref: > Users.user_id, not null]
  token_hash TEXT [not null]                  // SHA-256 của token
  expires_at TIMESTAMP [not null]             // hết hạn (15–30 phút)
  used_at TIMESTAMP                           // null nếu chưa dùng
  created_at TIMESTAMP [default: `now()`]

  // Index gợi ý (DBML comment, tạo index ở migration SQL)
  Note: 'INDEX(user_id), INDEX(token_hash)'
}


