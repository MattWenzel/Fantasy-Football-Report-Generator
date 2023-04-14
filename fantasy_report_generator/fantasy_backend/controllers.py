from flask import request, make_response, jsonify
from dataframe_functions import *
import os
from urllib.parse import unquote


def generate_response(df):
    """
    Generate a JSON response with appropriate headers from a given DataFrame.
    :param df: pandas DataFrame to convert into a JSON response
    :return: JSON response with appropriate headers
    """
    response = make_response(df.to_json(orient='records'))
    response.headers['Content-Type'] = 'application/json'
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


def get_reports():
    """
    List all available reports in the 'saved_reports' folder.
    :return: JSON response containing a list of report names
     """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    saved_reports_path = os.path.join(current_dir, 'saved_reports')
    try:
        reports = os.listdir(saved_reports_path)
        return jsonify(reports)
    except FileNotFoundError:
        return jsonify({"error": "The saved_reports folder could not be found"}), 404


def read_report():
    """
    Read a specific report from the 'saved_reports' folder given its name.
    :return: JSON response containing the report data
    """
    data = request.get_json()
    report_name = str(data['report_name'])
    df = pd.read_csv(f"saved_reports/{report_name}")
    return generate_response(df)


def delete_report():
    """
    Delete a report from the 'saved_reports' folder given its name.
    :return: JSON response containing a success or error message
    """
    report_name = request.args.get('fileName')
    if not report_name:
        return jsonify({"message": "Missing 'fileName' parameter"}), 400
    file_path = f"saved_reports/{report_name}"
    if not os.path.exists(file_path):
        return jsonify({"message": "Report not found"}), 404
    try:
        os.remove(file_path)
        return jsonify({"message": "Report deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error deleting report: {str(e)}"}), 500


def download_report():
    """
    Download a report from the 'saved_reports' folder as a CSV file given its name.
    :return: CSV file response
    """
    data = request.get_json()
    report_name = data.get('fileName')
    if not report_name:
        return jsonify({"message": "Missing 'fileName' parameter"}), 400
    file_path = f"saved_reports/{report_name}"
    if not os.path.exists(file_path):
        return jsonify({"message": "Report not found"}), 404
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()
        response = make_response(file_content)
        response.headers.set("Content-Type", "text/csv")
        response.headers.set("Content-Disposition", f"attachment; filename={report_name}")
        return response
    except Exception as e:
        return jsonify({"message": f"Error downloading file: {str(e)}"}), 500


def create_new_report():
    """
    Create a new report based on the specified input parameters.
    :return: JSON response containing the fantasy players report data
    """
    data = request.get_json()
    start_year = data.get('startYear')
    end_year = data.get('endYear')
    start_week = data.get('startWeek')
    end_week = data.get('endWeek')
    positions = data.get("positions")
    scoring = data.get("scoringType")
    min_games = data.get("minGames")
    num_players = data.get("maxPlayers")
    team = data.get("team")

    if not all([start_year, end_year, start_week, end_week, positions]):
        return jsonify({"message": "Missing required parameters"}), 400

    df = get_top_players(int(start_year), int(end_year), positions, scoring, int(start_week), int(end_week), int(min_games),
                         int(num_players), team)

    return generate_response(df)


def save_report():
    """
    Save a report to the 'saved_reports' folder based on the specified input parameters.
    :return: Success message
    """
    data = request.get_json()
    start_year = data.get('startYear')
    end_year = data.get('endYear')
    start_week = data.get('startWeek')
    end_week = data.get('endWeek')
    positions = data.get("positions")
    scoring = data.get("scoringType")
    min_games = data.get("minGames")
    num_players = data.get("maxPlayers")
    team = data.get("team")
    report_name = data.get("reportName")

    if not all([start_year, end_year, start_week, end_week, positions, report_name]):
        return jsonify({"message": "Missing required parameters"}), 400

    df = get_top_players(int(start_year), int(end_year), positions, scoring, int(start_week), int(end_week), int(min_games),
                         int(num_players), team)

    df.to_csv(f"saved_reports/{report_name}.csv", index=False)
    return "Report saved successfully."


def players_list():
    """
    Get a list of player names for a specified year.
    :return: Comma-separated list of player names
    """
    year = request.args.get("year")
    if year:
        try:
            year = int(year)
            players = get_player_names(year)
            return ",".join(str(player) for player in players)
        except ValueError:
            return "Error: Invalid year parameter", 400
    else:
        return "Error: year parameter not provided", 400


def player_stats():
    """
    Compare player stats based on the specified input parameters.
    :return: JSON response containing the player stats comparison data
    """
    data = request.get_json()
    year1 = data.get("year1")
    name1 = data.get("name1")
    scoring1 = data.get("scoringType1")
    year2 = data.get("year2")
    name2 = data.get("name2")
    scoring2 = data.get("scoringType2")

    if not all([year1, name1, scoring1, year2, name2, scoring2]):
        return jsonify({"message": "Missing required parameters"}), 400

    name1 = unquote(name1)
    name2 = unquote(name2)

    df = get_compare_player_scores(year1, year2, name1, name2, scoring1, scoring2)
    return generate_response(df)


def team_stats():
    """
    Compare team stats based on the specified input parameters.
    :return: JSON response containing the team stats comparison data
    """
    data = request.get_json()
    year1 = data.get("year1")
    team1 = data.get("team1")
    scoring1 = data.get("scoringType1")
    year2 = data.get("year2")
    team2 = data.get("team2")
    scoring2 = data.get("scoringType2")

    if not all([year1, team1, scoring1, year2, team2, scoring2]):
        return jsonify({"message": "Missing required parameters"}), 400

    df = get_compare_teams(year1, year2, team1, team2, scoring1, scoring2)
    return generate_response(df)


def team_logo():
    """
    Get the URL of a team logo given the team name.
    :return: URL of the team logo
    """
    team = request.args.get("team")
    if team:
        logo_url = get_logo_URL(str(team))
        return logo_url
    else:
        return "Error: team parameter not provided"

