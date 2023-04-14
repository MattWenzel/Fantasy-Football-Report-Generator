import controllers
from app import *


@app.route("/get_reports")
def get_reports():
    return controllers.get_reports()


@app.route("/read_reports", methods=['POST'])
def read_report():
    return controllers.read_report()


@app.route('/delete_report', methods=['DELETE'])
def delete_report():
    return controllers.delete_report()


@app.route('/download_reports', methods=['POST'])
def download_report():
    return controllers.download_report()


@app.route('/create_new_report', methods=['POST'])
def create_new_report():
    return controllers.create_new_report()


@app.route('/save_report', methods=['PUT'])
def save_report():
    return controllers.save_report()


@app.route("/players_list")
def players_list():
    return controllers.players_list()


@app.route("/player_stats", methods=['POST'])
def player_stats():
    return controllers.player_stats()


@app.route("/team_stats", methods=['POST'])
def team_stats():
    return controllers.team_stats()


@app.route("/team_logo")
def team_logo():
    return controllers.team_logo()

