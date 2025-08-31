import os
from flask import Flask, jsonify, send_from_directory
from edupage_api import Edupage, EduDate

app = Flask(__name__, static_folder="static")

USERNAME = os.getenv("EDUPAGE_USERNAME")
PASSWORD = os.getenv("EDUPAGE_PASSWORD")
SUBDOMAIN = os.getenv("EDUPAGE_SUBDOMAIN")

# přihlášení k EduPage
edupage = Edupage()
edupage.login(USERNAME, PASSWORD, SUBDOMAIN)

@app.route("/api/rozvrh")
def api_rozvrh():
    today = EduDate.today()
    timetable = edupage.get_my_timetable(today)
    return jsonify([{
        "predmet": l.name,
        "ucitel": l.teacher,
        "ucebna": l.classroom,
        "zacatek": l.start.strftime("%H:%M"),
        "konec": l.end.strftime("%H:%M")
    } for l in timetable])

# frontend
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
