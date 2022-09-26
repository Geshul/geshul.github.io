const list = document.querySelector('.pictures');
const templatePost = document.querySelector('#picture').content;
const miniatures = document.createDocumentFragment();

function createMiniatures(posts) {
  posts.forEach(({ url, likes, comments }, index) => {
    const post = templatePost.cloneNode(true);
    post.querySelector('.picture__img').src = url;
    post.querySelector('.picture__likes').textContent = likes;
    post.querySelector('.picture__comments').textContent = comments.length;
    post.querySelector('.picture').dataset.postId = index;
    miniatures.append(post);
  });
  list.append(miniatures);
}

export { createMiniatures };
