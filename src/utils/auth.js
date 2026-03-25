import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });
};
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
    return null;
  }
    }
export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateId = (prefix) => {
  return `${prefix}_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
};
