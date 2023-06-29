import express from "express";
import driverRouter from "./driver.router";
import resultRouter from "./result.router";

const router = express.Router();

router.use("/drivers", driverRouter);
router.use("/races", resultRouter);

export default router;