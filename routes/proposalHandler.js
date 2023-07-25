const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router();
const proposalSchema = require('../schema/proposal/proposalSchema');


// Creating Model for object mapping
const Proposal = new mongoose.model("Proposal", proposalSchema);

// get all voter by proposal number
router.get("/proposals/:proposalNumber", async (req, res) => {

    const proposalNumber = req.params.proposalNumber;
    //console.log(id);
    try {
        const proposal = await Proposal.findOne({ proposalNumber: proposalNumber });
        res.json(proposal);

    } catch (err) {
        res.json({
            "message": "Proposal Not Found!",
            "error": err
        });
    }

});

router.post('/proposal/add-voter', async (req, res) => {

    //console.log(req.body.voters[0]);


    try {
        const proposal = await Proposal.findOne({
            proposalNumber: req.body.proposalNumber,
        });

        //console.log(proposal);

        if (proposal) {
            console.log(proposal.voters);
            const voter = proposal.voters.find(voter => voter.address == req.body.voters[0].address);
            if (voter) {
                res.json({
                    "message": "You have already Vote this proposal"
                });

            } else {
                proposal.voters.push(req.body.voters[0]);
                proposal.save();
                res.json({
                    "data": proposal,
                    "message": "Voted Successfully"
                });
            }
        } else {
            try {
                const newProposal = await Proposal.create(req.body);
                res.json({
                    "data": newProposal,
                    "message": "Voted Successfully"
                });
            } catch (error) {
                res.json(error);
            }
        }

    } catch (error) {
        res.json(error)
    }
})

router.get('/proposal/is-voted', async (req, res) => {

   // console.log(req.query);
    try {
        const isVoted = await Proposal.findOne({
            proposalNumber: req.query.proposalNumber,
            voters: { "$elemMatch": { "address": req.query.accountAddress } }
        });
        if (isVoted) {
            res.json({
                //'data': isVoted,
                'isVoted': true,
                'message': 'You are already Vote this proposal.'
            })
        } else {
            res.json({
                //'data': isVoted,
                'isVoted': false
            })
        }
    } catch (err) {
        res.json({
            'data': err
        })
    }
})

module.exports = router;