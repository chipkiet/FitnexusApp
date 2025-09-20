import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/database.js"; 
import bcrypt from 'bcrypt';

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
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
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
        defaultValue: 'USER',
    },
    status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BANNED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
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
    hooks: {
        beforeCreate: async(user) => {
            if(user.passwordHash) {
                const saltRounds = 12;
                user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);

            }
        },

        //Hash password truoc khi update password  (neu co change pass)
        beforeUpdate: async(user) => {
            if(user.changed('passwordHash') && user.passwordHash) {
                const saltRounds = 12;
                user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
            }
        }
    }
});

// Instance method 
User.prototype.comparePassword = async function(candidatePassword) {
    if(!this.passwordHash ) return false;
    return bcrypt.compare(candidatePassword, this.passwordHash);
}

// Static method
User.findByEmail = function(email) {
    return this.findOne({where : {email}});
}

User.findByUsername = function(username) {
    return this.findOne({where: {username}});
}

export default User;
