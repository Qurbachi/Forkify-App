import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

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
        renderLoader(elements.searchResults);
        //4) Search for the recipe
        await state.search.getResults();

        //5) Display the result
        clearLoader();
        searchView.renderResults(state.search.result);
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
})