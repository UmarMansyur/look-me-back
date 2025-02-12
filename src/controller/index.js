const authController = require("./auth.controller");
const roleController = require('./role.controller');
const holiDayController = require('./holiday.controller');
const operatingHoursController = require('./operating_hours.controller');
const institutionController = require('./institution.controller');

module.exports = {
    authController,
    roleController,
    holiDayController,
    operatingHoursController,
    institutionController
};