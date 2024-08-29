const {Router} = require('express');
const {verifyToken} = require('../middlewares/verifytoken.js');
const {getAllNotifications, deleteNotifications} = require('../controllers/notification.js')

const router = Router();

router.get('/', verifyToken, getAllNotifications);
router.delete('/', verifyToken, deleteNotifications);

module.exports = router