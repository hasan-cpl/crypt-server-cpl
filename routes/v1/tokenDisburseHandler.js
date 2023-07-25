const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const schedule = require('node-schedule');
const tokenDisburseSchema = require('../../schema/token-disburse/TokenDisburseSchema')

// Creating Model for object mapping
const TokenDisburse = new mongoose.model("TokenDisburse", tokenDisburseSchema);

// get all voter by proposal number
router.get("/token-disburse", async (req, res) => {

    /* const utcDate = new Date().toISOString();
    const date = new Date(utcDate);

    //const date = new Date(2012, 11, 21, 5, 30, 0);

    const newDate = new Date( date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 5, date.getSeconds())
    console.log(newDate);

    schedule.scheduleJob(newDate, function () {
        console.log('The world is going to end today.');
    });

    res.json(''); */


});

router.post("/token-disburse/add-time", async (req, res) => {


    console.log(req.body);

    try {

        const tokenDisburse = await TokenDisburse.create(req.body);
        res.json(tokenDisburse);
    } catch (error) {
        res.json(error)
    }
});

// Update tokenDisburse by id
router.put("/token-disburse/:id", async (req, res) => {

    const id = req.params.id;

    //console.log(courseId);
    console.log(req.body);

    try {
        const tokenDisburse = await TokenDisburse.findOneAndUpdate(
            { "_id": id },
            req.body,
            { new: true },

        );
        res.json(tokenDisburse);
    } catch (error) {
        res.json(error);
    }

});

// GET ALL Token Disburse

router.get('/token-disburse/all', async (req, res) => {
    
    let page = req.query.page ? parseInt(req.query.page) : 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;


    if (page > 0) {
        page = page - 1;
    }

    try {
        //console.log(pageSize, page);
        const total = await TokenDisburse.countDocuments().exec();
        const tokenDisburses = await TokenDisburse.find({})
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ createdAt: -1 });
        res.json({ 'total': total, data: tokenDisburses });
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;