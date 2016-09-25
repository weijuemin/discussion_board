var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CommentSchema = new Schema({
      content: {
        type: String,
        required: true,
        maxlength: 250
      },
      _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      _post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    }, {timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);