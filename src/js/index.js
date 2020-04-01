import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/*
*Global state of the app
* - Search object
* - current recipe object
* - Shopping list object
* - liked recipes
*/
const state = {};

const controllSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();

    if(query) {
        //2) New Search object and add to view
        state.search = new Search(query);

        //3) Prepare UI for displaying result (proper animation)
        searchView.clearInput();
        searchView.clearResults();
        //4) Search for the recipe
        await state.search.getResults();

        //5) Display the result
        searchView.renderResults(state.search.result);
    }
};

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controllSearch();
    console.log(state);
});