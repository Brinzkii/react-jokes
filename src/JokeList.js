import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

function JokeList({ numJokesToGet = 5 }) {
	const [jokes, setJokes] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const getJokes = async () => {
		try {
			// load jokes one at a time, adding not-yet-seen jokes
			let seenJokes = new Set();
			let jokeArr = [];
			let counter = 0;

			while (counter <= numJokesToGet) {
				let res = await axios.get('https://icanhazdadjoke.com', {
					headers: { Accept: 'application/json' },
				});
				let joke = res.data;

				if (seenJokes.has(joke.id)) {
					console.log('duplicate found!');
				} else {
					joke.votes = 0;
					seenJokes.add(joke.id);
					jokeArr.push(joke);
					counter++;
				}

				if (counter === numJokesToGet) setJokes([...jokeArr]);
			}

			setIsLoading(false);
		} catch (err) {}
	};
	const generateNewJokes = async () => {
		setIsLoading(true);
		await getJokes();
	};
	const vote = (id, delta) => {
		setJokes(jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)));
	};

	useEffect(
		function generateJokesOnMount() {
			setIsLoading(true);
			async function getInitialJokes() {
				try {
					// load jokes one at a time, adding not-yet-seen jokes
					let seenJokes = new Set();
					let jokeArr = [];
					let counter = 0;

					while (counter <= numJokesToGet) {
						let res = await axios.get('https://icanhazdadjoke.com', {
							headers: { Accept: 'application/json' },
						});
						let joke = res.data;

						if (seenJokes.has(joke.id)) {
							continue;
						} else {
							joke.votes = 0;
							seenJokes.add(joke.id);
							jokeArr.push(joke);
							counter++;
						}

						if (counter === numJokesToGet) setJokes([...jokeArr]);
					}

					setIsLoading(false);
				} catch (err) {
					console.error(err);
				}
			}
			getInitialJokes();
		},
		[numJokesToGet]
	);

	if (isLoading) {
		return (
			<div className="loading">
				<i className="fas fa-4x fa-spinner fa-spin" />
			</div>
		);
	}

	let sortedJokes = jokes.sort((a, b) => b.votes - a.votes);

	return (
		<div className="JokeList">
			<button className="JokeList-getmore" onClick={generateNewJokes}>
				Get New Jokes
			</button>

			{sortedJokes.map((j) => (
				<Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
			))}
		</div>
	);
}

export default JokeList;
