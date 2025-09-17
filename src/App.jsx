import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/Home";
import { Editor } from "./components/Editor";
import Post from "./components/Post";
import { isSupabaseReady } from "./lib/supabaseClient";

function EditorWrapper() {
  const navigate = useNavigate();
  return <Editor onBack={() => navigate("/")} />;
}

function AppShell() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/editor");
  return (
    <>
      {!isEditor && (
        <nav>
          <div className="container">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/editor">New Post</Link>
            </div>
          </div>
        </nav>
      )}
      {!isSupabaseReady && (
        <div className="warning-banner">
          <strong>Note:</strong> Supabase is not configured. The app is running
          in local storage mode. To enable cloud sync, create a{" "}
          <code>.env</code> file with your Supabase credentials.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<EditorWrapper />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
