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
  onboarding_completed_at TIMESTAMP                // đánh dấu đã hoàn tất onboarding
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
  weight DECIMAL(5, 2)
  height DECIMAL(5, 1)
  chest DECIMAL(5, 1) [null]
  waist DECIMAL(5, 1) [null]
  biceps DECIMAL(5, 1) [null]
  thigh DECIMAL(5, 1) [null]
  body_fat_level DECIMAL(4, 2) [null]
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

Table OnboardingSteps {
  step_id INT [pk, increment]
  step_key VARCHAR(50) [unique, not null]      // ví dụ: 'step-bodytype', 'step-goal'
  title VARCHAR(120) [not null]
  order_index INT [not null]
  is_active BOOLEAN [not null, default: true]
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
  // Ghi chú: flow đơn giản dùng order_index để đi tuần tự; không rẽ nhánh
  Note: 'INDEX(order_index)'
}

Table OnboardingFields {
  field_id INT [pk, increment]
  step_id INT [ref: > OnboardingSteps.step_id, not null] // quan hệ tới bước
  field_key VARCHAR(50) [not null]            // ví dụ: body_type, goal_steps, height_cm
  label VARCHAR(120) [not null]
  input_type VARCHAR(30) [not null]           // radio | select | number | date | text ...
  required BOOLEAN [not null, default: true]
  order_index INT                              // vị trí hiển thị trong bước
  metadata JSONB                               // min/max/step, presets, units, placeholder..., có thể chứa mapping sang Users/UserProgress
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
  // Mỗi field_key là duy nhất trong 1 step
  Note: 'UNIQUE(step_id, field_key); INDEX(step_id); INDEX(order_index)'
}


Table OnboardingSessions {
  session_id UUID [pk]                         // dùng UUID cho phiên
  user_id INT [ref: > Users.user_id, not null]
  current_step_key VARCHAR(50)                 // đang dừng ở bước nào, BE có thể gợi ý bước tiếp theo
  is_completed BOOLEAN [not null, default: false]
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP
  completed_at TIMESTAMP
  // Mỗi user chỉ có 1 session ACTIVE/không hoàn tất (enforce ở app hoặc partial index)
  Note: 'INDEX(user_id); INDEX(is_completed)'
}

Table OnboardingAnswers {
  answer_id INT [pk, increment]
  session_id UUID [ref: > OnboardingSessions.session_id, not null]
  step_id INT [ref: > OnboardingSteps.step_id, not null]
  answers JSONB [not null]                     // payload của CẢ BƯỚC (per-step), ví dụ {"body_type":"SKINNY"}
  created_at TIMESTAMP [default: `now()`]
  updated_at TIMESTAMP

  // Lưu THEO BƯỚC: duy nhất một bản ghi cho mỗi (session, step)
  Note: 'UNIQUE(session_id, step_id); INDEX(session_id); INDEX(step_id)'
}

