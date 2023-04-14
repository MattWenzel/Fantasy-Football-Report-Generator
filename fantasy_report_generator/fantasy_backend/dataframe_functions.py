import pandas as pd
import json


def get_range_weekly_points(year, start_week=1, end_week=18, scoring=""):
    """
    Creates a DataFrame containing all players and their averages between a range of weeks in a season.

    Args:
        year: The season year.
        start_week: The starting week of the range (inclusive).
        end_week: The ending week of the range (inclusive).
        scoring: The scoring format ("std" for standard, or other formats).

    Returns:
        A DataFrame containing player averages between the specified range of weeks.
    """
    scoring = "std" if scoring == "" else scoring
    end_week = 17 if year < 2021 and end_week > 17 else end_week
    start_week = min(start_week, end_week)
    df = pd.read_csv(f"data/{scoring}/{year}_{scoring}.csv")
    df['Year'] = year
    if (end_week == 17 and year < 2021) or (end_week == 18 and year >= 2021):
        if start_week == 1:
            df.drop(df.columns[6:-1], axis=1, inplace=True)
            return df
    return calculate_avg(df, start_week, end_week)


def calculate_avg(df, start_week, end_week):
    """
       Calculates the average, total points, and games played for each player in the given DataFrame.

       Args:
           df: The input DataFrame containing player data.
           start_week: The starting week of the range (inclusive).
           end_week: The ending week of the range (inclusive).

       Returns:
           A DataFrame containing the calculated average, total points, and games played for each player.
       """
    start_column = f"Week {start_week}"
    end_column = f"Week {end_week}"
    df["Avg"] = df.loc[:, start_column:end_column].apply(lambda x: x.sum() / (~x.isna()).sum() if (~x.isna()).sum() != 0 else 0, axis=1)
    df["Avg"] = df["Avg"].round(1)
    df["Points"] = df.loc[:, start_column:end_column].sum(axis=1)
    df["Points"] = df["Points"].round(1)
    df["Games"] = (~df.loc[:, start_column:end_column].isna()).sum(axis=1)
    df.drop(df.columns[6:-1], axis=1, inplace=True)
    df.sort_values("Avg", ascending=False, inplace=True)
    return df


def get_top_players(start_year, end_year, positions, scoring="", start_week=1, end_week=18, min_games=0,
                    num_players=50, teams="ALL", sortby="Points"):
    """
    Returns a DataFrame containing players sorted by their averages. Users can choose the years, positions,
    and range of weeks to include. Can also filter players based on the number of games played.

    Args:
        start_year: The starting year of the range (inclusive).
        end_year: The ending year of the range (inclusive).
        positions: List of player positions to include.
        scoring: The scoring format ("std" for standard, or other formats).
        start_week: The starting week of the range (inclusive).
        end_week: The ending week of the range (inclusive).
        min_games: Minimum number of games played to be included.
        num_players: Number of top players to return.
        teams: Team(s) to filter players by. Can be a single team abbreviation or a list of abbreviations. Use "ALL" for all teams.
        sortby: Column name to sort players by.

    Returns:
        A DataFrame containing the top players sorted by the specified column.
    """

    min_games = min(end_week - start_week, min_games)
    end_year = max(start_year, end_year)
    end_week = max(start_week, end_week)

    df_list = []
    for year in range(start_year, end_year + 1):
        df = get_range_weekly_points(year, start_week, end_week, scoring)
        df_list.append(df)
    combined_df = pd.concat(df_list)
    combined_df.sort_values(by=sortby, ascending=False, inplace=True)

    if teams != "ALL":
        mask = combined_df['Position'].isin(positions) & (combined_df['Games'] >= min_games) \
               & (combined_df['Team'].isin(teams if isinstance(teams, list) else [teams]))
    else:
        mask = combined_df['Position'].isin(positions) & (combined_df['Games'] >= min_games)

    combined_df = combined_df[mask]
    combined_df.reset_index(drop=True, inplace=True)
    combined_df.index += 1
    result = combined_df.head(num_players)
    return result


def get_team_totals(year, team, scoring=""):
    """
    Get total player scores for a given team.

    Args:
        year: The year for which to retrieve the data.
        team: The team abbreviation.
        scoring: The scoring format ("std" for standard, or other formats).

    Returns:
        A DataFrame containing the total player scores for the given team.
    """
    scoring = "std" if scoring == "" else scoring
    players_df = pd.read_csv(f"data/{scoring}/{year}_{scoring}.csv")
    mask = players_df['Team'] == team
    players_df = players_df[mask]

    position_totals = players_df.groupby('Position')['Points'].sum().round(1)
    data = {"Year": year,
            "Team": team,
            "QB": position_totals.get("QB", 0),
            "RB": position_totals.get("RB", 0),
            "WR": position_totals.get("WR", 0),
            "TE": position_totals.get("TE", 0),
            "DST": position_totals.get("DST", 0),
            "K": position_totals.get("K", 0),
            "Total": players_df["Points"].sum().round(1)}

    data = pd.DataFrame(data, index=[0])
    return data


def get_compare_teams(year1, year2, team1, team2, scoring1="", scoring2=""):
    """
    Returns a combined DataFrame for two different teams.

    Args:
        year1: The year for team1's data.
        year2: The year for team2's data.
        team1: The abbreviation for team1.
        team2: The abbreviation for team2.
        scoring1: The scoring format for team1 ("std" for standard, or other formats).
        scoring2: The scoring format for team2 ("std" for standard, or other formats).

    Returns:
        A DataFrame containing the total player scores for both teams.
    """
    team_1 = get_team_totals(year1, team1, scoring1)
    team_2 = get_team_totals(year2, team2, scoring2)
    df = pd.concat([team_1, team_2])
    df = df.reset_index(drop=True)
    df.index = df.index + 1
    df.index = 'Team' + ' ' + df.index.astype(str)
    return df


def get_single_player_scores(year, name, scoring=""):
    """
    Returns all weekly scores for a single player in a given season.

    Args:
        year: The year for which to retrieve the data.
        name: The name of the player.
        scoring: The scoring format ("std" for standard, or other formats).

    Returns:
        A DataFrame containing the weekly scores for the given player.
    """
    scoring = "std" if scoring == "" else scoring
    df = pd.read_csv(f"data/{scoring}/{year}_{scoring}.csv")
    player_info = df.loc[df['Player'] == name]
    return player_info


def get_compare_player_scores(year1, year2, name1, name2, scoring1="", scoring2=""):
    """
    Returns all weekly scores for 2 single players in a given season.

    Args:
        year1: The year for player1's data.
        year2: The year for player2's data.
        name1: The name of player1.
        name2: The name of player2.
        scoring1: The scoring format for player1 ("std" for standard, or other formats).
        scoring2: The scoring format for player2 ("std" for standard, or other formats).

    Returns:
        A DataFrame containing the weekly scores for both players.
    """
    player_1 = get_single_player_scores(year1, name1, scoring1)
    player_2 = get_single_player_scores(year2, name2, scoring2)
    df = pd.concat([player_1, player_2])
    df.fillna("NA", inplace=True)
    df = df.reset_index(drop=False)
    df.index = df.index + 1
    df.index = 'Player' + ' ' + df.index.astype(str)
    df = df.drop("index", axis=1)
    return df


def get_player_names(year):
    """returns a list of all player names from a given year"""
    df = pd.read_csv(f"data/std/{year}_std.csv")
    return df['Player'].tolist()


def get_logo_URL(team):
    """returns link to logo for the given team"""
    with open('data/team_logos.json', 'r') as f:
        team_logos = json.load(f)

    return team_logos.get(team, None)

