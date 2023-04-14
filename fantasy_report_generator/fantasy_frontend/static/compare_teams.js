// function to get the data from the form
function getData() {
  var form1 = document.getElementById("form1");
  var form2 = document.getElementById("form2");
  return {
    team1: form1.elements.teamSelect.value,
    year1: form1.elements.yearSelect.value,
    scoringType1: form1.elements.scoringType.value,
    team2: form2.elements.teamSelect2.value,
    year2: form2.elements.yearSelect2.value,
    scoringType2: form2.elements.scoringType2.value
  };
}

// function to create select options for the teams dropdown
function loadTeams(id) {
  const teams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAC', 'KC', 'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS']
  let select = document.getElementById(id);
  for (let i = 0; i < teams.length; i++) {
      const option = document.createElement("option");
      option.value = teams[i];
      option.text = teams[i];
      select.add(option);
    }
  }

// function submit the form data and create the table
document.getElementById("submit").addEventListener("click", async function (event) {
  event.preventDefault();
  var data = getData();
  try {
    var [logo_1, logo_2] = await Promise.all([get_logo(data.team1), get_logo(data.team2)]);
    var jsonData = await send_data(data);
    create_team_table(jsonData, logo_1, logo_2);
    console.log(jsonData);
  } catch (error) {
    console.error(error);
  }
});


// Function to get the team logo
async function get_logo(team) {
  try {
    const response = await fetch(API_BASE_URL + "/team_logo?team=" + team);
    const logo = await response.text();
    return logo;
  } catch (error) {
    console.error(error);
  }
}

// Function to send and receive data
async function send_data(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/team_stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(error);
  }
}


// function to create the header row with the team logos
function createHeaderRow(logo_url1, logo_url2) {
  var headerRow = document.createElement("tr");
  var propertyHeader = document.createElement("th");
  propertyHeader.innerHTML = "";
  headerRow.appendChild(propertyHeader);
  // Loop through each team and add each team's logo
  for (var i = 0; i < 2; i++) {
    var teamHeader = document.createElement("th");
    var teamLogo = document.createElement("img");
    var logo_url = (i === 0) ? logo_url1 : logo_url2;
    teamLogo.setAttribute("src", logo_url);
    teamLogo.setAttribute("width", 125);
    teamLogo.setAttribute("height", 125);
    teamHeader.appendChild(teamLogo);
    headerRow.appendChild(teamHeader);
  }
  return headerRow;
}


// function to create the table and append it to the document
function create_team_table(data, logo_url1, logo_url2) {
  // Remove the old table if it exists
  let oldTable = document.querySelector("table");
  if (oldTable) {
    oldTable.remove();
  }
  var table = document.createElement("table");
  // Create the header row and "Team 1" and "Team 2" columns
  var headerRow = createHeaderRow(logo_url1, logo_url2);
  table.appendChild(headerRow);
  // Loop through each player in the data
  for (var i = 0; i < data.length; i++) {
    var team1 = data[i];
    var team2 = data[i + 1];
    // Loop through each key in the player's data
    for (var key in team1) {
      var row = document.createElement("tr");
      var keyCell = document.createElement("td");
      keyCell.innerHTML = key;
      row.appendChild(keyCell);

      var team1Cell = document.createElement("td");
      team1Cell.innerHTML = team1[key];
      row.appendChild(team1Cell);

      var team2Cell = document.createElement("td");
      team2Cell.innerHTML = team2 ? team2[key] : "";
      row.appendChild(team2Cell);
      table.appendChild(row);
    }
    i++;}
  document.getElementById("teams_table").appendChild(table);
}


// Clear the form and table when the clear button is clicked
document.addEventListener("DOMContentLoaded", function() {
  const clearFormButton = document.getElementById("clearForm");
  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  clearFormButton.addEventListener("click", function() {
    // Clear form1 selections
    form1.reset();
    // Clear form2 selections
    form2.reset();
    // Clear the table
    let oldTable = document.querySelector("table");
  if (oldTable) {
    oldTable.remove();}
  });
});