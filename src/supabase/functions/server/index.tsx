import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-538d7667/health", (c) => {
  return c.json({ status: "ok" });
});

// Save a blog post
app.post("/make-server-538d7667/blog", async (c) => {
  try {
    const { title, content, images, coverImage } = await c.req.json();
    
    if (!title || !content) {
      return c.json({ error: "Title and content are required" }, 400);
    }

    const blogId = crypto.randomUUID();
    const blog = {
      id: blogId,
      title,
      content,
      images: images || [],
      coverImage: coverImage || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`blog:${blogId}`, blog);
    console.log(`Saved blog post: ${blogId} with title: ${title}`);
    
    return c.json({ success: true, blog });
  } catch (error) {
    console.log(`Error saving blog post: ${error}`);
    return c.json({ error: "Failed to save blog post" }, 500);
  }
});

// Update a blog post
app.put("/make-server-538d7667/blog/:id", async (c) => {
  try {
    const blogId = c.req.param("id");
    const { title, content, images, coverImage } = await c.req.json();
    
    if (!title || !content) {
      return c.json({ error: "Title and content are required" }, 400);
    }

    const existingBlog = await kv.get(`blog:${blogId}`);
    if (!existingBlog) {
      return c.json({ error: "Blog post not found" }, 404);
    }

    const updatedBlog = {
      ...existingBlog,
      title,
      content,
      images: images || [],
      coverImage: coverImage || existingBlog.coverImage || null,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`blog:${blogId}`, updatedBlog);
    console.log(`Updated blog post: ${blogId} with title: ${title}`);
    
    return c.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.log(`Error updating blog post: ${error}`);
    return c.json({ error: "Failed to update blog post" }, 500);
  }
});

// Get all blog posts
app.get("/make-server-538d7667/blogs", async (c) => {
  try {
    console.log("Starting to fetch blog posts...");
    
    const blogs = await kv.getByPrefix("blog:");
    
    if (!Array.isArray(blogs)) {
      console.log("No blogs found or invalid response, returning empty array");
      return c.json({ blogs: [] });
    }
    
    // Sort by creation date (newest first)
    const sortedBlogs = blogs.sort((a, b) => {
      if (!a?.createdAt || !b?.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log(`Successfully retrieved ${sortedBlogs.length} blog posts`);
    return c.json({ blogs: sortedBlogs });
  } catch (error) {
    console.log(`Error retrieving blog posts: ${error.message || error}`);
    return c.json({ blogs: [] });
  }
});

// Get a single blog post
app.get("/make-server-538d7667/blog/:id", async (c) => {
  try {
    const blogId = c.req.param("id");
    const blog = await kv.get(`blog:${blogId}`);
    
    if (!blog) {
      return c.json({ error: "Blog post not found" }, 404);
    }
    
    console.log(`Retrieved blog post: ${blogId}`);
    return c.json({ blog });
  } catch (error) {
    console.log(`Error retrieving blog post: ${error}`);
    return c.json({ error: "Failed to retrieve blog post" }, 500);
  }
});

// Delete a blog post
app.delete("/make-server-538d7667/blog/:id", async (c) => {
  try {
    const blogId = c.req.param("id");
    const existingBlog = await kv.get(`blog:${blogId}`);
    
    if (!existingBlog) {
      return c.json({ error: "Blog post not found" }, 404);
    }
    
    await kv.del(`blog:${blogId}`);
    console.log(`Deleted blog post: ${blogId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting blog post: ${error}`);
    return c.json({ error: "Failed to delete blog post" }, 500);
  }
});

// Search for images using Unsplash
app.post("/make-server-538d7667/unsplash", async (c) => {
  try {
    const { query } = await c.req.json();
    
    if (!query) {
      return c.json({ error: "Search query is required" }, 400);
    }

    // Make request to Unsplash API
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=YOUR_UNSPLASH_ACCESS_KEY`;
    
    const response = await fetch(unsplashUrl);
    
    if (!response.ok) {
      // Fallback to Lorem Picsum for demo purposes
      const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      console.log(`Using fallback image for query: ${query}`);
      return c.json({ imageUrl });
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      console.log(`Found Unsplash image for query: ${query}`);
      return c.json({ imageUrl });
    } else {
      // Fallback to Lorem Picsum
      const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      console.log(`No Unsplash results, using fallback for query: ${query}`);
      return c.json({ imageUrl });
    }
  } catch (error) {
    console.log(`Error searching for images: ${error}`);
    // Fallback to Lorem Picsum
    const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
    return c.json({ imageUrl });
  }
});

Deno.serve(app.fetch);