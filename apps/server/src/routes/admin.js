const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { Service, User } = require('../models');

// @route GET api/admin/services/pending
// @desc Get all pending services
// @access Private (Admin only)
router.get('/services/pending', [authMiddleware, isAdmin], async (req, res) => {
try {
const pendingServices = await Service.findAll({
where: { status: 'pending' },
include: { model: User, as: 'partner', attributes: ['name'] },
order: [['createdAt', 'ASC']] // Tampilkan yang terlama dulu
});
res.json(pendingServices);
} catch (err) {
console.error(err.message);
res.status(500).send('Server Error');
}
});

// @route PUT api/admin/services/:id/status
// @desc Approve or reject a service
// @access Private (Admin only)
router.put('/services/:id/status', [authMiddleware, isAdmin], async (req, res) => {
const { status } = req.body; // status bisa 'approved' atau 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Service not found' });
        }

        service.status = status;
        await service.save();

        res.json(service);
    } catch (err)        {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;