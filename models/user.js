const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//user schema references recipes for populating users with saved recipes
const UserSchema = new Schema({
    username: String,
    password: String,
    recipes: [{
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)