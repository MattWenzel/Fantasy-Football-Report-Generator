// function to handle submit button click and display the report
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  data = get_input();
  if (!validateYears(data.startYear, data.endYear) || !validateWeeks(data.startWeek, data.endWeek) || !validatePositions()) {
    return;
  }
  send_data(data)
  .then(jsonData => {
    create_table(jsonData);
  })
  .catch(error => {
    console.error(error);
  });
});

// function to save the report to the database
document.getElementById("saveReport").addEventListener("click", function () {
  data = get_input();
  if (!validateYears(data.startYear, data.endYear) || !validateWeeks(data.startWeek, data.endWeek) || !validatePositions()) {
    return;
  }
    // Show an input dialog to get the report name
    const reportName = prompt("Please enter a name for the report:");
    // Check if the user entered a report name
    if (reportName === null || reportName.trim() === "") {
      alert("Report name is required.");
      return;
    }
    // Pass the report name to the save_report function
    data.reportName = reportName;
  save_report(data)
    .then(() => {
      alert("Report saved successfully");
    })
    .catch(error => {
      console.error(error);
    });
});

// function get the input data from the form
function get_input() {
  var positions = document.querySelectorAll('input[name="position"]:checked');
  var data = {
    startYear: document.getElementById("startYear").value,
    endYear: document.getElementById("endYear").value,
    startWeek: document.getElementById("startWeek").value,
    endWeek: document.getElementById("endWeek").value,
    positions: Array.from(positions).map(position => position.value),
    scoringType: document.querySelector('input[name="scoringType"]:checked').value,
    minGames: document.getElementById("minGamesPlayed").value,
    maxPlayers: document.getElementById("maxPlayers").value,
    team: document.getElementById("team").value
  };
  return data;
}

function validateYears(startYear, endYear) {
  if (!startYear || startYear === "Select a year") {
    alert("Please select a start year.");
    return false;
  } else if (!endYear || endYear === "Select a year") {
    alert("Please select an end year.");
    return false;
  } else if (parseInt(startYear) > parseInt(endYear)) {
    alert("end year cannot come before start year.");
    return false;
  } else return true;
};

function validateWeeks(startWeek, endWeek) {
  if (!startWeek || startWeek === "Select a week") {
    alert("Please select a start week.");
    return false;
  } else if (!endWeek || endWeek === "Select a week") {
    alert("Please select an end week.");
    return false;
  } else if (parseInt(startWeek) > parseInt(endWeek)) {
    alert("end week cannot come before start week.");
    return false;
  } else return true;
};


function validatePositions() {
  const positions = document.querySelectorAll("input[name='position']");
  let checked = false;
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].checked) {
      checked = true;
      break;
    }
  }
  if (!checked) {
    alert("Please select at least one player position.");
    return false;
  } else return true;
};


// Function to send form data and return report data
async function send_data(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/create_report`, {
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


// Function to save rerpot
async function save_report(data) {
  try {
    await fetch(`${API_BASE_URL}/save_report`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error(error);
  }
}

// clear the form and any tables
document.addEventListener("DOMContentLoaded", function () {
  const clearFormButton = document.getElementById("clearForm");
  const form = document.getElementById("form");
  clearFormButton.addEventListener("click", function () {
    // Clear form1 selections
    form.reset();
    let oldTable = document.querySelector("table");
    if (oldTable) {
      oldTable.remove();
    }
  });
});