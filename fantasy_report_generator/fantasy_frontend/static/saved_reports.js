const reportsList = document.getElementById("reports-list");
const reportContent = document.getElementById("report-content");


async function fetchData() {
    return fetch(`${API_BASE_URL}/get_reports`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Status code: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
        });
}

function createReportList(data) {
    const reports = data.map(fileName => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.textContent = fileName;
        link.href = "#";
        link.classList.add("report-name");
        link.addEventListener("click", () => {
            fetchReportContent(fileName);
        });
        li.appendChild(link);

        // Create the "Download" button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.classList.add("download-button");
        downloadButton.addEventListener("click", () => {
            downloadReport(fileName);
        });
        

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            if (confirm("This action is permanent. Are you sure you want to delete this report?")) {
                deleteReport(fileName);
            }
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(downloadButton);
        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);

        return li;
    });
    reports.forEach(report => reportsList.appendChild(report));
}




function fetchReportContent(fileName) {
    const data = { report_name: fileName };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`${API_BASE_URL}/read_reports`, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Status code: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            create_table(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function deleteReport(fileName) {
    fetch(API_BASE_URL + `/delete_report?fileName=${encodeURIComponent(fileName)}`,
 {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Status code: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            // remove the deleted report from the list
            while (reportsList.firstChild) {
                reportsList.removeChild(reportsList.firstChild);
            }
            // Then, regenerate the report list
            fetchData().then(data => {
                let oldTable = document.querySelector("table");
                if (oldTable) {
                    oldTable.remove();
                }
                createReportList(data);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

async function downloadReport(fileName) {
    try {
        const response = await fetch(`${API_BASE_URL}/download_reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName }),
        });
        if (response.ok) {
            const data = await response.blob();
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            alert('Download successful!');
        } else {
            alert('Error downloading the report. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching download_reports:', error);
        alert('Error downloading the report. Please try again.');
    }
}

function generateReportsList() {
    fetchData().then(data => {
        createReportList(data);
    });
}

