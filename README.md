# Overview
Main project is completely contained in the songtrack/ folder


# Initial demo bootup:
At the root directory:
1) in one terminal tab, run `python -m http.server 8000`
2) in another terminal tab, run `python songtrack/songtrack_backend.py`
2) access at `http://localhost:8000/songtrack/static/index.html`


# Todo:
1. Take song in source_audio/ and analyze it with the beats information
2. Read the song in and process it into a wave form that can be displayed
   - https://www.bignerdranch.com/blog/music-visualization-with-d3-js/
