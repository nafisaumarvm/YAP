import { contStyles, creditStyles, creditTitleStyles } from "./Credits.css";

const Credits = () => {
  return (
    <div className={creditStyles}>
      <div className={creditTitleStyles}>how & who</div>
      <div className={contStyles}>
        <b>How to play:</b> <br />
        Become more than strangers, one card at a time.
        <p>Refresh to reset card decks.</p>{" "}
        <p>Add questions via the submission form. Questions will be automatically checked for appropriateness and added to the voting page on a daily basis.</p>{" "}
        <p>
          Questions and new additions (question submission box, upvoting) by <a href="https://github.com/nafisaumarvm">nafisaumarvm</a>
          Original design by <a href="https://github.com/munjoonteo">@munjoonteo</a> and{" "}
          <a href="https://github.com/ilyues">@ilyues</a>.
        </p>
      </div>
    </div>
  );
};

export default Credits;
