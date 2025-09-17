import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPostsFromSupabase } from "../utils/supabasePosts";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const result = await getPostsFromSupabase();
        if (result.success) {
          // Filter out drafts and show only published posts
          const publishedPosts = result.data.filter((post) => !post.isDraft);
          setPosts(publishedPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      <h2>All Posts</h2>
      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">No posts yet.</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: post.content.slice(0, 100) + "...",
              }}
            ></p>
            <Link to={`/post/${post.id}`}>Read More</Link>
            <small className="post-meta">
              {new Date(post.createdAt || post.created_at).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
