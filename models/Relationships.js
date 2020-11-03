const mongoose = require('mongoose')
 
const RelationshipSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive'],
  },
  entities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
  }],
})

module.exports = mongoose.model('Relationships', RelationshipSchema)
