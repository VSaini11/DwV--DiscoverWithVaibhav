import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    likedDiscoveries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
