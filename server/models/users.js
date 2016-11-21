var bcrypt = require('bcryptjs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserSchema = new Schema({
      username: {
        type: String,
        required: [true, 'Please enter username'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: [true, 'User has registered'],
        validate: [{
          validator: function(email){
            return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
          },
          message: "Email is invalid"
        }]
      },
      password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [8, 'Password should be more than 8 characters'],
        maxlength: [32, 'Password should be less than 32 characters'],
        validate: {
          validator: function(pw) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?;&])[A-Za-z\d$@$!%*?;&]{8,32}/.test(pw);
          },
          message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        }
      },
      _topics: [{
        type: Schema.Types.ObjectId,
        ref: 'Topic'
      }],
      _answers: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }],
      _comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }],
      _upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }],
      _downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }]
    }, {timestamps: true});

UserSchema.pre('save', function(next){
  var hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  this.password = hash;
  next();
})

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);