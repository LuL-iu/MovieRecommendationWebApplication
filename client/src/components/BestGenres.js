import React from 'react';
import PageNavbar from './PageNavbar';
import BestGenreRow from './BestGenreRow';
import '../style/BestGenres.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenre extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedDecade: "",
			decades: [],
			genres: []
		};

		this.submitDecade = this.submitDecade.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		// Send an HTTP request to the server.
		fetch("http://localhost:8081/decades",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(decadesList => {
		  if (!decadesList) return;
		  // Map each decadesObj in decadesList to an HTML element:
		  let decadesDivs = decadesList.map((decadesResult, i) =>
		  <option value={decadesResult.decade}>{decadesResult.decade}</option>
		  );
		  // Set the state of the genres list to the value returned by the HTTP response from the server.
		  this.setState({
			decades: decadesDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	}

	handleChange(e) {
		this.setState({
			selectedDecade: e.target.value
		});
	}

	submitDecade() {
		fetch("http://localhost:8081/decades/" + this.state.selectedDecade,
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(genreList => {
		  if (!genreList) return;
		  // Map each genreObj in genreList to an HTML element:
		  // A button which triggers the showMovies function for each genre.
		  let genreDivs = genreList.map((genresResult, i) => 
		  <BestGenreRow genre={genresResult.genre} avg_rating={genresResult.avg_rating}/>
		  );
		  // Set the state of the genres list to the value returned by the HTTP response from the server.
		  this.setState({
			genres: genreDivs
		  });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
	}

	render() {

		return (
			<div className="BestGenres">
				<PageNavbar active="bestgenres" />

				<div className="container bestgenres-container">
			      <div className="jumbotron">
			        <div className="h5">Best Genres</div>

			        <div className="years-container">
			          <div className="dropdown-container">
			            <select value={this.state.selectedDecade} onChange={this.handleChange} className="dropdown" id="decadesDropdown">
			            	<option select value> -- select an option -- </option>
			            	{this.state.decades}
			            </select>
			            <button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitDecade}>Submit</button>
			          </div>
			        </div>
			      </div>
			      <div className="jumbotron">
			        <div className="movies-container">
			          <div className="movie">
			            <div className="header"><strong>Genre</strong></div>
			            <div className="header"><strong>Average Rating</strong></div>
			          </div>
			          <div className="movies-container" id="results">
			            {this.state.genres}
			          </div>
			        </div>
			      </div>
			    </div>
			</div>
		);
	}
}