import express from "express";
import qualifyingController from "../controllers/qualifying.controller";

const router = express.Router();

router.get("/", qualifyingController.getAll)


export default router;