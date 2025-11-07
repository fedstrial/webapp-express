const connection = require("../data/data_base");

function index(req, res) {
  const sql = "SELECT * FROM movies";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    const movies = results.map((movie) => {
      return {
        ...movie,
        image: req.imagePath + movie.image,
      };
    });
    res.json(movies);
  });
}

function show(req, res) {
  const id = parseInt(req.params.id);
  const movieSql = "SELECT * FROM movies WHERE id = ?";
  const reviewSql = "SELECT * FROM reviews WHERE movie_id = ?";

  connection.query(movieSql, [id], (err, movieResults) => {
    if (err) return res.status(500).json({ error: "Errore query movie" });
    if (movieResults.length === 0)
      return res.status(404).json({ error: "Film non trovato" });

    const movie = { ...movieResults[0] };
    movie.image = req.imagePath + movie.image;

    connection.query(reviewSql, [id], (err, reviewResults) => {
      if (err)
        return res.status(500).json({ error: "Errore query recensioni" });

      if (reviewResults.length > 0) {
        const media =
          reviewResults.reduce((sum, r) => sum + (r.vote || 0), 0) /
          reviewResults.length;
        movie.media_voti = parseFloat(media.toFixed(1));
      } else {
        movie.media_voti = null;
      }

      movie.reviews = reviewResults;
      res.json(movie);
    });
  });
}

function store(req, res) {
  const movieId = parseInt(req.params.id);
  const { name, vote, text } = req.body;

  if (!name || !vote || !text) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  if (vote < 1 || vote > 5) {
    return res.status(400).json({ error: "Il voto deve essere tra 1 e 5" });
  }

  const sql = "INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)";

  connection.query(sql, [movieId, name, vote, text], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Errore nel salvare la recensione" });
    }

    const newReview = {
      id: results.insertId,
      movie_id: movieId,
      name: name,
      vote: vote,
      text: text
    };

    res.status(201).json(newReview);
  });
}

module.exports = { index, show, store };
