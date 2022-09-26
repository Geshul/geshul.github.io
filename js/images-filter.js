import { createMiniatures } from './create-miniatures.js';
import { getRandomInteger } from './utils.js';
import { createFullscreen } from './create-fullscreen.js';
import { debounce } from './utils.js';

const RANDOM_POSTS_LIMIT = 10;

const filterSection = document.querySelector('.img-filters');

function getSort(a, b) {
  return b.comments.length - a.comments.length;
}

function clearMiniatures() {
  document.querySelectorAll('.picture').forEach((picture) => {
    picture.remove();
  });
}

function getRandomPosts() {
  return getRandomInteger(-5, 5);
}

function fillSortedPosts(posts) {
  clearMiniatures();
  createMiniatures(posts);
  createFullscreen(posts);
}

function postSorting(posts, filter) {
  if (filter === 'filter-default') {
    fillSortedPosts(posts);
  }
  else if (filter === 'filter-random') {
    const randomedPosts = posts.slice().sort(getRandomPosts).slice(0, RANDOM_POSTS_LIMIT);
    fillSortedPosts(randomedPosts);
  }
  else if (filter === 'filter-discussed') {
    const discussedPosts = posts.slice().sort(getSort);
    fillSortedPosts(discussedPosts);
  }
}

const onSortButtonClick = debounce(postSorting);

function filterImages(posts) {
  const filterForm = filterSection.querySelector('.img-filters__form');
  filterSection.classList.remove('img-filters--inactive');
  filterForm.addEventListener('click', (evt) => {
    filterForm.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    evt.target.classList.add('img-filters__button--active');
    onSortButtonClick(posts, evt.target.id);
  });
}

export { filterImages };
