import { contStyles, creditStyles, creditTitleStyles } from "./Credits.css";

const Credits = () => {
  return (
    <div className={creditStyles}>
      <div className={creditTitleStyles}>how & who</div>
      <div className={contStyles}>
        <b>How to play:</b> <br />
        Work through the deck. Become more than strangers, one card at a time.
        <p>Refresh to reset card decks.</p>
        <p>
          YAP questions by{" "}
          <a href="https://github.com/nafisaumarvm" rel="noreferrer" target="_blank">
            @nafisaumarvm
          </a>{" "}
          · UI from{" "}
          <a href="https://github.com/munjoonteo/wnrs" rel="noreferrer" target="_blank">
            WNRS
          </a>{" "}
          by <a href="https://github.com/munjoonteo">@munjoonteo</a> and{" "}
          <a href="https://github.com/ilyues">@ilyues</a>.
        </p>
      </div>
    </div>
  );
};

export default Credits;
