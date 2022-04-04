const express = require('express');
const { getAlarm } = require('../controllers/alarm');

const router = express.Router();

router.route('/').get(getAlarm);

module.exports = router;
