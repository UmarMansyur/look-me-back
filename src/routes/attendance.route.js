const router = require("express").Router();
const { attendanceController } = require("../controller");

router.post("/", attendanceController.createAttendanceController);
router.get("/", attendanceController.getAllAttendanceController);
router.get("/:id", attendanceController.getOneAttendanceController);

module.exports = router;
