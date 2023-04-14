# Fantasy Report Generator

Fantasy Report Generator is a web application that provides access to the past 20 years of fantasy football scoring data. Users can compare player and team stats, create custom reports, save, delete and download them as CSV files. The frontend is built with JavaScript, HTML/CSS, while the backend is powered by Python, Pandas, and Flask.

## Features

- Compare any 2 players' scoring stats from available seasons
- Compare any 2 teams' overall stats from available seasons
- Create custom reports based on multiple parameters:
  - Range of years
  - Range of weeks
  - Scoring type
  - Any combination of positions
  - Minimum number of games played within the weekly range
  - Number of players to include in the report
  - Choose a specific team to include players from in the report
- Save reports within the app to view or delete later
- Download reports as CSV files

## Getting Started

### Prerequisites

- Python 3
- Pandas
- Flask

### Installing and Running the Application

1. Clone the repository:

```bash
git clone https://github.com/MattWenzel/Fantasy-Football-Report-Generator.git
```

2. Change to the project directory:

```bash
cd fantasy-report-generator

```

3. Start the Flask backend:

```bash
cd fantasy_backend
flask run
```

4. Open ```homepage.html``` in your preferred web browser and get started on creating your own custom fantasy football reports!
