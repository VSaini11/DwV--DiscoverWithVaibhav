import mongoose from 'mongoose'

const DealSchema = new mongoose.Schema({
    slot: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 4
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for this deal.'],
    },
    image: {
        type: String, // Base64 or URL
        required: [true, 'Please provide an image.'],
    },
    link: {
        type: String,
        required: [true, 'Please provide a product link.'],
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema)
