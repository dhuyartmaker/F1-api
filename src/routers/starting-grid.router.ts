import express from "express";
import fastestLapsController from "../controllers/fastest-laps.controller";
import startingGridController from "../controllers/starting-grid.controller";

const router = express.Router();

router.get("/", startingGridController.getAll)


export default router;