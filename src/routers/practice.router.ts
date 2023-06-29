import express from "express";
import fastestLapsController from "../controllers/fastest-laps.controller";
import practiveController from "../controllers/practive.controller";

const router = express.Router();

router.get("/", practiveController.getAll)


export default router;