import { useState } from "react";
import "./Home.css";

function Home() {
  const username = localStorage.getItem("username") || "User";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [notes, setNotes] = useState([]);

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Add / Update Note
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }

    if (editId !== null) {
      setNotes(
        notes.map((note) =>
          note.id === editId
            ? {
                ...note,
                title: title,
                description: description,
              }
            : note
        )
      );

      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title,
        description: description,
      };

      setNotes([...notes, newNote]);
    }

    setTitle("");
    setDescription("");
  };

  // Edit Note
  const handleEdit = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditId(note.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete Note
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  // Search Notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.description.toLowerCase().includes(search.toLowerCase())
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
              localStorage.removeItem("username");
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
            <p className="small-text">YOUR PERSONAL NOTES</p>

            <h1>
              Welcome back, <span>{username}</span> 👋
            </h1>

            <p className="welcome-description">
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
            <div className="title-icon">✏️</div>

            <div>
              <h2>
                {editId !== null ? "Edit Your Note" : "Create a New Note"}
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
              <label>Description</label>

              <textarea
                placeholder="Write your note here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-buttons">

              <button type="submit" className="add-btn">
                {editId !== null ? "✓ Update Note" : "+ Add Note"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* Notes Header */}
        <section className="notes-section">

          <div className="notes-header">

            <div>
              <h2>My Notes</h2>

              <p>
                {notes.length === 0
                  ? "You don't have any notes yet"
                  : `${notes.length} ${
                      notes.length === 1 ? "note" : "notes"
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

          </div>

          {/* Notes */}
          {filteredNotes.length > 0 ? (

            <div className="notes-grid">

              {filteredNotes.map((note) => (

                <div className="note-card" key={note.id}>

                  <div className="note-top">

                    <div className="note-icon">
                      📝
                    </div>

                    <div className="note-actions">

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(note)}
                        title="Edit note"
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(note.id)}
                        title="Delete note"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  <h3>{note.title}</h3>

                  <p>{note.description}</p>

                  <div className="note-footer">
                    <span>📌 Personal Note</span>
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
                {search ? "No notes found" : "No Notes Yet"}
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