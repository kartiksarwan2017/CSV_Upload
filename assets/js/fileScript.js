/* This function searches for rows based on the input being typed dynamically */

//remove highlighting
function removeHighlighting(highlightedElements) {
  highlightedElements.each(function () {
    var element = $(this);
    element.replaceWith(element.html());
  });
}

// add highlighting
function addHighlighting(element, textToHighlight) {
  var text = element.text();
  var highlightedText = "<em>" + textToHighlight + "</em>";
  var newText = text.replace(textToHighlight, highlightedText);

  element.html(newText);
}

//getting index value
function getValue() {
  return $("#opt :selected").val();
}

//searching value
$("#search").on("keyup", function () {
  var value = $(this).val();
  var searchval = getValue();
  console.log(searchval);
  $("table tr").each(function (index) {
    if (index != 0) {
      $row = $(this);
      var $tdElement = $row.find(`td:nth-child(${eval(searchval + "+" + 1)}`);
      console.log("val", `${eval(searchval + "+" + 1)}`);
      var id = $tdElement.text();
      var matchedIndex = id.indexOf(value);
      if (matchedIndex < 0) {
        $row.hide();
      } else {
        //highlight matching text, passing element and matched text
        addHighlighting($tdElement, value);
        $row.show();
      }
    }
  });
});



function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");
    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});

/* This function displays the next 100 records starting from a page number */
function displayPage(number) {
  let rows = document.querySelectorAll("table tr"); //selecting the rows
  let tableRows = document.querySelectorAll("table tr").length; //num of rows
  let low = 100 * (number - 1); //lower index
  let high = tableRows <= 100 * number - 1 ? tableRows : 100 * number - 1; //upper index
  for (let i = 0; i <= tableRows; i++) {
    if (rows[i] == undefined) return;
    if ((low <= i && i <= high) || i == 0) {
      //if row is in range we display it
      rows[i].style.display = "";
    } else {
      //hiding the rows not in range
      rows[i].style.display = "none";
    }
  }
}

/* This function calculates the number of pages and adds the buttons */
function pagination() {
  let rows = 100; //num of rwos we want to display
  let tableRows = document.querySelectorAll("table tr").length; //num of rows
  let numPages =
    tableRows % rows == 0 ? tableRows / rows : tableRows / rows + 1; //number of pages
  let pageNumberDiv = document.getElementById("page-numbers"); //page buttons are added here
  for (let i = 1; i <= numPages; i++) {
    //creating the page number buttons
    let btn = document.createElement("div");
    btn.classList.add("page");
    btn.innerText = i;
    pageNumberDiv.appendChild(btn);
  }
}

/* This function adds event listener to the page buttons */
function getPage() {
  let buttons = document.getElementsByClassName("page"); //fetching the buttons
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", displayPage.bind(this, i + 1)); //adding the event listener
  }
}



pagination(); //pagination functionality
getPage(); //adding event listeners to page numbers
window.onload = displayPage(1); //loading the first page on page load

