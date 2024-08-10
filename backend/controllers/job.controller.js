import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/error.middleware.js";
import { Job } from "../models/job.model.js";

export const postJob = catchAsyncError(async (req, res, next) => {
    const {
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsiteTitle,
        personalWebsiteUrl,
        jobNiche,
    } = req.body;
    if (
        !title ||
        !jobType ||
        !location ||
        !companyName ||
        !introduction ||
        !responsibilities ||
        !qualifications ||
        !salary ||
        !jobNiche
    ) {
        return next(new ErrorHandler("Please provide full job details.", 400));
    }
    if (
        (personalWebsiteTitle && !personalWebsiteUrl) ||
        (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
        return next(
        new ErrorHandler("Provide both the website url and title, or leave both blank.",400)
        );
    }
    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        jobType,
        location,
        companyName,
        introduction,
        responsibilities,
        qualifications,
        offers,
        salary,
        hiringMultipleCandidates,
        personalWebsite: {
            title: personalWebsiteTitle,
            url: personalWebsiteUrl,
        },
        jobNiche,
        postedBy,
    });
    res.status(201).json({
        success: true,
        message: "Job posted successfully.",
        job,
    });
    });

    export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const { city, niche, searchKeyword } = req.query;
    const query = {};
    if (city) {
        query.location = { $regex: city, $options: "i" };
    }
    if (niche) {
        query.jobNiche = { $regex: niche, $options: "i" };
    }
    if (searchKeyword) {
        query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
        ];
    }
    const jobs = await Job.find(query);
    res.status(200).json({
        success: true,
        jobs,
        count: jobs.length,
    });
    });

    export const getMyJobs = catchAsyncError(async (req, res, next) => {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myJobs,
    });
    });

    export const deleteJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Oops! Job not found.", 404));
    }
    await job.deleteOne();
    res.status(200).json({
        success: true,
        message: "Job deleted.",
    });
    });

    export const getASingleJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
        return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
        success: true,
        job,
    });
});