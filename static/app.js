const Controller = {
  search: (ev) => {
    ev.preventDefault();
    const form = document.getElementById("form");
    const data = Object.fromEntries(new FormData(form));
    fetch(`/search?q=${data.query}`).then((response) => {
      response.json().then((results) => {
        Controller.updateTable(results);
      });
    });
  },

  updateTable: (results) => {
    const table = document.getElementById("table-body");
    table.innerHTML = '';
    for (let title in results) {
      const titleRow = table.insertRow(-1);
      const titleCell = titleRow.insertCell(-1);
      titleCell.classList.add('title-cell');
      titleCell.colSpan = '2';
      addBlankRow(table);
      let lineMatchCount = 0;
      for (let lineNumber in results[title]) {
        for (let contextData of results[title][lineNumber]) {
          const contextRow = table.insertRow(-1);
          const lineNumberCell = contextRow.insertCell(-1);
          lineNumberCell.innerHTML = contextData.lineNumber;
          lineNumberCell.classList.add('line-number-cell');
          const textCell = contextRow.insertCell(-1);
          textCell.innerHTML = contextData.text;
          textCell.classList.add('text-cell');
        }
        lineMatchCount++;
        addBlankRow(table);
      }
      titleCell.innerHTML = `${title} <span class="match-count">(${lineMatchCount} lines matched)</span>`;
      addBlankRow(table);
    }
  },
};

function addBlankRow(table) {
  const blankRow = table.insertRow(-1);
  blankRow.classList.add('blank-row');
}

const form = document.getElementById("form");
form.addEventListener("submit", Controller.search);
