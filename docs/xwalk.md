Xwalk Data Guide (Normalized-First)

Mục tiêu
- Đơn giản hóa: dùng duy nhất một nguồn dữ liệu đã chuẩn hóa để import vào DB. Tất cả logic alias và nguồn thô được loại bỏ khỏi quy trình thường nhật để giảm nhầm lẫn.

Nguồn sự thật (source of truth)
- `data/xwalk/xwalk_exercise.normalized.json`: chứa đầy đủ thông tin bài tập, đã có các trường slug chuẩn:
  - `target_muscle_slugs`: danh sách slug chuẩn thuộc taxonomy DB
  - `secondary_muscle_slugs`: danh sách slug chuẩn (không trùng với target)
  - Các trường gốc phục vụ hiển thị như `name`, `name_en`, `gif_url`, `equipment_keys`, `bodyparts_keys`…

Script hỗ trợ (validate/prepare)
- `scripts/normalize_exercise_muscles.js` (đã cập nhật, alias npm: xwalk:prepare):
  - Đọc `data/xwalk/xwalk_exercise.normalized.json`.
  - Kiểm tra hợp lệ: mọi slug trong `*_muscle_slugs` phải thuộc taxonomy đã seed trong DB.
  - Tạo file sẵn sàng import: `data/xwalk/xwalk_exercise.import.json` với các cột gần sát schema:
    - `slug`, `name`, `name_en`, `gif_demo_url` (từ `gif_url`), `equipment_needed` (từ phần tử đầu của `equipment_keys`), `target_muscle_slugs`, `secondary_muscle_slugs`.
  - In cảnh báo nếu gặp slug không hợp lệ.

Importer (nạp DB)
- `scripts/import_exercises.js` (alias npm: xwalk:import):
  - Đọc `data/xwalk/xwalk_exercise.import.json` và kết nối DB qua Sequelize backend.
  - Upsert `exercises` theo `slug`; thay thế toàn bộ liên kết cơ trong `exercise_muscle_group` cho bài tập đó (primary/secondary).
  - Tuỳ chọn: `--dry` (không ghi DB), `--limit N` (chỉ import N dòng đầu).

Khi nào chạy script
- Bất cứ khi nào bạn chỉnh sửa `xwalk_exercise.normalized.json`.
- Trước khi import vào DB để sinh ra `xwalk_exercise.import.json` dùng cho ETL.
- Sau đó chạy importer để nạp DB.

Cách chạy nhanh
- Chuẩn bị file import: `npm run xwalk:prepare`
- Nạp DB: `npm run xwalk:import` (tuỳ chọn `-- --dry` hoặc `-- --limit 100`).

Import vào DB (gợi ý)
- Bảng `exercises`: upsert theo `slug` các trường cơ bản (`name`, `name_en`, `gif_demo_url`, `equipment_needed`, …).
- Bảng nối `exercise_muscle_group`:
  - Với mỗi slug trong `target_muscle_slugs` → `impact_level = 'primary'`.
  - Mỗi slug trong `secondary_muscle_slugs` → `impact_level = 'secondary'` (loại trùng với target trước khi ghi).

Các file đã loại bỏ
- Đã xóa các file xwalk gốc để giảm nhiễu cho dự án mới bắt đầu:
  - `xwalk_exercise.json`, `xwalk_bodyparts.json`, `xwalk_muscles.json`, `xwalk_equipment.json`.
- Lý do: schema hiện tại không có bảng `bodyparts`/`equipment` riêng và việc giữ nhiều từ điển/alias khiến quy trình khó hiểu. Khi cần, có thể bổ sung lại taxonomy + importer tương ứng.

Tiêu chí chất lượng
- `exercises.slug` duy nhất, kebab-case, ≤ 255 ký tự.
- Tất cả slug trong `*_muscle_slugs` thuộc tập taxonomy đã seed bởi migrations.
- Không trùng lặp giữa primary/secondary; đảm bảo `equipment_needed` là chuỗi ngắn gọn.

Mở rộng sau này
- Nếu bạn muốn quay lại mô hình “raw + alias mapping”, có thể:
  - Khôi phục một file map alias → slug (ví dụ `data/xwalk/muscle_alias_map.json`).
  - Viết/khôi phục script để sinh lại `xwalk_exercise.normalized.json` từ dữ liệu thô.
  - Hiện tại, quy trình normalized-first là đủ an toàn và dễ dùng cho dự án bắt đầu.
