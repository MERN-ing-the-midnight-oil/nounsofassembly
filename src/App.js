import React, { useState, useEffect } from "react";
import "./App.css";
import animals from "./animals";
import collectives from "./collectives";
import professions from "./professions"; // Import the professions array

function App() {
	const [selectedAnimal, setSelectedAnimal] = useState(animals[0]);
	const [selectedNoun, setSelectedNoun] = useState(collectives[0]);
	const [result, setResult] = useState(`A ${collectives[0]} of ${animals[0]}`);
	const [savedPhrases, setSavedPhrases] = useState([]);
	const [showProgressBar, setShowProgressBar] = useState(false);
	const [progress, setProgress] = useState(0);
	const [upvotingInProgress, setUpvotingInProgress] = useState(false);
	const [upvotingProgress, setUpvotingProgress] = useState(0);
	const [activeCategory, setActiveCategory] = useState("animals"); // Track active category

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

	const handleUpvote = (index) => {
		if (index > 0) {
			setUpvotingInProgress(true); // Set upvoting in progress
			let progress = 0;
			const upvoteInterval = setInterval(() => {
				progress += 10;
				if (progress >= 100) {
					clearInterval(upvoteInterval);
					const updatedPhrases = [...savedPhrases];
					const temp = updatedPhrases[index];
					updatedPhrases[index] = updatedPhrases[index - 1];
					updatedPhrases[index - 1] = temp;
					setSavedPhrases(updatedPhrases);
					localStorage.setItem("phrases", JSON.stringify(updatedPhrases)); // Update phrases in local storage
					setUpvotingInProgress(false); // Set upvoting progress to false
				}
				setUpvotingProgress(progress);
			}, 500); // Update progress every 500 milliseconds

			// Show progress bar during upvoting
			setTimeout(() => {
				clearInterval(upvoteInterval);
				setUpvotingInProgress(false); // Set upvoting progress to false
			}, 5000); // Timeout after 5000 milliseconds (5 seconds)
		}
	};

	const handleCategoryChange = (category) => {
		setActiveCategory(category);
		if (category === "animals") {
			setSelectedAnimal(animals[0]);
		} else if (category === "professions") {
			setSelectedAnimal(professions[0]);
		}
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
					<h1>Cora Smoker's Wonder Fair Nouns of Assembly Phrase Masher</h1>
				</div>
				<div className="container">
					<div>
						<h2>Select a Noun</h2>
						<div className="category-buttons">
							<button
								className={activeCategory === "animals" ? "active" : ""}
								onClick={() => handleCategoryChange("animals")}>
								Animals
							</button>
							<button
								className={activeCategory === "professions" ? "active" : ""}
								onClick={() => handleCategoryChange("professions")}>
								Professions
							</button>
						</div>
						<select
							value={selectedAnimal}
							onChange={(e) => setSelectedAnimal(e.target.value)}>
							{activeCategory === "animals"
								? animals.map((animal) => (
										<option
											key={animal}
											value={animal}>
											{animal}
										</option>
								  ))
								: activeCategory === "professions"
								? professions.map((profession) => (
										<option
											key={profession}
											value={profession}>
											{profession}
										</option>
								  ))
								: null}
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
					{upvotingInProgress && (
						<div className="progress-bar-container">
							<div
								className="progress-bar upvoting-progress-bar"
								style={{ width: `${(upvotingProgress / 100) * 100}%` }}>
								Upvoting...
							</div>
						</div>
					)}
				</div>
				<ul className="saved-phrases">
					{savedPhrases.map((phrase, index) => (
						<li
							key={index}
							id={`phrase-${index}`}>
							{phrase}
							<span
								className="upvote-icon"
								onClick={() => handleUpvote(index)}>
								&#9650;
							</span>
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
				<div className="upvote-instructions">
					Click on the triangle to vote for your favorite phrases
				</div>
			</header>
		</div>
	);
}

export default App;
