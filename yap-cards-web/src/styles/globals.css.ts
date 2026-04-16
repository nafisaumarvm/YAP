import { createVar, globalStyle } from "@vanilla-extract/css";

export const primaryAccent = createVar();
export const primaryAccentMuted = createVar();

globalStyle("*", {
  boxSizing: "border-box",
});

globalStyle("html, body, #root", {
  height: "100%",
});

globalStyle("body", {
  fontFamily: '"Biryani", sans-serif',
  vars: {
    [primaryAccent]: "#ea5b2d",
    [primaryAccentMuted]: "#d14a22",
  },
});

globalStyle("a, a:visited, a:hover", {
  margin: 0,
});

globalStyle("::-webkit-scrollbar", {
  width: 10,
});

globalStyle("::-webkit-scrollbar-track", {
  background: "white",
});

globalStyle("::-webkit-scrollbar-thumb", {
  background: primaryAccent,
  borderRadius: 50,
});
