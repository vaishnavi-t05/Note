import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const username = localStorage.getItem("username") || "User";

  const [title, setTitle] = useState("");
  const [content, setcontent] = useState("");

  const [notes, setNotes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // =========================
  // GET ALL NOTES
  // =========================
  const fetchNotes = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/notes/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setNotes(response.data);
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

  // Load notes when page opens
  useEffect(() => {
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

    try {
      // UPDATE NOTE
      if (editId !== null) {
        await axios.put(
          `http://localhost:8000/api/notes/update/${editId}/`,
          {
            title: title,
            content: content,
          },
          {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
        );

        alert("Note updated successfully");

        setEditId(null);
      } 
      
      // ADD NOTE
      else {
        await axios.post(
          "http://localhost:8000/api/notes/",
          {
            title: title,
            content: content,
          },
          {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }

        );

        alert("Note added successfully");
      }

      // Clear inputs
      setTitle("");
      setcontent("");

      // Refresh notes from backend
      fetchNotes();

    } catch (error) {
      console.error("Error saving note:", error);

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
    setcontent(note.content);
    setEditId(note.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // =========================
  // DELETE NOTE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/notes/delete/${id}/`,
        {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
      );

      alert("Note deleted successfully");

      // Refresh notes
      fetchNotes();

    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };


  // =========================
  // SEARCH NOTES
  // =========================
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          📝 <span>MyNotes</span>
        </div>

        <div className="nav-user">
          <span>👋 {username}</span>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

      </nav>


      {/* Main Content */}
      <main className="main-content">

        {/* Welcome Section */}
        <section className="welcome-section">

          <div>
            <p className="small-text">
              YOUR PERSONAL NOTES
            </p>

            <h1>
              Welcome back, <span>{username}</span> 👋
            </h1>

            <p className="welcome-content">
              Capture your ideas, organize your thoughts and keep
              everything in one place.
            </p>
          </div>

          <div className="note-count">
            <span>📝</span>
            <strong>{notes.length}</strong>
            <small>Total Notes</small>
          </div>

        </section>


        {/* Add Note Section */}
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

              <label>Title</label>

              <input
                type="text"
                placeholder="Enter your note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

            </div>


            <div className="input-group">

              <label>content</label>

              <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setcontent(e.target.value)}
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
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setcontent("");
                  }}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        {/* Notes Section */}
        <section className="notes-section">

          <div className="notes-header">

            <div>

              <h2>My Notes</h2>

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

                🔍

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


          {/* Notes Grid */}
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
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(note)
                        }
                        title="Edit note"
                      >
                        ✏️
                      </button>


                      <button
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


                  <h3>{note.title}</h3>

                  <p>{note.content}</p>


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