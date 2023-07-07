const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/User")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetchUser = require('../middleware/fetchUser');
const Jobcategory = require('../models/Jobcategory');
const Jobtype = require('../models/Jobtype');
const Joblisting = require('../models/Joblisting');
const Candidate = require('../models/candidate');
const Applicant = require('../models/applicants');
const JWT_SECRET = "abhishekpathak"


router.get('/', async (req, res) => {
    res.send("Working /api/v1/util")
})

router.post('/user', [
    body('name', 'Name Required').exists(),
    body('email', 'email Required').isEmail(),
    body('password', 'Min Length should be 6').isLength({ min: 6 }),
], async (req, res) => {
    // console.log(req.body)
    console.log("inside create user")

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    const { name, email, password } = req.body;

    // check if member is already present or not
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ status: 0, message: "User already exists" })
        }
        const salt = await bcrypt.genSaltSync(10);
        const secPassword = await bcrypt.hash(password, salt);

        const newMember = await User.create({
            name, email, password: secPassword,
        })

        const data = {
            user: {
                id: newMember.id
            }
        }

        let authtoken = jwt.sign(data, JWT_SECRET);

        res.status(200).json({ message: authtoken, status: 1 })

    } catch (error) {
        console.log("create: " + erorr)
        res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.get('/user', fetchUser, async (req, res) => {
    let id = req.user.id;

    try {

        let user = await User.findById({ _id: id }).select("-password");
        if (!user) {
            return res.status(400).json({ status: 0, message: "Some error occured" })
        }

        res.status(200).json({
            status: 0,
            message: user
        })

    } catch (error) {
        console.log("create: " + erorr)
        res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})


router.post('/login', [
    body('email', 'email Required').isEmail(),
    body('password', 'Min Length should be 6').exists(),
], async (req, res) => {
    // console.log(req.body)
    console.log("inside login user")

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    const { email, password } = req.body;

    // check if member is already present or not
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 0, message: "Enter a valid credentials" })
        }
        // compare password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ status: 0, message: "Enter correct credentials" });
        }
        // save id in token
        let data = {
            user: {
                id: user.id
            }
        }
        let authtoken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({ status: 1, message: authtoken });

    } catch (error) {
        console.log("create: " + erorr)
        res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.post('/category', [
    body('name', 'Category Required').exists(),
], fetchUser, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    const { name } = req.body;

    try {
        let adminId = req.user.id;

        let checkadmin = await User.findById({ _id: adminId, role: 0 });

        if (!checkadmin) {
            res.status(404).json({ status: 0, message: "Not authorised" })
        }

        let cat = await Jobcategory.findOne({ name: name });
        if (cat) {
            return res.status(400).json({
                status: 0,
                message: "Category already exists"
            })
        }
        let newCategory = await Jobcategory.create({
            name: name,
            adminId: adminId
        })
        res.status(200).json({
            message: "new category added",
            status: 1,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.post('/jobtype', [
    body('name', 'Job type Required').exists()

], fetchUser, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    const { name, categoryId } = req.body;

    // name -> job type name
    // id -> category id
    // admin -> admin id
    let adminId = req.user.id;
    try {
        let checkadmin = await User.findById({ _id: adminId, role: 0 });

        if (!checkadmin) {
            res.status(404).json({ status: 0, message: "Not authorised" })
        }

        let t = await Jobtype.findOne({ name: name });

        if (t) {
            return res.status(400).json({
                status: 0,
                message: "Job Type already exists"
            })
        }

        let newJobType = await Jobtype.create({
            name,
            adminId,
            jobCategoryId: categoryId
        })

        res.status(200).json({
            message: "new Job type created",
            status: 1,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

/** 
 * body ->
 * 
 * adminId
 * jobCategoryId
 * jobTypeId
 * 
 * title -> String
 * companydetails.name
 * companydetails.established
 * tags -> array of string
 * skills -> array of string
 * experiencereq -> Number
 * description -> String
 * salary -> Number
 * 
*/
router.post('/joblisting', [
    body('title', 'Job type Required').exists(),
    body('experiencereq', 'experiencereq Required').exists(),
    body('description', 'descriptione Required').exists(),
    body('salary', 'Salary Required').exists(),

], fetchUser, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    const { jobCategoryId, jobTypeId, title, companydetails, tags, skills, experiencereq, description, salary } = req.body;

    try {
        let adminId = req.user.id;
        let checkadmin = await User.findById({ _id: adminId, role: 0 });

        let checkcategory = await Jobcategory.findById({ adminId: adminId, _id: jobCategoryId });

        let checktype = await Jobtype.findById({ adminId: adminId, jobCategoryId: jobCategoryId, _id: jobTypeId });

        if (!checkadmin || !checkcategory || !checktype) {
            res.status(404).json({ status: 0, message: "Not authorised" })
        }


        let list = await Joblisting.findOne({ title: title });

        if (list) {
            return res.status(400).json({
                status: 0,
                message: "Job Listing already exists"
            })
        }

        let newJobListing = await Joblisting.create({
            adminId,
            jobCategoryId,
            jobTypeId,
            title,
            companydetails,
            tags,
            skills,
            experiencereq,
            description,
            salary,
        })

        res.status(200).json({
            message: "new Job type created",
            status: 1,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.get('/admincategory', fetchUser, async (req, res) => {


    try {
        let adminId = req.user.id;
        let categories = await Jobcategory.find({ adminId: adminId });

        res.status(200).json({
            status: 1,
            message: categories
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.post('/adminjobtype', fetchUser, async (req, res) => {
    const { categoryId } = req.body;
    try {
        let adminId = req.user.id;
        let types = await Jobtype.find({ adminId: adminId, jobCategoryId: categoryId });

        res.status(200).json({
            status: 1,
            message: types
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.get('/adminjoblisting', fetchUser, async (req, res) => {
    try {
        let adminId = req.user.id;

        let listings = await Joblisting.find({ adminId: adminId });

        res.status(200).json({
            status: 1,
            message: listings
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

// get all jpb listings for new applicants
router.get('/joblistings', fetchUser, async (req, res) => {
    try {
        let id = req.user.id;

        let user = await User.findById({ _id: id })

        if (!user) {
            return res.status(404).json({ status: 0, message: "Not allowed" })
        }

        let listings = await Joblisting.find({});

        res.status(200).json({
            status: 1,
            message: listings
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.post('/candidate', [
    body('name', 'Name Required').exists(),
    body('email', 'Email Required').exists(),
    body('experience', 'experience Required').exists(),
    body('salary', 'salary Required').exists(),
], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }
    let id = req.user.id;

    const { name, email, skills, experience, salary } = req.body;

    try {

        let user = await User.findById({ _id: id, role: 1 })

        if (!user) {
            return res.status(404).json({ status: 0, message: "Not allowed" })
        }

        const newCandidateData = await Candidate.create({
            userId: id,
            name: name,
            email: email,
            skills: skills,
            experience: experience,
            salaryExpected: salary
        })

        res.status(200).json({ status: 1, message: "Added new user data" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})


router.post('/applicant', fetchUser, async (req, res) => {

    let id = req.user.id;

    const { adminId, jobCategoryId, jobTypeId, jobListingId } = req.body;

    try {
        let checkuser = await User.findById({ _id: id, role: 1 });

        let checkadmin = await User.findById({ _id: adminId, role: 0 });

        let checkcategory = await Jobcategory.findById({ _id: jobCategoryId });

        let checktype = await Jobtype.findById({ _id: jobTypeId });

        let checklisting = await Joblisting.findById({ _id: jobListingId });

        if (!checkuser || !checkcategory || !checktype || !checklisting || !checkadmin) {
            res.status(403).json({ status: 0, message: "Not authorised" })
        }

        let application = await Applicant.findOne({ userId: id, jobListingId: jobListingId })
        if (application) {
            return res.status(400).json({ status: 0, message: "Already applied" })
        }

        let newApplication = await Applicant.create({
            userId: id, adminId, jobCategoryId, jobTypeId, jobListingId
        })

        res.status(200).json({ status: 1, message: `Applied to ${jobListingId}` })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.get('/applicant', fetchUser, async (req, res) => {
    try {
        let applications = await Applicant.find({});
        res.status(200).json({ status: 0, message: applications })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})


router.post('/reject/:id', [
    body('message', 'message Required').exists(),

], fetchUser, async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ status: 0, message: "Check all the fields" })
    }

    let id = req.user.id; // curr user i.e. admin

    let applicationId = req.params.id; // application to be rejected

    const { message } = req.body;

    try {

        let checkadmin = await User.findById({ _id: id, role: 0 });// only admin
        if (!checkadmin) {
            res.status(403).json({ status: 0, message: "Not authorised" })
        }
        let appli = await Applicant.findById({ _id: applicationId })
        if (!appli) {
            res.status(403).json({ status: 0, message: "Not authorised" })
        }

        let addMesageandReject = await Applicant.updateOne({ _id: applicationId }, { $set: { message: message, status: "rejected" } })

        res.status(200).json({ status: 1, message: `Application ${appli.name} Rejected` })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

router.post('/status/:id', fetchUser, async (req, res) => {

    let id = req.user.id; // curr user i.e. admin

    let applicationId = req.params.id; // application to be rejected

    const { message } = req.body;

    try {

        let checkadmin = await User.findById({ _id: id, role: 0 });// only admin

        if (!checkadmin) {
            res.status(403).json({ status: 0, message: "Not authorised" })
        }

        let appli = await Applicant.findById({ _id: applicationId })

        if (!appli) {
            res.status(403).json({ status: 0, message: "Not authorised" })
        }

        let addMesageandReject = await Applicant.updateOne({ _id: applicationId }, { $set: { status: "approved" } })

        res.status(200).json({ status: 1, message: `Application ${appli.name} Approved` })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: 0, message: "Internal Server error" })
    }
})

module.exports = router;
