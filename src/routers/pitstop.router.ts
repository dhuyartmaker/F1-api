import express from "express";
import fastestLapsController from "../controllers/fastest-laps.controller";
import pitstopController from "../controllers/pitstop.controller";

const router = express.Router();

router.get("/", pitstopController.getAll)


export default router;