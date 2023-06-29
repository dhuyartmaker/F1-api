import express from "express";
import driverRouter from "./driver.router";
import resultRouter from "./result.router";
import qualiyingRouter from "./qualifying.router";

const router = express.Router();

router.use("/drivers", driverRouter);
router.use("/races", resultRouter);
router.use("/qualifying", qualiyingRouter);

export default router;