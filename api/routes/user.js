const express = require('express');
const router = express.Router();
const User = require( '../models/user' );
const Event = require( '../models/event');
const Rank = require( '../models/rank');
var bcrypt = require( 'bcryptjs' );
const mongoose = require('mongoose');


router.post('/signup', (req, res, next) => {

    User.find( {email: req.body.email} )
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            successful: false,
            message: 'username/email is already linked to an existing account'
          });
        }
        else {
            User.find( {username: req.body.username } )
              .exec()
              .then( user => {

                if( user.length >= 1 ) {
                  return res.status(409).json({
                    successful: false,
                    message: 'username/email is already linked to an existing account'
                  });
                } else {

                  bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if (err) {
                      return res.status(500).json({
                          successful: false,
                          error: err
                      });
                    } else {

                      console.log(hash);

                      const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                      });

                      //status 201 when creating resource
                      user
                        .save()
                        .then( result => {
                          // console.log( result.username );

                          const rank = new Rank({
                              _id: new mongoose.Types.ObjectId(),
                              username: result.username,
                              userId: result._id
                          });

                          // create initial rank for user
                          return rank
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                  successful: true,
                                  message: 'User created successfully',
                                });
                              })
                              .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                  successful: false,
                                  error: err
                                });
                              });

                        })
                        .catch(err => {
                          console.log(err);
                          res.status(500).json({error : err});
                        });
                    }
                  });

                }


              });
        }
      });
});

router.post('/login', exports.user_login = (req, res, next) => {
    User.find({ email: req.body.username })
      .exec()
      .then(user => {
        if (user.length < 1) {

          User.find({ username: req.body.username })
            .exec()
            .then( user => {

              if ( user.length < 1 ) {
                return res.status(401).json({
                  successful: false,
                  message: 'Authentication failed, username/email is not linked to an existing account'
                });
              } else {

                  bcrypt.compare( req.body.password, user[0].password, ( err, result) => {
                    if ( result ) {
                      return res.status(200).json({
                        successful: true,
                        message: 'Authentication successful',
                        user_id: user[0]._id
                      });

                    } else {
                      return res.status(401).json({
                        successful: false,
                        message: 'Authentication failed, incorrect password'
                      });
                    }
                  });
                }



            });
          // User.find({ username: req.body})

        }else {

          bcrypt.compare( req.body.password, user[0].password, ( err, result) => {
            // if (err) {
            //   return res.status(401).json({
            //     message: 'Auth failed'
            //   });

            // }
            //result is the truth value of comparison
            if ( result ) {
              return res.status(200).json({
                successful: true,
                message: 'Authentication successful',
                user_id: user[0]._id
              });

            } else {
              return res.status(401).json({
                successful: false,
                message: 'Authentication failed, incorrect password'
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          successful: false,
          error : err
        });
      });
});


router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        successful: true,
        message: 'User deleted',
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        successful: false,
        error: err
      });
    });
});


router.get('/:userId', (req, res, next ) => {
  const id = req.params.userId
  User.findById( id )
  .exec()
  .then( doc => {
    res.status(200).json({
      successful: true,
      user: doc
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      successful: false,
      error : err
    });
  });

});
router.get('/events/created/:username', (req, res, next) =>  {
    const id = req.params.username
    Event.find( {username: id} )
    .select()
    .exec()
    .then(doc => {
      if ( doc.length > 0 ) {
        res.status(200).json({
          successful: true,
          UserCreatedEvents: doc,
          message: 'events linked to user fetched'
        });
      }
      else
      {
        res.status(404).json({
          successful: false,
          message: 'No events linked to user found',
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        successful: false,
        error : err
      });
    });
});

//export such that module can be used in other files
module.exports = router;
