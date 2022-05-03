const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    label: String,
    url: String,
    image: String,
    ingredients: [{
        type: String
    }],
    healthLabels:[{
        type: String
    }]
})

module.exports = mongoose.model('Recipe', RecipeSchema)