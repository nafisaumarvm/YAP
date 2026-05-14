import React from "react";
import { Link } from "react-router-dom";

import { questions } from "./assets/levels";
import Card from "./components/card/Card";
import { bigCardStyles } from "./components/card/Card.css";
import Credits from "./components/credits/Credits";
import CardHistory from "./components/history/CardHistory";
import { appStyles, nextCardButtonStlyes, questionStyles, titleStyles } from "./styles/app.css";

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;
  let temporaryValue: T;
  let randomIndex: number;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function App() {
  const [deck] = React.useState(() => shuffle([...questions]));
  const [index, setIndex] = React.useState(0);
  const [cardHistory, setCardHistory] = React.useState<string[]>([]);

  const finished = index >= deck.length;
  const currCard = finished ? "" : deck[index];

  function handleNextCard() {
    if (finished) return;
    setCardHistory((prev) => [deck[index], ...prev]);
    setIndex((prev) => prev + 1);
  }

  return (
    <div className={appStyles}>
      <Credits />
      <div className={questionStyles}>
        <div className={titleStyles}>yap</div>
        {finished ? (
          <p> you have reached the end, submit more questions yourself to continue :)</p>
        ) : (
          <Card styleName={bigCardStyles} question={currCard} />
        )}
        <button className={nextCardButtonStlyes} onClick={handleNextCard} disabled={finished}>
          next card
        </button>
      </div>
      <CardHistory cardHistory={cardHistory} />
      <div>
        <Link to="/submit">submit a question</Link>
        <Link to="/vote">vote on questions</Link>
      </div>
    </div>
  );
}

export default App;
