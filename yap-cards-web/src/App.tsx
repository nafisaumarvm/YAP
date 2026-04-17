import React from "react";

import { questions as yapQuestions } from "./assets/questions";
import Card from "./components/card/Card";
import { bigCardStyles } from "./components/card/Card.css";
import Credits from "./components/credits/Credits";
import CardHistory from "./components/history/CardHistory";
import {
  addQuestionButtonStyles,
  addQuestionFormStyles,
  appStyles,
  formMessageStyles,
  levelsStyles,
  nextCardButtonStlyes,
  questionInputStyles,
  questionStyles,
  titleStyles,
} from "./styles/app.css";

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const FINAL_MESSAGE = "You have finished the deck!";

function App() {
  const initialDeck = React.useMemo(() => shuffle([...yapQuestions]), []);
  const [deck, setDeck] = React.useState(initialDeck);
  const [currCard, setCurrCard] = React.useState(deck[0]);
  const [cardHistory, setCardHistory] = React.useState<string[]>([]);
  const [visitorQuestion, setVisitorQuestion] = React.useState("");
  const [formMessage, setFormMessage] = React.useState("");

  function handleNextCard() {
    if (!currCard || currCard === FINAL_MESSAGE) {
      return;
    }

    if (deck.length <= 1) {
      setCardHistory([currCard, ...cardHistory]);
      setDeck([]);
      setCurrCard(FINAL_MESSAGE);
    } else {
      setCardHistory([currCard, ...cardHistory]);
      const nextDeck = deck.slice(1);
      setDeck(nextDeck);
      setCurrCard(nextDeck[0]);
    }
  }

  function handleAddQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanQuestion = visitorQuestion.trim().replace(/\s+/g, " ");

    if (!cleanQuestion) {
      setFormMessage("Please enter a question before adding.");
      return;
    }

    setDeck((prevDeck) => [...prevDeck, cleanQuestion]);
    if (!currCard || currCard === FINAL_MESSAGE) {
      setCurrCard(cleanQuestion);
    }
    setVisitorQuestion("");
    setFormMessage("Question added to the deck.");
  }

  return (
    <div className={appStyles}>
      <Credits />
      {/* Same width as level buttons column — keeps layout aligned with WNRS */}
      <div className={levelsStyles} aria-hidden="true" />
      <div className={questionStyles}>
        <img className={titleStyles} src="/yap-logo.png" alt="YAP logo" />
        <Card styleName={bigCardStyles} question={currCard} />
        <button className={nextCardButtonStlyes} onClick={() => handleNextCard()}>
          next card
        </button>
        <form className={addQuestionFormStyles} onSubmit={handleAddQuestion}>
          <textarea
            className={questionInputStyles}
            value={visitorQuestion}
            onChange={(event) => setVisitorQuestion(event.target.value)}
            placeholder="add your own question"
            aria-label="Add your own question"
          />
          <button className={addQuestionButtonStyles} type="submit">
            add question
          </button>
          <div className={formMessageStyles}>{formMessage}</div>
        </form>
      </div>
      <CardHistory cardHistory={cardHistory} />
    </div>
  );
}

export default App;
