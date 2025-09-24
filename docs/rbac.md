# RBAC Matrix

## Roles
- USER: Quyền cơ bản sau khi đăng nhập.
- TRAINER: Quyền HLV, bao gồm tất cả của USER + công cụ HLV.
- ADMIN: Quyền quản trị hệ thống.

## Plans
- FREE: Gói miễn phí mặc định.
- PREMIUM: Gói trả phí, mở tính năng nâng cao.

## Nguyên tắc
- 401 Unauthorized: Chưa xác thực (thiếu/invalid token).
- 403 Forbidden: Đã xác thực nhưng thiếu quyền/plan.
- Role trong JWT có thể trễ so với DB; các route nhạy cảm nên kiểm từ DB.
- Plan nên kiểm từ DB để phản ánh thay đổi ngay.

## Ma trận (draft)
- Public
  - POST /api/auth/register → Public
  - POST /api/auth/login → Public (+ rate limit)
  - POST /api/auth/refresh → Public (yêu cầu refresh token hợp lệ)
  - GET  /api/auth/check-username|check-email|check-phone → Public
- Authenticated
  - GET  /api/auth/me → USER | TRAINER | ADMIN
- Admin-only (định hướng)
  - ANY  /api/admin/* → ADMIN
- Trainer-only (định hướng)
  - ANY  /api/trainer/* → TRAINER | ADMIN
- Premium-only (định hướng)
  - ANY  /api/premium/* → plan: PREMIUM (bất kể role)

## Ghi chú triển khai
- Middleware:
  - authGuard → xác thực JWT, gắn req.userId, req.userRole
  - authorizeRoles(...roles) → chặn theo vai trò
  - requirePlans(...plans) → chặn theo gói (check DB)
- Lỗi trả về JSON thống nhất: { success: false, message }
- Có thể mở rộng: audit log, jti + revoke list, per-route rate limits.

