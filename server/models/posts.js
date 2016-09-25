var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    PostSchema = new Schema({
      content: {
        type: String,
        required: true,
        maxlength: 1000
      },
      _upvoters: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
      _downvoters: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],      
      _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      _topic: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
      },
      _comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }]
    }, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);