# FitNexus — Yêu cầu & Kế hoạch (Phase 1 → Phase 2)

Mục tiêu: hoàn tất nhanh Phase 1 để “map” đầy đủ với `docs/fitnexus.md`, sau đó triển khai Phase 2 tập trung lợi nhuận và độ vững.

-------------------------------------------------------------------------------

**Quyền Truy Cập Khi Chưa Đăng Nhập**

- Phương án đề xuất: Cho phép xem đầy đủ thư viện bài tập (browse) + chọn nhóm cơ từ mô hình 3D để render danh sách bài tập mà KHÔNG cần đăng nhập. Chỉ yêu cầu đăng nhập khi:
  - Thêm bài tập vào “Buổi tập hôm nay” hoặc “Thư viện của tôi”.
  - Lưu/ghi log buổi tập, đánh dấu yêu thích.
  - Theo dõi tiến độ (ảnh, cân nặng, số đo) và xem dashboard cá nhân.
- Lý do: Phù hợp hành vi thị trường (đa số web gym cho xem trước), tăng SEO, giảm ma sát trải nghiệm ban đầu và giúp tăng tỷ lệ chuyển đổi sang đăng ký/đăng nhập.
- Kỹ thuật (gợi ý triển khai):
  - FE: Cho phép navigation/explore tự do; khi user bấm “Thêm vào buổi tập”, “Lưu”, “Theo dõi tiến độ” → nếu chưa đăng nhập, hiển thị modal yêu cầu login/signup.
  - BE: Bảo vệ các endpoint ghi dữ liệu (logs, progress, favorites) bằng auth guard; endpoint đọc công khai (exercises, muscle groups) vẫn mở.

-------------------------------------------------------------------------------

**Landing Page — Các Khu Vực Chức Năng Cần Có**

- Hero + CTA: “Bắt đầu miễn phí”, “Khám phá bài tập”, “Đăng nhập/Đăng ký”.
- Highlight Mô hình 3D: demo chọn nhóm cơ và liên kết sang “Thư viện bài tập”.
- Thư viện bài tập (teaser): ô tìm kiếm + danh mục theo nhóm cơ nổi bật.
- Lợi ích Premium (Upsell): kế hoạch AI 4–8 tuần, điều chỉnh động, phân tích chuyên sâu, Nutrition AI nâng cao.
- Nutrition AI (teaser): ảnh động/trích ví dụ, CTA “Dùng thử nhanh”.
- Pricing tóm tắt (v1: bảng đơn giản, CTA “Nâng cấp” — tích hợp thanh toán ở Phase 2).
- Quy trình 3 bước: Onboarding → Kế hoạch/Buổi tập → Theo dõi/Phân tích.
- Trust & Social proof (placeholder): số bài tập, số người dùng, bảo mật.

-------------------------------------------------------------------------------

**Dashboard — Các Khối Chức Năng Cần Có**

- Free
  - Quick actions: “Bắt đầu buổi tập”, “Thêm bài tập”, “Cập nhật cân nặng”, “Scan món ăn (Nutrition AI)”.
  - Buổi tập hôm nay (draft/tạm thời): danh sách bài tập đã thêm, ghi set/reps/weight, “Hoàn tất buổi”.
  - Lịch sử gần đây: buổi tập vừa hoàn thành, tổng reps/volume.
  - Theo dõi tiến độ cơ bản: cân nặng gần đây, biểu đồ đường đơn giản tuần/tháng.
  - Gợi ý upsell khi chạm tính năng nâng cao (ví dụ: phân tích chi tiết, lịch tuần tự động).
- Premium (kích hoạt ở Phase 2)
  - “Buổi tập hôm nay” theo kế hoạch AI: bài tập, số set/reps đề xuất, RIR/RPE (optional).
  - Lịch tập tuần 4–8 tuần, highlight ngày hiện tại.
  - Điều chỉnh động (mỗi 2–4 tuần) dựa trên logs.
  - Phân tích chuyên sâu: total volume theo nhóm cơ/bài tập, ước tính 1RM, trend, PR.
  - Nutrition: kế hoạch bữa/ngày cơ bản (về sau tích hợp chặt hơn).

-------------------------------------------------------------------------------

**Phase 1 — Backlog “Map đủ” với fitnexus.md (ưu tiên triển khai nhanh)**

- Free — Khám phá & Bài tập
  - [FE] Mô hình 3D tương tác → chọn nhóm cơ → render danh sách primary/secondary (đã có). Tiếp tục refine mapping tên nhóm cơ 3D → slug chuẩn.
  - [FE] Thư viện bài tập: lọc cơ bản, xem chi tiết (đã có). Giữ browse công khai.
  - [BE] API exercises theo nhóm cơ/type, trả impact_level (đã có). Xem lại sorting/paging cho ổn định.

- Free — Buổi tập hôm nay & Ghi log
  - [FE] Trang “Buổi tập hôm nay”: thêm/xoá bài tập; ghi set/reps/weight; hoàn tất buổi.
  - [FE] Nút “Thêm vào buổi tập” tại `ExerciseList`/`ExerciseDetail` (nếu chưa login → modal đăng nhập).
  - [BE] Endpoint tạo/đóng buổi tập (`user_workout_logs`) + chi tiết set (`user_workout_log_details`), liệt kê lịch sử gần đây.

- Free — Theo dõi tiến độ cơ bản
  - [BE] Bổ sung model + endpoint `UserProgress`: lưu cân nặng, số đo cơ bản, ảnh tiến độ (upload đơn giản/local hoặc S3 ở Phase 2).
  - [FE] Trang “Tiến độ”: cập nhật cân nặng/số đo, biểu đồ cơ bản.

- Onboarding
  - [BE] Đã có flow step/field/answer + “firstIncomplete” (+ session). Giữ logic hiện tại.
  - [FE] Bổ sung màn hình tối thiểu cho các step cốt lõi (goal, experience, workout_frequency — đã có màn `workout_frequency`).

- Nutrition AI (hiện có)
  - [FE] Duy trì trang nhận diện món ăn & tính calo.
  - [FE] Giới hạn nhẹ cho user chưa đăng nhập (ví dụ: hiển thị kết quả nhưng không lưu lịch sử — lưu lịch sử ở Phase 2).

- Admin/Trainer (skeleton đủ để “map”)
  - Admin: giữ trang quản lý plan/role/lock/unlock đã có; CRUD nội dung (exercises/muscle/steps) để Phase 2.
  - Trainer: giữ route skeleton; tính năng chat/học viên để Phase 2/3.

- Bảo mật & Triển khai
  - Cấu hình cookie/session production: `secure:true`, `sameSite:'none'` (khi dùng HTTPS & cross-site);
  - Rate limit cho auth (đã có), thêm cache/header hợp lý cho `/api/exercises`.

Acceptance tiêu chuẩn Phase 1
- Người chưa login có thể:
  - Dùng mô hình 3D để xem danh sách bài tập; tìm kiếm/chi tiết bài tập;
  - Dùng Nutrition AI để xem kết quả (không lưu lịch sử);
  - Không thể lưu “Buổi tập hôm nay” hay ghi log nếu chưa login.
- Người đã login có thể:
  - Thêm bài tập vào “Buổi tập hôm nay”, ghi log set/reps/weight, hoàn tất buổi;
  - Cập nhật cân nặng/số đo và xem biểu đồ cơ bản;
  - Hoàn tất onboarding và vào dashboard.

-------------------------------------------------------------------------------

**Phase 2 — Backlog Tập Trung Lợi Nhuận & Độ Vững**

- Thanh toán & Paywall
  - Tích hợp Stripe Checkout + Webhook cập nhật `users.plan=PREMIUM`.
  - Trang Pricing + Upsell tại điểm chạm (ghi log nâng cao, phân tích, lịch AI).
  - Giới hạn Free: số buổi/tuần được lưu, tính năng phân tích nâng cao, lịch tuần tự động, lịch sử Nutrition.

- AI Coach v1.0 (Premium)
  - Sinh kế hoạch 4–8 tuần dựa onboarding (rule-based hoặc model nhỏ, chưa cần LLM lớn).
  - Điều chỉnh động mỗi 2–4 tuần dựa trên logs (tăng/giảm volume, thay bài tập).

- Phân tích Chuyên sâu
  - Total Volume theo nhóm cơ/bài tập, ước tính 1RM, PR, biểu đồ trend, compare kỳ trước.

- Nutrition nâng cao
  - Lưu lịch sử scan, tổng hợp macro/ngày/tuần, gợi ý kế hoạch bữa theo mục tiêu.

- Admin/Trainer
  - Admin: CRUD Exercises/MuscleGroups/Steps; moderation ảnh tiến độ; thống kê.
  - Trainer: quản lý học viên, chat realtime, gói PT (bán dịch vụ, revenue share — Phase 3 nếu cần).

- Observability & Growth
  - Sự kiện: onboarding_complete, workout_started/completed, add_set, upgrade_click, checkout_success.
  - Email onboarding/activation (Resend/SendGrid), chuẩn bị CRM tối thiểu.

Acceptance tiêu chuẩn Phase 2
- Có thanh toán thành công → `users.plan` đổi sang PREMIUM và paywall mở đúng tính năng.
- Dashboard Premium hiển thị “Buổi tập hôm nay” theo kế hoạch; biểu đồ nâng cao hoạt động; conversion có dữ liệu.

-------------------------------------------------------------------------------

**API/Model Cần Thêm (ưu tiên Phase 1)**

- Workout Logging
  - POST `/api/workouts/start` → tạo `user_workout_logs` (plan_id optional).
  - POST `/api/workouts/:logId/add-set` → thêm `user_workout_log_details` (exercise_id, set_number, reps, weight_kg,...).
  - POST `/api/workouts/:logId/finish` → cập nhật `ended_at`, tổng kết.
  - GET `/api/workouts/recent` → danh sách buổi gần đây của user (limit/paging).

- User Progress
  - Model `user_progress` (user_id, weight, measurements JSON, progress_photos, created_at...)
  - GET `/api/progress` (list/paging), POST `/api/progress` (create/update đơn giản), upload ảnh (Phase 2 có thể chuyển S3).

-------------------------------------------------------------------------------

**Rủi Ro/Phụ Thuộc**

- Dữ liệu exercises/steps cần đủ phong phú để biểu đồ/analytics có ý nghĩa.
- Cấu hình cookie/CORS khi production; CDN tĩnh cho mô hình 3D/ML để tối ưu tải.
- Stripe cần domain/HTTPS để test webhook; cân nhắc module thanh toán nội địa nếu cần.

-------------------------------------------------------------------------------

**Câu Hỏi Cần Xác Nhận**

1) Chốt chính sách: Cho phép người chưa đăng nhập xem toàn bộ bài tập + mô hình 3D (browse), chỉ yêu cầu login khi lưu/thêm/ghi log? (Khuyến nghị: CÓ)
2) Phase 1 có triển khai tối thiểu “Buổi tập hôm nay” + ghi log end-to-end ngay, hay chấp nhận trước bản local-draft rồi mới thêm API? (Khuyến nghị: làm end-to-end ngay vì migrations đã sẵn.)
3) Trang Landing có cần Pricing tóm tắt ở Phase 1 (không thanh toán) hay để Phase 2 mới hiển thị? (Khuyến nghị: hiển thị sớm để tăng nhận biết.)

-------------------------------------------------------------------------------

Gợi ý tiến độ: 1) Workout logging + Progress cơ bản; 2) Landing + Dashboard Free; 3) Onboarding step còn thiếu; 4) Chuẩn bị Paywall/Stripe (đầu Phase 2).

