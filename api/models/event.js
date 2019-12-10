const mongoose = require('mongoose');

// design object
const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false},
    organization: { type: String, required: false},
    lastUpdated: { type: Date, required: true },
    eventDate: { type: Date, required: false },
    address: { type: String, required: true},
    longitude: { type: Number, required: true},
    latitude: { type: Number, required: true},
    category: { type: String, required: true},
    likes: { type: Number, required: true, default: 0},
    tag: {type: String, required: false},
    description: { type: String, required: false},
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    username: { type: String, required: true}

  });

//constructor based on schema
module.exports = mongoose.model('Event', eventSchema);