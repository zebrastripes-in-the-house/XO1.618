import { supabase, isSupabaseReady } from "../lib/supabaseClient";

// Save post to Supabase
export const savePostToSupabase = async (post) => {
  if (!isSupabaseReady) {
    console.warn("Supabase not configured, falling back to localStorage");
    return savePostToLocal(post);
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .upsert({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.createdAt,
        updated_at: post.updatedAt,
        is_draft: post.isDraft,
      })
      .select();

    if (error) {
      console.error("Error saving post to Supabase:", error);
      // Fallback to localStorage
      return savePostToLocal(post);
    }

    console.log("Post saved to Supabase:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error saving post to Supabase:", error);
    // Fallback to localStorage
    return savePostToLocal(post);
  }
};

// Get all posts from Supabase
export const getPostsFromSupabase = async () => {
  if (!isSupabaseReady) {
    console.warn("Supabase not configured, falling back to localStorage");
    return getPostsFromLocal();
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts from Supabase:", error);
      // Fallback to localStorage
      return getPostsFromLocal();
    }

    // Transform data to match expected format
    const transformedData = data.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      isDraft: post.is_draft,
    }));

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Error fetching posts from Supabase:", error);
    // Fallback to localStorage
    return getPostsFromLocal();
  }
};

// Get single post from Supabase
export const getPostFromSupabase = async (id) => {
  if (!isSupabaseReady) {
    console.warn("Supabase not configured, falling back to localStorage");
    return getPostFromLocal(id);
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post from Supabase:", error);
      // Fallback to localStorage
      return getPostFromLocal(id);
    }

    // Transform data to match expected format
    const transformedData = {
      id: data.id,
      title: data.title,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      isDraft: data.is_draft,
    };

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Error fetching post from Supabase:", error);
    // Fallback to localStorage
    return getPostFromLocal(id);
  }
};

// Delete post from Supabase
export const deletePostFromSupabase = async (id) => {
  if (!isSupabaseReady) {
    console.warn("Supabase not configured, falling back to localStorage");
    return deletePostFromLocal(id);
  }

  try {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting post from Supabase:", error);
      // Fallback to localStorage
      return deletePostFromLocal(id);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting post from Supabase:", error);
    // Fallback to localStorage
    return deletePostFromLocal(id);
  }
};

// Local storage fallback functions
const savePostToLocal = (post) => {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const index = posts.findIndex((p) => p.id === post.id);
  if (index > -1) {
    posts[index] = post;
  } else {
    posts.push(post);
  }
  localStorage.setItem("posts", JSON.stringify(posts));
  return { success: true, data: post };
};

const getPostsFromLocal = () => {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  return { success: true, data: posts };
};

const getPostFromLocal = (id) => {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find((p) => p.id === id);
  return { success: true, data: post };
};

const deletePostFromLocal = (id) => {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const filteredPosts = posts.filter((p) => p.id !== id);
  localStorage.setItem("posts", JSON.stringify(filteredPosts));
  return { success: true };
};
