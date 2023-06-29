import express from "express";
import resultController from "../controllers/result.controller";

const router = express.Router();

router.get("/", resultController.getAll)
router.get("/starting-grid", resultController.getStartingGrid)


export default router;