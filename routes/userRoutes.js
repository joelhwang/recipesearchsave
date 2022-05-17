const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Recipe = require('../models/recipe')
const passport = require('passport');
const tryAsync = require('../helpers/tryAsync');

//post request for reqistering user
router.post('/api/register', tryAsync(async(req, res) =>{
    //retrieves register form parameters which are sent from the frontend
    const username = req.body.username;
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;

    //if password and verify password input do not match, return to frontend where user will be redirected to register page
    if(password !== verifyPassword){
        res.end('Passwords do not match')
        return;
    }

    const user = new User({ username });
    //register and log in user
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
    //if error occurs, send it to frontend for display
    catch(err){
        res.send(err);
        res.end();
    }
    
    
}));

//post request for login
// if login failed, redirect to login page
router.post('/api/login', passport.authenticate('local', { failureMessage: true, failureRedirect: '/login' }), (req, res) => {
    res.end();
}); 

//logout user and redirect to home
router.get('/api/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

//checks if a user is logged in for hiding/showing certain buttons
router.get('/api/isLogged', (req, res)=>{
    console.log(req.user)
    if(req.user){
        res.send(true);
    }
    else{
        res.send(false);
    }
});

//get saved recipes for dcurrently logged in user
router.get('/api/getSavedRecipes', tryAsync(async(req, res)=>{
    const user = await res.locals.currentUser.populate('recipes');
    res.send(user.recipes);
}));

//get saved recipe names for currently logged in user
//determines if 'add to recipes' button is clickable or not depending on whether the user already has the recipe added
router.get('/api/getSavedRecipeNames', tryAsync(async(req, res)=>{
    const user = await res.locals.currentUser.populate('recipes');
    const recipes = [];
    for(let recipe of user.recipes){
        recipes.push(recipe.label);
    }
    res.send(recipes);
}));

//post request to save recipe
router.post('/api/saveRecipe', tryAsync(async(req, res)=>{
    const data = req.body.recipeData;  
    const recipe = new Recipe();
    //saved recipe name, url, and associated image
    recipe.label = data.label;
    recipe.url = data.url;
    recipe.image = data.image;
    //pushes all ingredients into ingredient array
    for(let ingredient of data.ingredientLines){
        recipe.ingredients.push(ingredient);
    }
    //pushes all health labels to health labels array
    for(let healthLabel of data.healthLabels){
        recipe.healthLabels.push(healthLabel)
    }
    await recipe.save();
    res.locals.currentUser.recipes.push(recipe);
    await res.locals.currentUser.save();
    res.end();
}));

//post request for deleting recipe from list
router.post('/api/deleteRecipe', tryAsync(async(req, res)=>{
    const recipeId = req.body.recipeId;
    //finds the recipe from list with Id and pulls it from the list
    await User.updateOne({ recipes: recipeId }, { $pull: { recipes: recipeId }})
    //also deletes from list of all saved recipes
    await Recipe.findByIdAndDelete(recipeId);
    res.end();
}));

module.exports = router;
