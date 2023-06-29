import express from "express";
import teamController from "../controllers/team.controller";

const router = express.Router();

router.get("/", teamController.getAll)


export default router;