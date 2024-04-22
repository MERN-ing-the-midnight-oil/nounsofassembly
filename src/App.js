import React, { useState, useEffect } from "react";
import "./App.css";
import animals from "./animals";
import collectives from "./collectives";

function App() {
	const [selectedAnimal, setSelectedAnimal] = useState(animals[0]);
	const [selectedNoun, setSelectedNoun] = useState(collectives[0]);
	const [result, setResult] = useState(`A ${collectives[0]} of ${animals[0]}`);
	const [savedPhrases, setSavedPhrases] = useState([]);
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const phrases = JSON.parse(localStorage.getItem("phrases")) || [];
		setSavedPhrases(phrases);
	}, []);

	useEffect(() => {
		generatePhrase();
	}, [selectedAnimal, selectedNoun]);

	const generatePhrase = () => {
		const newPhrase = `A ${selectedNoun} of ${selectedAnimal}`;
		setResult(newPhrase);
	};

	const savePhrase = () => {
		const updatedPhrases = [...savedPhrases, result];
		localStorage.setItem("phrases", JSON.stringify(updatedPhrases));
		setShowProgressBar(true);
		const progressInterval = setInterval(() => {
			setProgress((prevProgress) => prevProgress + 1);
		}, 50); // Increase progress every 50 milliseconds
		setTimeout(() => {
			clearInterval(progressInterval);
			setShowProgressBar(false);
			setProgress(0);
			setSavedPhrases(updatedPhrases);

			// Scroll to the newly added phrase
			const newPhraseIndex = updatedPhrases.length - 1;
			const newPhraseElement = document.getElementById(
				`phrase-${newPhraseIndex}`
			);
			if (newPhraseElement) {
				newPhraseElement.scrollIntoView({ behavior: "smooth" });
			}
		}, 5000); // Timeout after 5000 milliseconds (5 seconds)
	};

	const handleScroll = (offset) => {
		const savedPhrasesList = document.querySelector(".saved-phrases");
		savedPhrasesList.scrollTop += offset;
	};

	return (
		<div className="App">
			<header className="App-header">
				<div className="icon-title-container">
					<img
						src="/logo.webp"
						className="App-logo"
						alt="logo"
						style={{ width: "100px", height: "auto" }}
					/>
					<h1>Nouns of Assembly Phrase Masher</h1>
				</div>
				<div className="container">
					<div>
						<h2>Select an Animal</h2>
						<select
							value={selectedAnimal}
							onChange={(e) => setSelectedAnimal(e.target.value)}>
							{animals.map((animal) => (
								<option
									key={animal}
									value={animal}>
									{animal}
								</option>
							))}
						</select>
					</div>
					<div>
						<h2>Select a Noun of Assembly</h2>
						<select
							value={selectedNoun}
							onChange={(e) => setSelectedNoun(e.target.value)}>
							{collectives.map((noun) => (
								<option
									key={noun}
									value={noun}>
									{noun}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="phrase-container">
					<p className="phrase-display">
						<span className="your-phrase">Your Phrase:</span>{" "}
						<span className="current-phrase">{result}</span>
					</p>
					<button
						className="save-button"
						onClick={savePhrase}>
						Save Phrase
					</button>
					{showProgressBar && (
						<div className="progress-bar-container">
							<div
								className="progress-bar"
								style={{ width: `${(progress / 100) * 100}%` }}></div>
						</div>
					)}
				</div>

				<ul className="saved-phrases">
					{savedPhrases.map((phrase, index) => (
						<li
							key={index}
							id={`phrase-${index}`}>
							{phrase}
						</li>
					))}
					{/* Scroll buttons */}
					<div
						className="scroll-button scroll-button-up"
						onClick={() => handleScroll(-50)}>
						&uarr;
					</div>
					<div
						className="scroll-button scroll-button-down"
						onClick={() => handleScroll(50)}>
						&darr;
					</div>
				</ul>
			</header>
		</div>
	);
}

export default App;
