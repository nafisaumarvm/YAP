import { style } from "@vanilla-extract/css";

import { primaryAccent, primaryAccentMuted } from "./globals.css";

export const appStyles = style({
  textAlign: "center",
  display: "flex",
  flexDirection: "row",
  alignContent: "center",
  alignItems: "center",
  fontWeight: 800,
  flexWrap: "wrap",
  justifyContent: "space-evenly",
  maxWidth: 1080,
  margin: "0 auto",
  height: "100%",
});

export const titleStyles = style({
  marginTop: "3vh",
  marginBottom: "3vh",
  width: "12rem",
  height: "auto",
});

export const addQuestionFormStyles = style({
  width: "100%",
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
});

export const questionInputStyles = style({
  width: "100%",
  minHeight: 84,
  border: `solid 2px ${primaryAccent}`,
  borderRadius: 15,
  padding: "0.9rem 1rem",
  fontFamily: '"Biryani", sans-serif',
  fontSize: 15,
  resize: "vertical",
  outline: "none",
  selectors: {
    "&:focus": {
      boxShadow: `0 0 0 2px ${primaryAccentMuted}`,
    },
  },
});

export const addQuestionButtonStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 15,
  backgroundColor: "#fff",
  height: 52,
  width: 231,
  textTransform: "uppercase",
  marginTop: "3vh",
  color: primaryAccent,
  fontSize: 16,
  fontWeight: 800,
  fontFamily: '"Biryani", sans-serif',
  border: `solid 2px ${primaryAccent}`,
  cursor: "pointer",
  ":hover": {
    backgroundColor: primaryAccentMuted,
    color: "#fff",
  },
});

export const formMessageStyles = style({
  color: primaryAccent,
  fontSize: 13,
  minHeight: 18,
});

export const levelsStyles = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  width: "17rem",
});

export const levelButtonStyles = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 15,
  borderRadius: 15,
  border: `solid 2px ${primaryAccent}`,
  backgroundColor: "#fff",
  height: 88,
  width: 231,
  textTransform: "uppercase",
  color: primaryAccent,
  fontSize: 18,
  fontWeight: 800,
  fontFamily: "inherit",
  cursor: "pointer",

  ":hover": {
    backgroundColor: primaryAccentMuted,
    color: "rgb(240, 240, 240)",
  },
  selectors: {
    "&:focus, &:active": {
      outline: "none",
    },
  },
});

export const selectedLevelStyles = style({
  backgroundColor: primaryAccent,
  color: "#fff",
  outline: "none",
});

export const nextCardButtonStlyes = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: 25,
  borderRadius: 15,
  backgroundColor: ["#fff", primaryAccent],
  height: 88,
  width: 231,
  textTransform: "uppercase",
  color: "#fff",
  outline: "none",
  fontSize: 18,
  fontWeight: 800,
  fontFamily: '"Biryani", sans-serif',
  border: "none",

  ":hover": {
    backgroundColor: primaryAccentMuted,
    color: "rgb(240, 240, 240)",
  },
});

export const questionStyles = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "26rem",
  textTransform: "uppercase",
  alignItems: "center",
});
