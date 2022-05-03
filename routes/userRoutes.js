const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Recipe = require('../models/recipe')
const passport = require('passport');
const tryAsync = require('../helpers/tryAsync');


router.post('/api/register', tryAsync(async(req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;

    if(password !== verifyPassword){
        res.end('Passwords do not match')
        return;
    }

    const user = new User({ username });
    try{
        const registeredUser = await User.register(user, password);
        if(registeredUser){
            req.login(registeredUser, err=>{
                if(err) {
                    console.log(err);
                    throw err;
                }
            })
        }
        res.end();
    }
    catch(err){
        res.send(err);
        res.end();
    }
    
    
}));

router.post('/api/login', passport.authenticate('local', { failureMessage: true, failureRedirect: '/login' }), (req, res) => {
    res.end();
}); 

router.get('/api/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

router.get('/api/isLogged', (req, res)=>{
    console.log(req.user)
    if(req.user){
        res.send(true);
    }
    else{
        res.send(false);
    }
});

router.get('/api/getSavedRecipes', tryAsync(async(req, res)=>{
    const user = await res.locals.currentUser.populate('recipes');
    res.send(user.recipes);
}));

router.get('/api/getSavedRecipeNames', tryAsync(async(req, res)=>{
    const user = await res.locals.currentUser.populate('recipes');
    const recipes = [];
    for(let recipe of user.recipes){
        recipes.push(recipe.label);
    }
    res.send(recipes);
}));

router.post('/api/saveRecipe', tryAsync(async(req, res)=>{
    const data = req.body.recipeData;  
    const recipe = new Recipe();
    recipe.label = data.label;
    recipe.url = data.url;
    recipe.image = data.image;
    for(let ingredient of data.ingredientLines){
        recipe.ingredients.push(ingredient);
    }
    for(let healthLabel of data.healthLabels){
        recipe.healthLabels.push(healthLabel)
    }
    await recipe.save();
    res.locals.currentUser.recipes.push(recipe);
    await res.locals.currentUser.save();
    res.end();
}));

router.post('/api/deleteRecipe', tryAsync(async(req, res)=>{
    const recipeId = req.body.recipeId;
    await User.updateOne({ recipes: recipeId }, { $pull: { recipes: recipeId }})
    await Recipe.findByIdAndDelete(recipeId);
    res.end();
}));

module.exports = router;
