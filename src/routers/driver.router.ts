import express from "express";
import driverController from "../controllers/driver.controller";

const router = express.Router();

router.get("/", driverController.getAll)
router.get("/detail", driverController.getDetailDriverByYear)


export default router;