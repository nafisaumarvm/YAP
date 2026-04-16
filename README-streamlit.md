# YAP Cards (Streamlit)

This app recreates the WNRS-style card flow using the questions from `YAP cards.txt`.

## Local run

```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

## Streamlit Cloud deploy

1. Push this project to a GitHub repository.
2. In Streamlit Cloud, click **New app** and select that repository.
3. Set the app file path to `streamlit_app.py`.
4. Deploy.

The app auto-loads questions from `YAP cards.txt` and uses `yap-logo.svg`.
