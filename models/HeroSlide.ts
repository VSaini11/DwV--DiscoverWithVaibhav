import mongoose from 'mongoose'

const HeroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title.'],
    },
    subtitle: {
        type: String,
        required: [true, 'Please provide a subtitle.'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description.'],
    },
    image: {
        type: String, // Base64 or URL
    },
    bg: {
        type: String,
        default: '#ffffff',
    },
    buttonText: {
        type: String,
        default: 'Discover Now',
    },
    buttonLink: {
        type: String,
        default: '#',
    },
    isTextOnly: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema)
