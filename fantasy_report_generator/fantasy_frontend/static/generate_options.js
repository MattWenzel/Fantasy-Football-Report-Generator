function generateOptions(start, end, id) {
    let select = document.getElementById(id);
    for (let i = start; i <= end; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      
      select.appendChild(option);

      if (id === 'maxPlayers' && i === 50) {
        option.selected = true;
      }
    }
  }
  function generateTeams(id) {
    const teams = ['ALL', 'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAC', 'KC', 'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'Multi', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS']
    let select = document.getElementById(id);
    for (let i = 0; i < teams.length; i++) {
        const option = document.createElement("option");
        option.value = teams[i];
        option.text = teams[i];
        select.add(option);
      }
    }

    function loadOptions(){
      generateOptions(2002, 2022, "startYear");
      generateOptions(2002, 2022, "endYear");
      generateOptions(1, 18, "startWeek");
      generateOptions(1, 18, "endWeek");
      generateOptions(1, 18, 'minGamesPlayed');
      generateOptions(1, 250, 'maxPlayers');
      generateTeams('team');
    };


// Function to convert JSON data to HTML table
function create_table(jsonData) {
  // Remove the old table if it exists
  let oldTable = document.querySelector("table");
  if (oldTable) {
    oldTable.remove();
  }
  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  // Add the header row
  Object.keys(jsonData[0]).forEach(header => {
    let headerCell = document.createElement("th");
    headerCell.textContent = header;
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);
  // Add the data rows
  jsonData.forEach(data => {
    let dataRow = document.createElement("tr");
    Object.values(data).forEach(cell => {
      let dataCell = document.createElement("td");
      dataCell.textContent = cell;
      dataRow.appendChild(dataCell);
    });
    table.appendChild(dataRow);
  });
  document.getElementById("report_table").appendChild(table);
}



