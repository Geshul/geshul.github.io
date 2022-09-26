import { clearEffect } from './form-sliders.js';
import { sendData } from './api.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const HASHTAGS_LIMIT = 5;
const MIN_HASHTAGS_LENGTH = 1;
const MAX_HASHTAGS_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const imagePreview = document.querySelector('.img-upload__preview');
const upload = document.querySelector('#upload-file');
const overlay = document.querySelector('.img-upload__overlay');
const editForm = document.querySelector('#upload-select-image');
const submitButton = editForm.querySelector('.img-upload__submit');
const effectNoneRadio = document.getElementById('effect-none');
const closeFormButton = document.querySelector('.img-upload__cancel');
const formHashTagsInput = editForm.querySelector('.text__hashtags');
const formDescriptionInput = editForm.querySelector('.text__description');

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Загрузка...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const pristine = new Pristine(editForm, {
  classTo: 'img-upload__item',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__item',
  errorTextTag: 'span',
  errorTextClass: 'img-upload__error'
});

function validateHashtags(value) {
  let hashTags = value.split(' ');
  hashTags = hashTags.map((element) => element.toLowerCase());
  const checkedHashTags = [];
  const regularExpression = /^#[A-Za-zА-Яа-яЕё0-9]{1,19}$/;
  if (hashTags.length > HASHTAGS_LIMIT) {
    return false;
  }
  for (let i = 0; i < hashTags.length; i++) {
    if ((!hashTags[i].startsWith('#') && value !== '') ||
    (hashTags[i].length <= MIN_HASHTAGS_LENGTH && value !== '') ||
    hashTags[i].length > MAX_HASHTAGS_LENGTH ||
    (!hashTags[i].match(regularExpression) && value !== '')) {
      return false;
    }
    else if (checkedHashTags.includes(hashTags[i])) {
      return false;
    } else {
      checkedHashTags.push(hashTags[i]);
    }
  }
  return true;
}

function validateComment(value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

function onCloseForm() {
  closeForm();
}

function closeForm() {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  editForm.reset();
  pristine.reset();
  effectNoneRadio.checked = true;
  clearEffect();
  imagePreview.style.transform = '';
  closeFormButton.removeEventListener('click', onCloseForm);
  formHashTagsInput.removeEventListener('keydown', onInputElementEscKeydown);
  formDescriptionInput.removeEventListener('keydown', onInputElementEscKeydown);
  document.removeEventListener('keydown', onPopupFormEscKeydown);
}

function onInputElementEscKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
}

function onPopupFormEscKeydown(evt) {
  if (evt.key === 'Escape') {
    closeForm();
  }
}

function initFormOpenClose() {
  upload.addEventListener('change', onOpenForm);
}

function uploadPreview(image) {
  const preview = document.querySelector('.img-upload__preview img');
  const file = image.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
}

function onOpenForm() {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  uploadPreview(this);
  closeFormButton.addEventListener('click', onCloseForm);
  formHashTagsInput.addEventListener('keydown', onInputElementEscKeydown);
  formDescriptionInput.addEventListener('keydown', onInputElementEscKeydown);
  document.addEventListener('keydown', onPopupFormEscKeydown);
}

function initFormValidation() {
  pristine.addValidator(
    formHashTagsInput,
    validateHashtags,
    'Что-то пошло не так'
  );

  pristine.addValidator(
    formDescriptionInput,
    validateComment,
    'Длина комментария не может составлять больше 140 символов'
  );
}

function showPopupMessage(type) {
  const message = document.querySelector(`#${type}`).content.querySelector(`.${type}`).cloneNode(true);
  const messageWrapper = message.querySelector(`.${type}__inner`);
  const button = messageWrapper.querySelector(`.${type}__button`);
  button.addEventListener('click', () => {
    message.remove();
  });
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      message.remove();
    }
  });
  document.addEventListener('click', (evt) => {
    const withinBoundaries = evt.composedPath().includes(messageWrapper);
    if ( ! withinBoundaries ) {
      message.remove();
    }
  });
  document.body.appendChild(message);
}

const initFormSubmit = (onSuccess) =>  {
  editForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    if (pristine.validate()) {
      blockSubmitButton();
      sendData(
        () => {
          onSuccess();
          unblockSubmitButton();
          showPopupMessage('success');
        },
        () => {
          unblockSubmitButton();
          showPopupMessage('error');
          closeForm();
        },
        new FormData(evt.target),
      );
    }
  });
};

export { initFormValidation,initFormOpenClose, initFormSubmit, closeForm };
