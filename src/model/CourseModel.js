const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    topics: {
        type: [String],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    approvedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Course", courseSchema);
