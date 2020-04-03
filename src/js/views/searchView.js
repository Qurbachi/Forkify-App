import { elements, clearLoader } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

const shortenTitle = (title, limit = 17) => {
    let words = [];
    let newTitle = [];
    if (title.length > limit) {
        words = title.split(' ');
        for (var i = 0; i < words.length; i++) {
            if (words[i].length + newTitle.join(' ').length < limit) {
                newTitle.push(words[i]);
            } else {
                break;
            }
        }
        return `${newTitle.join(' ')} ...`;
    } else {
        return title;
    }
};

const renderRecipe = recipe => {
    const markup = `
        <li>
          <a class="likes__link" href="#${recipe.recipe_id}">
              <figure class="likes__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="likes__data">
                  <h4 class="likes__name">${shortenTitle(recipe.title)}</h4>
                  <p class="likes__author">${recipe.publisher}</p>
              </div>
          </a>
        </li>
     `;
     elements.searchResultsList.insertAdjacentHTML("beforeend", markup);
};

//type: 'prev' or 'next'
const createButton = (page, type) => `
     <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        //Only one button to go to the next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        //Only one button to got to the prev page
        button = createButton(page, 'prev');
    }

    elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results fo the current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    
    //render pagination
    renderButtons(page, recipes.length, resPerPage);
};