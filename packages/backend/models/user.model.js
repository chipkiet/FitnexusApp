import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/database.js"; 

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'password_hash', // Ánh xạ tới tên cột trong DB
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'full_name',
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar_url',
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'date_of_birth',
    },
    gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
        allowNull: true,
    },
    provider: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'local',
    },
    providerId: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'provider_id',
    },
    role: {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'user',
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
        allowNull: false,
        defaultValue: 'active',
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_login_at',
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // Hooks để băm mật khẩu (sẽ thêm sau)
    hooks: {}
});

export default User;