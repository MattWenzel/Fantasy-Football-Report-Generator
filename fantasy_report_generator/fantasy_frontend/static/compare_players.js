function handleYearSelectChange(playerSelectId) {
  return function () {
    let year = this.value;
    if (year) {
      fetch(`${API_BASE_URL}/players_list?year=${year}`)
        .then(response => response.text())
        .then(players => {
          let playerSelect = document.getElementById(playerSelectId);
          playerSelect.innerHTML = "<option value=''>Select a player</option>";
          let playersArray = players.split(",");
          for (let i = 0; i < playersArray.length; i++) {
            let option = document.createElement("option");
            option.value = playersArray[i];
            option.text = playersArray[i];
            playerSelect.appendChild(option);
          }
        });
    }
  }
}

// function submit the form data and create the table
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();
  var form1 = document.getElementById("form1");
  var form2 = document.getElementById("form2");
  var formData = {
    name1: form1.elements.playerSelect.value,
    year1: form1.elements.yearSelect.value,
    scoringType1: form1.elements.scoringType.value,
    name2: form2.elements.playerSelect2.value,
    year2: form2.elements.yearSelect2.value,
    scoringType2: form2.elements.scoringType.value
  };
  send_data(formData)
    .then(jsonData => {
      create_player_table(jsonData, formData);
      console.log(jsonData)
    })
    .catch(error => {
      console.error(error);
    });
});


// Function to send and receive data
async function send_data(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/player_stats`, {
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

function createHeaderRow(formData) {
  // Create the header row with player names
  var headerRow = document.createElement("tr");
  var propertyHeader = document.createElement("th");
  propertyHeader.innerHTML = "";
  headerRow.appendChild(propertyHeader);
  var player1Header = document.createElement("th");
  player1Header.innerHTML = formData.name1;
  headerRow.appendChild(player1Header);
  var player2Header = document.createElement("th");
  player2Header.innerHTML = formData.name2;
  headerRow.appendChild(player2Header);
  return headerRow;
}

function createYearRow(formData) {
  // Create the year row with player years
  var yearRow = document.createElement("tr");
  var yearHeader = document.createElement("td");
  yearHeader.innerHTML = "Year";
  yearRow.appendChild(yearHeader);
  var player1Year = document.createElement("td");
  player1Year.innerHTML = formData.year1;
  yearRow.appendChild(player1Year);
  var player2Year = document.createElement("td");
  player2Year.innerHTML = formData.year2;
  yearRow.appendChild(player2Year);
  return yearRow;
}

function create_player_table(jsonData, formData) {
  // Remove the old table if it exists
  let oldTable = document.querySelector("table");
  if (oldTable) {
    oldTable.remove();
  }
  // Create the table element
  var table = document.createElement("table");
  table.appendChild(createHeaderRow(formData));
  table.appendChild(createYearRow(formData));
  // Loop through each player in the data
  for (var i = 0; i < jsonData.length; i += 2) {
    var player1 = jsonData[i];
    var player2 = jsonData[i + 1];
    // Loop through each key in the player's data
    var keys = Object.keys(player1);
    for (var j = 1; j < keys.length; j++) {
      var row = document.createElement("tr");
      var keyCell = document.createElement("td");
      keyCell.innerHTML = keys[j];
      row.appendChild(keyCell);
      var player1Cell = document.createElement("td");
      player1Cell.innerHTML = player1[keys[j]];
      row.appendChild(player1Cell);
      var player2Cell = document.createElement("td");
      player2Cell.innerHTML = player2 ? player2[keys[j]] : "";
      row.appendChild(player2Cell);
      table.appendChild(row);
    }
  }
  // Append the table to the HTML document
  document.getElementById("player_table").appendChild(table);
}



document.addEventListener("DOMContentLoaded", function () {
  const clearFormButton = document.getElementById("clearForm");
  const form1 = document.getElementById("form1");
  const form2 = document.getElementById("form2");
  clearFormButton.addEventListener("click", function () {
    // Clear form1 selections
    form1.reset();
    // Clear form2 selections
    form2.reset();
    // Clear the table
    let oldTable = document.querySelector("table");
    if (oldTable) {
      oldTable.remove();
    }
  });
});


document.getElementById("yearSelect").addEventListener("change", handleYearSelectChange("playerSelect"));
document.getElementById("yearSelect2").addEventListener("change", handleYearSelectChange("playerSelect2"));


