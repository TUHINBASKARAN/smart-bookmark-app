"use client";
import { useState, useEffect } from "react";
import { supabase } from "../src/lib/supabaseClient";

export default function Home() {
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<{ id: number; url: string }[]>([]);
  const [user, setUser] = useState<any>(null);

  // Fetch current session and track auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) fetchBookmarks(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchBookmarks(session.user.id);
      else setBookmarks([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Google login
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://smart-bookmark-app-zeta-wheat.vercel.app" // <-- Vercel URL
      }
    });
    if (error) console.error("Error signing in:", error.message);
  };

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarks([]);
  };

  // Fetch bookmarks from Supabase for current user
  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching bookmarks:", error.message);
    else setBookmarks(data ?? []);
  };

  // Add new bookmark
  const addBookmark = async () => {
    if (!url.trim()) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .insert([{ url, user_id: user.id }])
      .select();

    if (error) console.error("Error adding bookmark:", error.message);
    else setBookmarks([...(data ?? []), ...bookmarks]);

    setUrl("");
  };

  // Delete bookmark
  const deleteBookmark = async (id: number) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) console.error("Error deleting bookmark:", error.message);
    else setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Smart Bookmark App 🚀
        </h1>

        {/* Google login/logout */}
        {!user ? (
          <button
            onClick={signInWithGoogle}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mb-6 w-full"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="flex justify-between items-center mb-6">
            <p>Welcome, {user.email}</p>
            <button
              onClick={signOut}
              className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}

        {/* Bookmark input */}
        {user && (
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Enter website URL (https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border p-2 rounded-lg"
            />
            <button
              onClick={addBookmark}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        )}

        {/* Bookmark list */}
        {user ? (
          bookmarks.length === 0 ? (
            <p className="text-gray-500 text-center">No bookmarks added yet.</p>
          ) : (
            <ul className="space-y-3">
              {bookmarks.map((bookmark) => (
                <li
                  key={bookmark.id}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {bookmark.url}
                  </a>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="text-gray-500 text-center">
            Please sign in to add bookmarks.
          </p>
        )}
      </div>
    </main>
  );
}