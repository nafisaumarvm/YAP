from __future__ import annotations

import random
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).parent
QUESTIONS_FILE = ROOT / "YAP cards.txt"
LOGO_FILE = ROOT / "YAP logo (1).png"


def load_questions(path: Path) -> list[str]:
    if not path.exists():
        return []

    cleaned: list[str] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.lower() == "yap cards":
            continue
        if line.startswith("AO :"):
            line = line.replace("AO :", "", 1).strip()
        line = line.replace("*each other", "each other")
        line = line.replace("*?", "?")
        if line:
            cleaned.append(line)

    return cleaned


def init_deck(cards: list[str]) -> None:
    if "deck" not in st.session_state:
        shuffled = cards[:]
        random.shuffle(shuffled)
        st.session_state["deck"] = shuffled
        st.session_state["index"] = 0
        st.session_state["seen"] = []


def next_card() -> None:
    deck = st.session_state["deck"]
    index = st.session_state["index"]
    current = deck[index]
    st.session_state["seen"].append(current)
    st.session_state["index"] = (index + 1) % len(deck)


st.set_page_config(page_title="YAP Cards", page_icon=":speech_balloon:", layout="centered")

st.markdown(
    """
    <style>
    .block-container {
        max-width: 760px;
        padding-top: 0.9rem;
        padding-bottom: 1.8rem;
    }
    .headline {
        margin-top: 0.35rem;
        margin-bottom: 0.8rem;
        color: #f8fafc;
        text-align: center;
        font-size: 1.1rem;
    }
    .instruction {
        margin-bottom: 1rem;
        color: #cbd5e1;
        text-align: center;
        font-size: 0.95rem;
    }
    .question-wrap {
        margin: 0.3rem 0 1rem 0;
        padding: 1.2rem 1rem;
        border: 1px solid #334155;
        border-radius: 14px;
        background: #0f172a;
    }
    .question-text {
        color: #f8fafc;
        text-align: center;
        font-size: clamp(1.15rem, 4vw, 1.6rem);
        line-height: 1.5;
        margin: 0;
    }
    div[data-testid="stButton"] button {
        border-radius: 999px;
        border: 1px solid #ea5b2d;
        color: #ea5b2d;
        background: transparent;
        font-weight: 600;
        padding: 0.58rem 1rem;
    }
    div[data-testid="stButton"] button:hover {
        border-color: #ff7b4a;
        color: #ff7b4a;
    }
    @media (max-width: 480px) {
        .question-wrap {
            padding: 1.1rem 0.9rem;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)

if LOGO_FILE.exists():
    st.image(str(LOGO_FILE), use_container_width=True)
else:
    st.title("yap")

st.markdown('<p class="headline">how & who</p>', unsafe_allow_html=True)
st.markdown(
    '<p class="instruction">How to play: ask and answer one card at a time. Refresh to reset.</p>',
    unsafe_allow_html=True,
)

questions = load_questions(QUESTIONS_FILE)

if not questions:
    st.error("Could not load questions from `YAP cards.txt`.")
else:
    init_deck(questions)

    deck = st.session_state["deck"]
    index = st.session_state["index"]
    current = deck[index]
    previous_cards = st.session_state["seen"]

    st.markdown('<div class="question-wrap">', unsafe_allow_html=True)
    st.markdown(f'<p class="question-text">{current}</p>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    st.button("next card", use_container_width=True, on_click=next_card)

    with st.expander("previous cards"):
        if previous_cards:
            for card in reversed(previous_cards):
                st.markdown(f"- {card}")
        else:
            st.caption("No previous cards yet.")
