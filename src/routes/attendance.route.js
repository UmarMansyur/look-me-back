const router = require("express").Router();
const { attendanceController } = require("../controller");
const authorize = require("../middleware/auth");
router.post("/", attendanceController.createAttendanceController);
router.get("/", attendanceController.getAllAttendanceController);
router.get("/report", authorize(['Kepala Pegawai', 'Administrator']), attendanceController.reportAttendanceController);
router.get("/attendance/:id", authorize(['Kepala Pegawai', 'Pegawai', 'Administrator']), attendanceController.getOneAttendanceController);

module.exports = router;
