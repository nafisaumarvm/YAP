import React from "react";

import { questions as yapQuestions } from "./assets/questions";
import Card from "./components/card/Card";
import { bigCardStyles } from "./components/card/Card.css";
import Credits from "./components/credits/Credits";
import CardHistory from "./components/history/CardHistory";
import {
  appStyles,
  levelsStyles,
  nextCardButtonStlyes,
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
  const [deck] = React.useState(initialDeck);
  const [currCard, setCurrCard] = React.useState(deck[0]);
  const [cardHistory, setCardHistory] = React.useState<string[]>([]);

  function handleNextCard() {
    if (deck.length === 1) {
      if (currCard === FINAL_MESSAGE) {
        return;
      }
      setCardHistory([currCard, ...cardHistory]);
      setCurrCard(FINAL_MESSAGE);
    } else {
      setCardHistory([currCard, ...cardHistory]);
      deck.shift();
      setCurrCard(deck[0]);
    }
  }

  return (
    <div className={appStyles}>
      <Credits />
      {/* Same width as level buttons column — keeps layout aligned with WNRS */}
      <div className={levelsStyles} aria-hidden="true" />
      <div className={questionStyles}>
        <div className={titleStyles}>yap</div>
        <Card styleName={bigCardStyles} question={currCard} />
        <button className={nextCardButtonStlyes} onClick={() => handleNextCard()}>
          next card
        </button>
      </div>
      <CardHistory cardHistory={cardHistory} />
    </div>
  );
}

export default App;
