var express = require("express");
var router = express.Router();
const usersController = require("../controllers/userscontrole");
const { adminGuard } = require("../controllers/authmiddleware");
const multer = require("multer");

/* GET users listing. */
router.get("/", usersController.getUsers);

router.post("/update", usersController.postUserUpdate);

router.post("/changePassword", usersController.postChangePassword);

router.get("/admin", adminGuard, usersController.getAdmin);

router.post(
  "/admin/add",
  adminGuard,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "images");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    }),
  }).single("image"),
  usersController.postAdd
);

module.exports = router;
