const express = require('express');
const router = express.Router();
const { 
    getExpenses, 
    addExpense, 
    deleteExpense,
    getDailyAnalytics,
    getWeeklyAnalytics,
    getMonthlyAnalytics,
    getYearlyAnalytics
} = require('../controllers/expenseController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getExpenses)
    .post(addExpense);

router.route('/:id')
    .delete(deleteExpense);

router.get('/analytics/daily', getDailyAnalytics);
router.get('/analytics/weekly', getWeeklyAnalytics);
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/analytics/yearly', getYearlyAnalytics);

module.exports = router;