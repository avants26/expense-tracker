const Expense = require('../models/Expense');
const { DateTime } = require('luxon');

// @desc    Get all expenses for the logged in user
// @route   GET /api/expenses
exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (err) {
        next(err);
    }
};

// @desc    Add expense for the logged in user
// @route   POST /api/expenses
exports.addExpense = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ success: false, error: 'No expense found' });
        }

        // Make sure user owns expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await expense.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// Analytics Controllers

// @desc    Get daily analytics
exports.getDailyAnalytics = async (req, res, next) => {
    try {
        const today = DateTime.now().startOf('day');
        const endOfToday = DateTime.now().endOf('day');

        const analytics = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: today.toJSDate(), $lte: endOfToday.toJSDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({ success: true, data: analytics[0] || { totalAmount: 0, count: 0 } });
    } catch (err) {
        next(err);
    }
};

// @desc    Get weekly analytics
exports.getWeeklyAnalytics = async (req, res, next) => {
    try {
        const sevenDaysAgo = DateTime.now().minus({ days: 7 }).startOf('day');
        
        const analytics = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: sevenDaysAgo.toJSDate() }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        next(err);
    }
};

// @desc    Get monthly analytics
exports.getMonthlyAnalytics = async (req, res, next) => {
    try {
        const startOfMonth = DateTime.now().startOf('month');
        
        const analytics = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfMonth.toJSDate() }
                }
            },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        next(err);
    }
};

// @desc    Get yearly analytics
exports.getYearlyAnalytics = async (req, res, next) => {
    try {
        const startOfYear = DateTime.now().startOf('year');
        
        const analytics = await Expense.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: { $gte: startOfYear.toJSDate() }
                }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedAnalytics = analytics.map(item => ({
            month: monthNames[item._id],
            totalAmount: item.totalAmount
        }));

        res.status(200).json({ success: true, data: formattedAnalytics });
    } catch (err) {
        next(err);
    }
};
