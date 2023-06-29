import express from "express";
import driverRouter from "./driver.router";
import resultRouter from "./result.router";
import qualiyingRouter from "./qualifying.router";
import fastestLapsRouter from "./fastest-laps.router";
import startingGridRouter from "./starting-grid.router"
import pitStopRouter from "./pitstop.router"
import practiceRouter from "./practice.router"
import teamRouter from "./team.router"

const router = express.Router();

router.use("/drivers", driverRouter);
router.use("/races", resultRouter);
router.use("/qualifying", qualiyingRouter);
router.use("/fastest-laps", fastestLapsRouter);
router.use("/starting-grid", startingGridRouter);
router.use("/pit-stops", pitStopRouter);
router.use("/practice", practiceRouter);
router.use("/team", teamRouter);

export default router;