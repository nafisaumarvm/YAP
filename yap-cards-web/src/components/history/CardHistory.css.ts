import { style } from "@vanilla-extract/css";

import { primaryAccent } from "../../styles/globals.css";

export const historyStyles = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "17rem",
  alignContent: "center",
  alignItems: "center",
  padding: 5,
  "@media": {
    "(max-width: 900px)": {
      maxWidth: "min(26rem, 92vw)",
    },
  },
});

export const historyTitleStyles = style({
  textTransform: "uppercase",
  color: primaryAccent,
  fontSize: 18,
  fontWeight: 800,
});

export const cardContainerStyles = style({
  height: "100%",
  minHeight: "30rem",
  maxHeight: "30rem",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  margin: 10,
  borderRadius: 15,
  border: `solid 2px ${primaryAccent}`,
  "@media": {
    "(max-width: 900px)": {
      minHeight: "18rem",
      maxHeight: "18rem",
      margin: "0.5rem 0",
    },
  },
});

export const cardContainerScrollStyles = style({
  width: "96%",
  height: "96%",
  overflowY: "scroll",
  overflowX: "hidden",
  margin: "auto",
});
