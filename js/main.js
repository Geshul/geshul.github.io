import { createMiniatures } from './create-miniatures.js';
import { createFullscreen } from './create-fullscreen.js';
import { initFormValidation, initFormOpenClose, initFormSubmit, closeForm } from './check-validation.js';
import { changeControl, initRangeSlider } from './form-sliders.js';
import { getData } from './api.js';
import { filterImages } from './images-filter.js';

getData((posts) => {
  createMiniatures(posts);
  createFullscreen(posts);
  filterImages(posts);
});

initFormValidation();

initFormOpenClose();

initFormSubmit(closeForm);

changeControl();

initRangeSlider();
