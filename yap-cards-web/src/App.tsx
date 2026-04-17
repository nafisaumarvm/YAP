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
  const [formMessage] = React.useState(() =>
    new URLSearchParams(window.location.search).has("submitted")
      ? "Thanks. Your question was submitted for review."
      : "Submitted questions are reviewed before publishing.",
  );

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
        <form
          className={addQuestionFormStyles}
          name="question-submission"
          method="POST"
          action="/?submitted=true"
          data-netlify="true"
          netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="question-submission" />
          <p hidden>
            <label>
              Don't fill this out: <input name="bot-field" />
            </label>
          </p>
          <textarea
            className={questionInputStyles}
            name="question"
            placeholder="submit a question for review"
            aria-label="Add your own question"
            required
          />
          <button className={addQuestionButtonStyles} type="submit">
            submit question
          </button>
          <div className={formMessageStyles}>{formMessage}</div>
        </form>
      </div>
      <CardHistory cardHistory={cardHistory} />
    </div>
  );
}

export default App;
