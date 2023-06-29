import express from "express";
import fastestLapsController from "../controllers/fastest-laps.controller";

const router = express.Router();

router.get("/", fastestLapsController.getAll)


export default router;