import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  role: { type: String, enum: ['user', 'therapist', 'admin'], default: 'user' },
  auth: {
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    verified: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

UserSchema.methods.hasPermission = function(permission) {
  const permissions = {
    user: ['read_own', 'write_own'],
    therapist: ['read_own', 'write_own', 'read_users', 'manage_sessions'],
    admin: ['read_own', 'write_own', 'read_users', 'manage_sessions', 'manage_users', 'system_admin']
  };
  return permissions[this.role]?.includes(permission) || false;
};

export default mongoose.model('User', UserSchema);