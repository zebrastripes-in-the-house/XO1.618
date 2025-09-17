import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostFromSupabase } from "../utils/supabasePosts";

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const result = await getPostFromSupabase(id);
        if (result.success && result.data) {
          setPost(result.data);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return <div className="no-posts">Post not found.</div>;

  return (
    <div className="container">
      <div className="post-detail">
        <h2>{post.title}</h2>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <small className="post-meta">
          Posted on{" "}
          {new Date(post.createdAt || post.created_at).toLocaleString()}
        </small>
      </div>
    </div>
  );
}
