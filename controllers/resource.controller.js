// Logic for handling requests

const Resource = require('../models/resource.model');

const resourceController = {
    // Create new resource
    create: async (req, res) => {
        try {
            const resource = new Resource(req.body);
            const savedResource = await resource.save();
            res.status(201).json(savedResource);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get all resources with pagination
    getAll: async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const resources = await Resource.find({ status: 'active' })
                .limit(limit)
                .skip((page - 1) * limit)
                .exec();
            res.json(resources);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

};

module.exports = resourceController;