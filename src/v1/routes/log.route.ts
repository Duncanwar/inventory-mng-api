import { Router } from "express";

import EventLoggerController from "../controllers/log/log.controller";

const router = Router();

router.get("/", EventLoggerController.getLogs);

export default router;
