const { Router } = require('express');
const authController = require('../controllers/authController');
const dataController = require('../controllers/dataController');
const router = Router();

router.post('/is_correct_user',authController.is_correct_user);
router.post('/Osignup_user',authController.user_login);
router.post('/add_transaction',dataController.add_transaction);
router.post('/get_transaction_categories',dataController.get_transaction_categories);
router.post('/get_transaction_vendors',dataController.get_transaction_vendors);
router.post('/get_transaction',dataController.get_transaction);
router.post('/get_all_transactions',dataController.get_all_transactions);
router.post('/get_all_transactions_by_date',dataController.get_all_transactions_by_date);
router.post('/delete_transaction',dataController.delete_transaction);
router.post('/add_reminder',dataController.add_reminder);
router.post('/get_reminder_vendors',dataController.get_reminder_vendors);
router.post('/delete_reminder',dataController.delete_reminder);
router.post('/get_reminder',dataController.get_reminder);

module.exports = router;