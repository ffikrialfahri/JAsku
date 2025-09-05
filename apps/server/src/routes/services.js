const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');
const { Service, User } = require('../models');

// Middleware untuk cek apakah user adalah PARTNER
const isPartner = (req, res, next) => {
    if (req.user && req.user.role === 'PARTNER') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Only partners can perform this action.' });
    }
};

// @route   POST api/services
// @desc    Create a new service
// @access  Private (Partner only)
router.post('/', [authMiddleware, isPartner], async (req, res) => {
    const { title, description, category, price } = req.body;
    try {
        const newService = await Service.create({
            title, description, category, price, userId: req.user.id
        });
        res.json(newService);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/services
// @desc    Get all services for homepage
// @access  Public
router.get('/', async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { status: 'approved' }, // Hanya ambil yang statusnya 'approved'
            include: { model: User, as: 'partner', attributes: ['name'] },
            order: [['createdAt', 'DESC']]
        });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- RUTE SPESIFIK HARUS DI ATAS RUTE DINAMIS ---

// @route   GET api/services/my-services
// @desc    Get all services for the logged-in partner
// @access  Private (Partner only)
router.get('/my-services', [authMiddleware, isPartner], async (req, res) => {
    try {
        const services = await Service.findAll({ where: { userId: req.user.id } });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/services/search
// @desc    Search for services by keyword
// @access  Public
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ msg: 'Search query is required' });
        }
        const services = await Service.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${q}%` } },
                    { description: { [Op.iLike]: `%${q}%` } }
                ]
            },
            include: { model: User, as: 'partner', attributes: ['name'] }
        });
        res.json(services);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- RUTE DINAMIS (DENGAN :id) DIMULAI DARI SINI ---

// @route   GET api/services/:id
// @desc    Get a single service by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id, {
            include: { model: User, as: 'partner', attributes: ['name'] }
        });
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private (Partner only, owner only)
router.put('/:id', [authMiddleware, isPartner], async (req, res) => {
    const { title, description, category, price } = req.body;
    try {
        let service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        if (service.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        service.title = title || service.title;
        service.description = description || service.description;
        service.category = category || service.category;
        service.price = price || service.price;
        await service.save();
        res.json(service);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private (Partner only, owner only)
router.delete('/:id', [authMiddleware, isPartner], async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }
        if (service.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await service.destroy();
        res.json({ msg: 'Service removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;