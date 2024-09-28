const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // email is still unique
    password: { type: String, required: true },
    profile: { type: String, default: '' },
    location: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isActive: { type: Boolean, default: true },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
