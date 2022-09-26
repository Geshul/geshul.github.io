const MIN_SCALE = 25;
const MAX_SCALE = 100;
const RADIX_DECIMAL = 10;
const SCALE_STEP = 25;
const EFFECT_SIGN = {
  none: '',
  chrome: '',
  sepia: '',
  marvin: '%',
  phobos: 'px',
  heat: ''
};
const EFFECT_STYLE = {
  none: '',
  chrome: 'grayscale',
  sepia: 'sepia',
  marvin: 'invert',
  phobos: 'blur',
  heat: 'brightness'
};
const SLIDER_EFFECT_OPTIONS = {
  none: {},

  chrome: {
    range: {
      min: 0,
      max: 1,
    },
    step: 0.1,
    start: 1
  },

  sepia: {
    range: {
      min: 0,
      max: 1,
    },
    step: 0.1,
    start: 1
  },

  marvin: {
    range: {
      min: 0,
      max: 100,
    },
    step: 1,
    start: 100
  },

  phobos: {
    range: {
      min: 1,
      max: 3,
    },
    step: 0.1,
    start: 3
  },

  heat: {
    range: {
      min: 1,
      max: 3,
    },
    step: 0.1,
    start: 3
  }
};

const uploadScale = document.querySelector('.img-upload__scale');
const uploadValue = uploadScale.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview');
const innerImage = imagePreview.querySelector('img');
const sliderWrapper = document.querySelector('.img-upload__effect-level');
const valueElement = document.querySelector('.effect-level__value');
let currentEffect = 'none';

function clearEffect() {
  sliderWrapper.classList.remove('active');
  innerImage.className = 'effects effects__preview--none';
  innerImage.style.filter = '';
}

function initRangeSlider() {
  const sliderElement = document.querySelector('.effect-level__slider');
  const listEffects = document.querySelector('.img-upload__effects');
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1
  });
  sliderElement.noUiSlider.on('update', () => {
    valueElement.value = sliderElement.noUiSlider.get();
    innerImage.style.filter = `${EFFECT_STYLE[currentEffect]}(${valueElement.value}${EFFECT_SIGN[currentEffect]})`;
  });
  listEffects.addEventListener('change', (evt) => {
    currentEffect = evt.target.value;
    innerImage.className = `effects__preview--${currentEffect}`;
    sliderElement.noUiSlider.updateOptions(SLIDER_EFFECT_OPTIONS[currentEffect]);
    if (currentEffect === 'none') {
      clearEffect();
    } else {
      sliderWrapper.classList.add('active');
    }
  });
}

function changeControl() {
  uploadScale.querySelector('.scale__control--smaller').addEventListener('click', ()=> {
    let currentValue = parseInt(uploadValue.value, RADIX_DECIMAL);
    if (currentValue > MIN_SCALE && currentValue <= MAX_SCALE ) {
      currentValue -= SCALE_STEP;
      uploadValue.value = `${currentValue}%`;
      imagePreview.style.transform = `scale(${currentValue}%)`;
    }
  });
  uploadScale.querySelector('.scale__control--bigger').addEventListener('click', ()=> {
    let currentValue = parseInt(uploadValue.value, RADIX_DECIMAL);
    if (currentValue >= MIN_SCALE  && currentValue < MAX_SCALE) {
      currentValue += SCALE_STEP;
      uploadValue.value = `${currentValue}%`;
      imagePreview.style.transform = `scale(${currentValue}%)`;
    }
  });
}

export { changeControl, initRangeSlider, clearEffect };
