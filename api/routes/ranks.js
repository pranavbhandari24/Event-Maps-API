const express = require( 'express' );
const router = express.Router();
const mongoose = require( 'mongoose' );

const Rank = require( '../models/rank' );
const User = require( '../models/user' );

router.get('/', (req, res, next) => {

    Rank.find()
    .select()
    .sort( { points: 'desc' } )
    .exec()
    .then(docs => {
        const response = {
        count: docs.length,
        leaderboard: docs.map(doc => {
            return {
                name: doc.name,
                points: doc.points
            }

            })
        };

        console.log(response);

        if (docs.length >= 0) {
        res.status(200).json(response);
        }
        else{
        res.status(404).json({
            message: 'No entires found'
        });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
        error : err
        });
    });
});


router.patch('/:userId', ( req, res, next ) => {
    const id = req.params.userId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Rank
        .update( { userId: id }, { $set: updateOps} )
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
            message: 'rank successfully updated',
            request: {
                type: 'GET',
                url: 'https://event-maps-api.herokuapp.com/ranks/' + id
            }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
            error: err
            });
    });
});

// export router with configured routes
module.exports = router;