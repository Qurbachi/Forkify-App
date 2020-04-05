import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';


/*
*Global state of the app
* - Search object
* - current recipe object
* - Shopping list object
* - liked recipes
*/
const state = {};
window.state = state;

//SEARCH CONTROLLER
const controllSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();

    if(query) {
        //2) New Search object and add to view
        state.search = new Search(query);

        //3) Prepare UI for displaying result (proper animation)
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            //4) Search for the recipe
            await state.search.getResults();
    
            //5) Display the result
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert('Sorry, we couldn`t reciev that recipe for You :(');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controllSearch();
    console.log(state);
});

elements.searchResultsPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if(button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

//RECIPE CONTROLLER
const controllRecipe = async () => {
    //get the id from the URL
    const id = window.location.hash.replace('#', '');

    if(id) {
        // Prepare UI for changes
            recipeView.clearRecipe();
            renderLoader(elements.recipe);
        
        // Create a new recipe object
            state.recipe = new Recipe(id);

        try {
            // Get recipe and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(state.recipe);
            // calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe /*state.likes.isLiked(id)*/);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe');
        }
    }
};

/**
 LIST CONTROLLER
 */
const controllList = () => {
    //Creates a list if there is NOT a list
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

/**
 LIKE CONTROLLER
 */
const controllLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    //User has not liked the recipe yet
    if(!state.likes.isLiked(currentId)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the liek button
            likeView.toggleLikeBtn(true);
        //Add liked recipe to the UI list
            likeView.renderLike(newLike);
    //User has already liked the recipe
    } else {
        //Remove like from the state
            state.likes.deleteLike(currentId);
        //Toggle the like button
            likeView.toggleLikeBtn(false);
        //Remove liked recipe from the UI list
            likeView.deleteLike(currentId);
    }

    likeView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    //Render likes in the UI
    state.likes.likes.forEach(like => likeView.renderLike(like));
});

//Handle delete and update list events
elements.shopping.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.itemid;
   
   if(e.target.matches('.shopping__delete, .shopping__delete *')) {
       //delete item
       state.list.deleteItem(id);
       listView.deleteItem(id);
   } else if (e.target.matches('.shopping__count-value')) {
       const val = parseFloat(e.target.value, 10);
       state.list.updateCount(id, val)
   }
});

/*window.addEventListener('hashchange', controllRecipe);
window.addEventListener('load', controllRecipe);*/
['hashchange', 'load'].forEach(event => window.addEventListener(event, controllRecipe));

//Handling recipe button click
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('btn-decrease, .btn-decrease *')) {
        //decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateIngredientsServings(state.recipe);
        }
    } else if (e.target.matches('btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateIngredientsServings(state.recipe);
    }else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controllList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controllLike();
    }
});

window.l = new List();