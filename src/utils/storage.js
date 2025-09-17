// src/utils/storage.js
export const savePost = (post) => {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex((p) => p.id === post.id);
  if (index > -1) {
    posts[index] = post;
  } else {
    posts.push(post);
  }
  localStorage.setItem("posts", JSON.stringify(posts));
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
