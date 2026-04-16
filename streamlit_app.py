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
    .stApp {
        background: #ffffff;
    }
    .block-container {
        max-width: 700px;
        padding-top: 2.1rem;
        padding-bottom: 1.8rem;
    }
    .headline {
        margin-top: 0.6rem;
        margin-bottom: 0.5rem;
        color: #0f172a;
        text-align: center;
        font-size: 0.9rem;
        text-transform: lowercase;
    }
    .instruction {
        margin-bottom: 1.25rem;
        color: #475569;
        text-align: center;
        font-size: 0.84rem;
    }
    .question-wrap {
        margin: 0.4rem auto 1.15rem auto;
        width: min(100%, 560px);
        min-height: 285px;
        padding: 2rem 1.4rem;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        background: #ffffff;
        box-shadow: 0 14px 40px rgba(15, 23, 42, 0.09);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .question-text {
        color: #0f172a;
        text-align: center;
        font-size: clamp(1.35rem, 4vw, 1.9rem);
        line-height: 1.42;
        margin: 0;
        font-weight: 400;
    }
    div[data-testid="stButton"] button {
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        width: min(100%, 560px);
        margin: 0 auto;
        display: block;
        color: #ea5b2d;
        background: #ffffff;
        font-weight: 500;
        font-size: 0.92rem;
        padding: 0.7rem 1rem;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    }
    div[data-testid="stButton"] button:hover {
        border: 1px solid #ea5b2d;
        color: #ea5b2d;
        background: #fff8f5;
    }
    @media (max-width: 480px) {
        .block-container {
            padding-top: 1.2rem;
        }
        .question-wrap {
            min-height: 245px;
            padding: 1.25rem 0.95rem;
            border-radius: 14px;
        }
        .question-text {
            font-size: 1.28rem;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)

if LOGO_FILE.exists():
    _, logo_col, _ = st.columns([1, 1, 1])
    with logo_col:
        st.image(str(LOGO_FILE), width=120)
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

    st.markdown("#### previous cards")
    if previous_cards:
        for card in reversed(previous_cards):
            st.markdown(f"- {card}")
    else:
        st.caption("No previous cards yet.")
