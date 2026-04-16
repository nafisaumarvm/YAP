from __future__ import annotations

import random
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).parent
QUESTIONS_FILE = ROOT / "YAP cards.txt"
LOGO_FILE = ROOT / "yap-logo.svg"
LEVELS = ("Level One", "Level Two", "Level Three")


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


def split_into_levels(questions: list[str]) -> dict[str, list[str]]:
    if not questions:
        return {level: [] for level in LEVELS}

    per_level = len(questions) // len(LEVELS)
    extras = len(questions) % len(LEVELS)

    levels: dict[str, list[str]] = {}
    start = 0
    for idx, level in enumerate(LEVELS):
        stop = start + per_level + (1 if idx < extras else 0)
        levels[level] = questions[start:stop]
        start = stop
    return levels


def init_level_state(level: str, cards: list[str]) -> None:
    deck_key = f"{level}_deck"
    idx_key = f"{level}_index"
    if deck_key not in st.session_state:
        shuffled = cards[:]
        random.shuffle(shuffled)
        st.session_state[deck_key] = shuffled
        st.session_state[idx_key] = 0


def reset_level(level: str, cards: list[str]) -> None:
    shuffled = cards[:]
    random.shuffle(shuffled)
    st.session_state[f"{level}_deck"] = shuffled
    st.session_state[f"{level}_index"] = 0


def next_card(level: str) -> None:
    deck_key = f"{level}_deck"
    idx_key = f"{level}_index"
    deck = st.session_state[deck_key]
    current_idx = st.session_state[idx_key]
    st.session_state[idx_key] = (current_idx + 1) % len(deck)


def render_level(level: str, cards: list[str]) -> None:
    if not cards:
        st.info("No questions loaded for this level.")
        return

    init_level_state(level, cards)

    deck = st.session_state[f"{level}_deck"]
    index = st.session_state[f"{level}_index"]
    current = deck[index]
    previous = deck[:index]

    st.markdown('<div class="card-wrap">', unsafe_allow_html=True)
    st.markdown(f'<div class="question-card">{current}</div>', unsafe_allow_html=True)
    st.markdown("</div>", unsafe_allow_html=True)

    col1, col2 = st.columns([2, 1], gap="small")
    with col1:
        st.button(
            "Next card",
            use_container_width=True,
            key=f"next_{level}",
            on_click=next_card,
            args=(level,),
        )
    with col2:
        st.button(
            "Shuffle",
            use_container_width=True,
            key=f"shuffle_{level}",
            on_click=reset_level,
            args=(level, cards),
        )

    st.markdown("### Previous cards")
    if previous:
        for card in reversed(previous):
            st.markdown(f"- {card}")
    else:
        st.caption("No previous cards yet.")


st.set_page_config(page_title="YAP Cards", page_icon=":speech_balloon:", layout="centered")

st.markdown(
    """
    <style>
    .block-container {
        max-width: 620px;
        padding-top: 1.2rem;
        padding-bottom: 1.5rem;
    }
    .question-card {
        background: linear-gradient(160deg, #111827 0%, #1f2937 100%);
        color: #f9fafb;
        border: 1px solid #374151;
        border-radius: 16px;
        padding: 24px 20px;
        font-size: clamp(1.1rem, 3.6vw, 1.35rem);
        line-height: 1.55;
        min-height: 190px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    }
    .card-wrap {
        margin-top: 0.35rem;
        margin-bottom: 0.8rem;
    }
    h1 {
        margin-bottom: 0.2rem !important;
    }
    @media (max-width: 480px) {
        .question-card {
            min-height: 220px;
            padding: 20px 16px;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)

if LOGO_FILE.exists():
    st.image(str(LOGO_FILE), width=170)
else:
    st.title("YAP")

st.title("YAP Cards")
st.caption("Progress level by level. One card at a time.")
st.caption("Refresh to reset every deck.")

questions = load_questions(QUESTIONS_FILE)
levels = split_into_levels(questions)

if not questions:
    st.error("Could not load questions from `YAP cards.txt`.")
else:
    tabs = st.tabs(LEVELS)
    for tab, level_name in zip(tabs, LEVELS):
        with tab:
            render_level(level_name, levels[level_name])
