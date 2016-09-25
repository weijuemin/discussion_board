var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    TopicSchema = new Schema({
      title: {
        type: String,
        required: true,
        maxlength: 156
      },
      description:{
        type: String,
        default: "As title"
      },
      category: {
        type: String,
        default: "General"
      },
      _user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      _answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }]
    }, {timestamps: true});

module.exports = mongoose.model('Topic', TopicSchema);