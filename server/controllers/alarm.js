const crypto = require('crypto');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc      Get alarm data
// @route     GET /api/v1/alarm
// @access    Public
exports.getAlarm = asyncHandler(async (req, res, next) => {
  // Read JSON files
  const alarm = JSON.parse(
    fs.readFileSync(`${__dirname}/../_data/alarm.json`, 'utf-8')
  );

  res.status(200).json(alarm);
});