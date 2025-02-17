const authController = require("./auth.controller");
const roleController = require('./role.controller');
const holiDayController = require('./holiday.controller');
const operatingHoursController = require('./operating_hours.controller');
const institutionController = require('./institution.controller');
const blacklistController = require('./blacklist.controller');
const permissionRequestController = require('./permission_request.controller');
const warningLetterController = require('./warning_letter.controller');
const attendanceController = require('./attendance.controller');
const dashboardController = require('./dashboard.controller');
const notificationController = require('./notification.controller');

module.exports = {
    authController,
    roleController,
    holiDayController,
    operatingHoursController,
    institutionController,
    blacklistController,
    permissionRequestController,
    warningLetterController,
    attendanceController,
    dashboardController,
    notificationController
};