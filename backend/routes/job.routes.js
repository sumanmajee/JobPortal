import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js";
import { postJob, getAllJobs, getASingleJob, getMyJobs, deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", getASingleJob)

export default router;