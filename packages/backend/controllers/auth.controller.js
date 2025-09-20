import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Op } from "sequelize";


// Khoi tao ham giup do de tao JWT
const generateTokens = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Helper function de tra ve user data
const getUserData = (user) => {
    const { passwordHash, providerId, ...userData } = user.toJSON();
    return userData; 
}

export const register = async (req, res) => {
    try {
        const errors = validationResult(req) ;
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                message: 'Validation failed -- hú hú đang có lỗi validation rồi',
                errors:  errors.array()
            });
        }

        const { username, email , password, fullName } = req.body;
        
        // check if user is already
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    {email},
                    {username}
                ]
            }
        });

        if(existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({
                success: false,
                message: `User with ${field} already exists`,
                errors: [{
                    field,
                    message: `${field} is already taken`
                }]
            });
        }

        const newUser = await User.create({
            username,
            email,
            passwordHash: password,
            fullName: fullName || null,
            provider: 'local'
        });

        const token = generateTokens(newUser.user_id);

        res.status(201).json({
            success:true,
            message: 'User register successfully - đăng ký thành công rồi',
            data: { 
                user: getUserData(newUser),
                token
            }
        });
    } catch(error) {
        console.error('Registration error:', error);
        if(error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return res.status(400).json({
                success: false,
                message: `${field} is already exist`,
                errors: [{
                    field,
                    message: `${field} is already taken`
                }]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error ',
            errors: {

            }
        })
    }
}