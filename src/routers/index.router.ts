import express from "express";
import driverRouter from "./driver.router";
import resultRouter from "./result.router";
import qualiyingRouter from "./qualifying.router";
import fastestLapsRouter from "./fastest-laps.router";


const router = express.Router();

router.use("/drivers", driverRouter);
router.use("/races", resultRouter);
router.use("/qualifying", qualiyingRouter);
router.use("/fastest-laps", fastestLapsRouter);


export default router;