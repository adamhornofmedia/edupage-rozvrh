import os
from datetime import date, timedelta
from flask import Flask, jsonify, send_from_directory, request
from edupage_api import Edupage  # EduDate odstraněn

app = Flask(__name__, static_folder="static")

USERNAME = os.getenv("EDUPAGE_USERNAME")
PASSWORD = os.getenv("EDUPAGE_PASSWORD")
SUBDOMAIN = os.getenv("EDUPAGE_SUBDOMAIN")

# přihlášení k EduPage
edupage = Edupage()
edupage.login(USERNAME, PASSWORD, SUBDOMAIN)

@app.route("/api/rozvrh")
def api_rozvrh():
    # Parametr 'date' ve formátu YYYY-MM-DD, jinak dnes
    from flask import request
    date_str = request.args.get("date")
    if date_str:
        try:
            dt = date.fromisoformat(date_str)
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400
    else:
        dt = date.today()
    timetable = edupage.get_my_timetable(dt)
    import logging
    for l in timetable:
        logging.info(f"Lesson attributes: {l.__dict__}")
    return jsonify([{
        "predmet": getattr(l, "subject", None),
        "ucitel": getattr(l, "teacher", None),
        "ucebna": getattr(l, "classroom", None),
        "zacatek": l.start.strftime("%H:%M") if hasattr(l, "start") else None,
        "konec": l.end.strftime("%H:%M") if hasattr(l, "end") else None
    } for l in timetable])
# API pro stálý rozvrh (nezávislý na datu)
@app.route("/api/staly_rozvrh")
def api_staly_rozvrh():
    # Pondělí aktuálního týdne
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    timetable = edupage.get_my_timetable(monday)
    import logging
    for l in timetable:
        logging.info(f"Lesson attributes: {l.__dict__}")
    return jsonify([{
        "predmet": getattr(l, "subject", None),
        "ucitel": getattr(l, "teacher", None),
        "ucebna": getattr(l, "classroom", None),
        "zacatek": l.start.strftime("%H:%M") if hasattr(l, "start") else None,
        "konec": l.end.strftime("%H:%M") if hasattr(l, "end") else None
    } for l in timetable])

# frontend
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)