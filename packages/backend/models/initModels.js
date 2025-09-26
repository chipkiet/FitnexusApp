// models/initModels.js
import User from "./user.model.js";
import PasswordReset from "./passwordReset.model.js";

export function initModels() {
  // Khai báo quan hệ 1-n: User hasMany PasswordReset
  User.hasMany(PasswordReset, {
    foreignKey: "user_id",
    sourceKey: "user_id",
    onDelete: "CASCADE",
  });

  // PasswordReset belongsTo User
  PasswordReset.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id",
    onDelete: "CASCADE",
  });

  // Trả ra để dùng nếu bạn muốn
  return { User, PasswordReset };
}
