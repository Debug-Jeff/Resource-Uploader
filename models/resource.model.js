// Resource schema for MongoDB

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
    lastModified: { type: Date, default: Date.now },
    path: { type: String, required: true },
    thumbnailPath: { type: String },
    uploadedBy: {
        userId: { type: String, required: true },
        username: { type: String, required: true }
    },
    metadata: {
        width: Number,
        height: Number,
        duration: Number,
        format: String
    },
    tags: [String],
    category: String,
    status: { 
        type: String, 
        enum: ['active', 'archived', 'deleted'],
        default: 'active'
    },
    downloads: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: true }
});

module.exports = mongoose.model('Resource', resourceSchema);