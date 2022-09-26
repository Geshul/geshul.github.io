const screen = document.querySelector('.big-picture');
const commentsLoader = document.querySelector('.social__comments-loader');
const commentsList = screen.querySelector('.social__comments');
let postComments = [];
let lastFilledComment = 0;

function fillComments() {
  const commentTemplate = document.querySelector('#social-comment').content;
  const slicedComments = postComments.slice(lastFilledComment,lastFilledComment+5);
  const filledComments = document.querySelector('.comments-filled');
  slicedComments.forEach((commentData) => {
    const comment = commentTemplate.cloneNode(true);
    const commentImg = comment.querySelector('img');
    commentImg.src = commentData.avatar;
    commentImg.alt = commentData.name;
    comment.querySelector('.social__text').textContent = commentData.message;
    commentsList.append(comment);
  });
  lastFilledComment += slicedComments.length;
  if (lastFilledComment >= postComments.length) {
    commentsLoader.classList.add('hidden');
  }
  filledComments.textContent = lastFilledComment;
}

function onLoadMoreButtonClick() {
  fillComments();
}

function resetBigPicture() {
  commentsLoader.classList.remove('hidden');
  lastFilledComment = 0;
}

function fillBigPicture (post) {
  resetBigPicture();
  const fullPhoto = screen.querySelector('.big-picture__img img');
  const likesCount = screen.querySelector('.likes-count');
  const commentsCount = screen.querySelector('.comments-count');
  const description = screen.querySelector('.social__caption');
  const closeBigPicture = document.querySelector('.big-picture__cancel');
  fullPhoto.src = post.url;
  likesCount.textContent = post.likes;
  description.textContent = post.description;
  postComments = post.comments;
  commentsCount.textContent = post.comments.length;
  commentsList.innerHTML = '';
  fillComments();
  screen.classList.remove('hidden');
  closeBigPicture.addEventListener('click', () =>{
    screen.classList.add('hidden');
    document.body.classList.remove('modal-open');
  });
  document.addEventListener('keydown', (evt) =>{
    if(evt.key === 'Escape') {
      screen.classList.add('hidden');
      document.body.classList.remove('modal-open');
    }
  });
  commentsLoader.addEventListener('click', onLoadMoreButtonClick);
}

function createFullscreen(posts) {
  const photo = document.querySelectorAll('.picture');
  for(let i = 0; i < photo.length; i++){
    photo[i].addEventListener('click', (evt) => {
      const postId = evt.target.closest('.picture').dataset.postId;
      fillBigPicture(posts[postId]);
      document.body.classList.add('modal-open');
    });
  }
}

export { createFullscreen };
