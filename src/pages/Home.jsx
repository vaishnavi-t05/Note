import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const username = localStorage.getItem("username") || "User";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // GET ALL NOTES
  // =========================
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notes/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotes(response.data);
    } catch (error) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error
      );

      // Token expired or unauthorized
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        window.location.replace("/login");
      }
    }
  };

  // =========================
  // LOAD NOTES
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    fetchNotes();
  }, []);

  // =========================
  // ADD / UPDATE NOTE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and content");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      // =========================
      // UPDATE NOTE
      // =========================
      if (editId !== null) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/notes/update/${editId}/`,
          {
            title: title,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Note updated successfully");

        setEditId(null);
      }

      // =========================
      // ADD NOTE
      // =========================
      else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/notes/`,
          {
            title: title,
            content: content,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Note added successfully");
      }

      // Clear inputs
      setTitle("");
      setContent("");

      // Refresh notes
      fetchNotes();
    } catch (error) {
      console.error(
        "Error saving note:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        window.location.replace("/login");
        return;
      }

      if (error.response) {
        console.log(error.response.data);
        alert("Failed to save note");
      } else {
        alert("Cannot connect to backend");
      }
    }
  };

  // =========================
  // EDIT NOTE
  // =========================
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  // =========================
  // DELETE NOTE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.replace("/login");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/notes/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Note deleted successfully");

      fetchNotes();
    } catch (error) {
      console.error(
        "Error deleting note:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");

        window.location.replace("/login");
        return;
      }

      alert("Failed to delete note");
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    // Remove all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");

    // Clear notes from state
    setNotes([]);

    // Go to login and reload the app
    window.location.replace("/login");
  };

  // =========================
  // SEARCH NOTES
  // =========================
  const filteredNotes = notes.filter((note) => {
    const noteTitle =
      note.title?.toLowerCase() || "";

    const noteContent =
      note.content?.toLowerCase() || "";

    const searchText =
      search.toLowerCase();

    return (
      noteTitle.includes(searchText) ||
      noteContent.includes(searchText)
    );
  });

  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="navbar">

        <div className="logo">
          📝 <span>MyNotes</span>
        </div>

        <div className="nav-user">

          <span>
            👋 {username}
          </span>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main className="main-content">

        {/* =========================
            WELCOME SECTION
        ========================= */}
        <section className="welcome-section">

          <div>

            <p className="small-text">
              YOUR PERSONAL NOTES
            </p>

            <h1>
              Welcome back,{" "}
              <span>{username}</span> 👋
            </h1>

            <p className="welcome-content">
              Capture your ideas, organize your thoughts
              and keep everything in one place.
            </p>

          </div>

          <div className="note-count">

            <span>📝</span>

            <strong>
              {notes.length}
            </strong>

            <small>
              Total Notes
            </small>

          </div>

        </section>

        {/* =========================
            ADD NOTE SECTION
        ========================= */}
        <section className="add-note-card">

          <div className="section-title">

            <div className="title-icon">
              ✏️
            </div>

            <div>

              <h2>
                {editId !== null
                  ? "Edit Your Note"
                  : "Create a New Note"}
              </h2>

              <p>
                {editId !== null
                  ? "Update your note below"
                  : "Write down something important"}
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>
                Title
              </label>

              <input
                type="text"
                placeholder="Enter your note title..."
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <label>
                Content
              </label>

              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                required
              />

            </div>

            <div className="form-buttons">

              <button
                type="submit"
                className="add-btn"
              >
                {editId !== null
                  ? "✓ Update Note"
                  : "+ Add Note"}
              </button>

              {editId !== null && (

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>

        {/* =========================
            NOTES SECTION
        ========================= */}
        <section className="notes-section">

          <div className="notes-header">

            <div>

              <h2>
                My Notes
              </h2>

              <p>
                {notes.length === 0
                  ? "You don't have any notes yet"
                  : `${notes.length} ${
                      notes.length === 1
                        ? "note"
                        : "notes"
                    } saved`}
              </p>

            </div>

            {notes.length > 0 && (

              <div className="search-box">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            )}

          </div>

          {/* =========================
              NOTES GRID
          ========================= */}
          {filteredNotes.length > 0 ? (

            <div className="notes-grid">

              {filteredNotes.map((note) => (

                <div
                  className="note-card"
                  key={note.id}
                >

                  <div className="note-top">

                    <div className="note-icon">
                      📝
                    </div>

                    <div className="note-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(note)
                        }
                        title="Edit note"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(note.id)
                        }
                        title="Delete note"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  <h3>
                    {note.title}
                  </h3>

                  <p>
                    {note.content}
                  </p>

                  <div className="note-footer">

                    <span>
                      📌 Personal Note
                    </span>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="empty-state">

              <div className="empty-icon">
                📝
              </div>

              <h3>
                {search
                  ? "No notes found"
                  : "No Notes Yet"}
              </h3>

              <p>
                {search
                  ? "Try searching with a different keyword."
                  : "Start writing your first note above!"}
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Home;