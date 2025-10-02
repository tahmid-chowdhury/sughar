const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Unit = require('../models/Unit');
const ServiceRequest = require('../models/ServiceRequest');

// @route   GET api/home/stats
// @desc    Get stats for home dashboard
// @access  Private (auth middleware would be added here)
router.get('/stats', async (req, res) => {
    try {
        const openRequests = await ServiceRequest.countDocuments({ status: 'Pending' });
        const vacantUnits = await Unit.countDocuments({ status: 'Vacant' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find units where lease ends today or has ended
        const overdueUnits = await Unit.find({
            leaseEndDate: { $lte: today },
            status: 'Occupied' 
        }).populate('tenant', 'firstName lastName');

        // Find units where lease is ending in the next 30 days
        const nextMonth = new Date();
        nextMonth.setDate(today.getDate() + 30);
        const endingSoonUnits = await Unit.find({
            leaseEndDate: { $gt: today, $lte: nextMonth },
            status: 'Occupied'
        }).populate('tenant', 'firstName lastName');

        const highPriorityTenants = [...overdueUnits, ...endingSoonUnits].map(unit => {
            if (!unit.tenant) return null;
            
            const diffTime = today.getTime() - new Date(unit.leaseEndDate).getTime();
            const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // Show 0 if not overdue yet

            return {
                id: unit.tenant._id,
                name: `${unit.tenant.firstName} ${unit.tenant.lastName}`,
                avatar: `https://i.pravatar.cc/40?u=${unit.tenant._id}`,
                unit: `Unit ${unit.unitNumber}`, // Simplified display
                daysOverdue: diffDays,
            }
        }).filter(Boolean); // Filter out nulls if tenant is not populated

        const homeData = {
            stats: [
                { label: 'Open Service Requests', value: openRequests.toString(), icon: 'Wrench', color: 'orange' },
                { label: 'Vacant Units', value: vacantUnits.toString(), icon: 'HomeIcon', color: 'red' },
                { label: 'Leases Expired', value: overdueUnits.length.toString(), icon: 'FileWarning', color: 'yellow' },
                { label: 'Leases Ending Soon', value: endingSoonUnits.length.toString(), icon: 'Users', color: 'green' },
            ],
            // Financial and volume data remains static as we don't have historical data
            financialOverview: [
                { month: 'Jan', profit: 18000 }, { month: 'Feb', profit: 22000 },
                { month: 'Mar', profit: 28000 }, { month: 'Apr', profit: 20000 },
                { month: 'May', profit: 16000 }, { month: 'Jun', profit: 21000 },
                { month: 'Jul', profit: 20000 }, { month: 'Aug', profit: 35000 },
                { month: 'Sep', profit: 27000 }, { month: 'Oct', profit: 24000 },
                { month: 'Nov', profit: 18000 }, { month: 'Dec', profit: 23000 },
            ],
            serviceRequestVolume: [
                { month: 'Mar', new: 20, completed: 15 }, { month: 'Apr', new: 25, completed: 20 },
                { month: 'May', new: 30, completed: 28 }, { month: 'Jun', new: 28, completed: 22 },
                { month: 'Jul', new: 35, completed: 30 }, { month: 'Aug', new: 40, completed: 38 },
            ],
            highPriorityTenants,
        };

        res.json(homeData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;