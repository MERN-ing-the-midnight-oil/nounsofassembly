import React, { useState, useEffect } from "react";
import "./App.css";
import animals from "./animals";
import ations from "./ations"; // Import the ations array
import gatherings from "./gatherings"; // Import the gatherings array
import professions from "./professions"; // Import the professions array
import vehicles from "./vehicles"; // Import the vehicles array
import noises from "./noises"; // Import the noises array

function App() {
	const [selectedNoun, setSelectedNoun] = useState(professions[0]); // Set initial value for Noun dropdown
	const [selectedNounOfAssembly, setSelectedNounOfAssembly] = useState(
		ations[0]
	); // Set initial value for Noun of Assembly dropdown
	const [result, setResult] = useState(""); // State for the generated phrase

	const [savedPhrases, setSavedPhrases] = useState([]); // State for saved phrases
	const [showProgressBar, setShowProgressBar] = useState(false); // State for progress bar visibility
	const [progress, setProgress] = useState(0); // State for progress bar
	const [upvotingInProgress, setUpvotingInProgress] = useState(false); // State for upvoting progress
	const [upvotingProgress, setUpvotingProgress] = useState(0); // State for upvoting progress

	useEffect(() => {
		const phrases = JSON.parse(localStorage.getItem("phrases")) || [];
		setSavedPhrases(phrases);
	}, []);

	useEffect(() => {
		generatePhrase(); // Call generatePhrase after initial values are set
	}, []);

	useEffect(() => {
		generatePhrase(); // Call generatePhrase whenever selectedNoun or selectedNounOfAssembly changes
	}, [selectedNoun, selectedNounOfAssembly]);

	const generatePhrase = () => {
		const newPhrase = `A ${selectedNounOfAssembly || "NounOfAssembly"} of ${
			selectedNoun || "Noun"
		}`;
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

	const handleNounChange = (noun) => {
		if (noun !== selectedNoun) {
			setSelectedNoun(noun);
		}
	};

	const handleNounOfAssemblyChange = (noun) => {
		if (noun !== selectedNounOfAssembly) {
			setSelectedNounOfAssembly(noun);
		}
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
					<h1>
						Cora Smoker's Happy Valley School Wonder Fair 2024 <br /> Nouns of
						Assembly Phrase Masher
					</h1>
				</div>
				<div className="container">
					<div>
						<h2>Select a Noun</h2>
						<div className="category-buttons">
							<button
								className={selectedNoun === animals[0] ? "active" : ""}
								onClick={() => handleNounChange(animals[0])}>
								Animals
							</button>
							<button
								className={selectedNoun === professions[0] ? "active" : ""}
								onClick={() => handleNounChange(professions[0])}>
								Professions
							</button>
							<button
								className={selectedNoun === vehicles[0] ? "active" : ""}
								onClick={() => handleNounChange(vehicles[0])}>
								Vehicles
							</button>
						</div>
						<select
							value={selectedNoun}
							onChange={(e) => handleNounChange(e.target.value)}>
							{selectedNoun === professions[0]
								? professions.map((noun) => (
										<option
											key={noun}
											value={noun}>
											{noun}
										</option>
								  ))
								: selectedNoun === vehicles[0]
								? vehicles.map((noun) => (
										<option
											key={noun}
											value={noun}>
											{noun}
										</option>
								  ))
								: animals.map((noun) => (
										<option
											key={noun}
											value={noun}>
											{noun}
										</option>
								  ))}
						</select>
					</div>
					<div>
						<h2>Select a Noun of Assembly</h2>
						<div className="category-buttons">
							<button
								className={selectedNounOfAssembly === ations[0] ? "active" : ""}
								onClick={() => handleNounOfAssemblyChange(ations[0])}>
								Ations
							</button>
							<button
								className={
									selectedNounOfAssembly === gatherings[0] ? "active" : ""
								}
								onClick={() => handleNounOfAssemblyChange(gatherings[0])}>
								Gatherings
							</button>
							<button
								className={selectedNounOfAssembly === noises[0] ? "active" : ""}
								onClick={() => handleNounOfAssemblyChange(noises[0])}>
								Noises
							</button>
						</div>
						<select
							value={selectedNounOfAssembly}
							onChange={(e) => handleNounOfAssemblyChange(e.target.value)}>
							{selectedNounOfAssembly === ations[0]
								? ations.map((noun) => (
										<option
											key={noun}
											value={noun}>
											{noun}
										</option>
								  ))
								: selectedNounOfAssembly === gatherings[0]
								? gatherings.map((noun) => (
										<option
											key={noun}
											value={noun}>
											{noun}
										</option>
								  ))
								: noises.map((noun) => (
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
