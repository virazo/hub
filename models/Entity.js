const mongoose = require('mongoose')
 
const EntitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  shared: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  relationships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Relationship',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: '1. New',
    enum: ['0. Active', '1. Respond', '2. Waiting', '3. Hold', '4. Evaluate', '5. Cancelled', '6. Complete',],
  },
})

module.exports = mongoose.model('Entity', EntitySchema)
