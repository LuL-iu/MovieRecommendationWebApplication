var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

function getAllGenres(req, res) {
  var query = `
    SELECT DISTINCT genre 
    FROM Genres;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getTopInGenre(req, res) {
  var genre = req.params.genre
  var query = `
    SELECT title as title, rating as rating, vote_count as vote_count
    FROM Genres JOIN Movies ON movie_id = id
    WHERE genre = '${genre}'
    ORDER BY rating DESC, vote_count DESC
    LIMIT 10;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getRecs(req, res) {
  var title = req.params.movieName
  var query = `
  WITH temp AS (
    SELECT G.genre
    FROM Movies M
    JOIN Genres G 
        ON M.id = G.movie_id
    WHERE M.title LIKE '${title}'
  )
  SELECT M.title, M.id, M.rating, M.vote_count
  FROM Movies M 
  JOIN Genres G
      ON M.id = G.movie_id
  JOIN temp 
      ON G.genre = temp.genre
  WHERE M.title <> '${title}'
  GROUP BY M.title, M.id, M.rating, M.vote_count
  HAVING COUNT(DISTINCT G.genre) = (SELECT COUNT(*) FROM temp)
  ORDER BY M.rating DESC, M.vote_count DESC
  Limit 5;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function bestGenresPerDecade(req, res) {
  var decade = req.params.selectedDecade
  var query = `
  WITH allGenre AS(
    SELECT DISTINCT genre 
    FROM Genres),
    
    selectGenre AS(
    SELECT genre, AVG(rating) AS avgR
    FROM Genres G JOIN Movies M ON G.movie_id = M.id
    WHERE (FLOOR(release_year/10))*10 = '${decade}'
    GROUP BY genre)
    
    SELECT AG.genre AS genre, ifnull(SG.avgR, 0) AS avg_rating
    FROM allGenre AG left JOIN selectGenre SG ON AG.genre = SG.genre
    ORDER BY SG.avgR DESC, AG.genre;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade
}