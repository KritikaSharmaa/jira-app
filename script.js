const grid = document.querySelector(".grid");
const add = document.querySelector(".add");
const DeleteTicket = document.querySelector(".delete");

if (localStorage.getItem("TicketRecord") == undefined) {
  let initialiseTicket = {};
  initialiseTicket = JSON.stringify(initialiseTicket);
  localStorage.setItem("TicketRecord", initialiseTicket);
}

//Load All ticekts present inside lOCAL STORAGE...by call function listners and pass color id and data
const ApplyFilter = (color) => {
  let AllTaskObjFromLC = JSON.parse(localStorage.getItem("TicketRecord"));
  //remove all tickets then show only filtered ones.
  const AllPtickets = document.querySelectorAll(".grid >div");
  for (let k = 0; k < AllPtickets.length; k++) {
    AllPtickets[k].remove();
  }
  for (let x in AllTaskObjFromLC) {
    //console.log(AllTaskObjFromLC[x]); //x-->key(currid) and (AllTaskObjFromLC[x]-->obj as value of key contains color and task assigned)
    if (color != "black" && AllTaskObjFromLC[x].color != color) continue; //if color is other then black then --> show only those tickets whose color match with selected filter color
    listners(AllTaskObjFromLC[x].color, x, AllTaskObjFromLC[x].TaskAssiged);
  }
};
ApplyFilter("black");

//TICKETS
function listners(ticketColor, currId, taskContent) {
  const ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticketDiv");
  ticketDiv.innerHTML = `<div class="ticketColorLine ${ticketColor}"></div>
  <div class="ticketId">#${currId}</div>
  <div class="ticketContentArea" contenteditable="true" spellcheck="false">${taskContent}</div>`;
  grid.append(ticketDiv);

  //EDIT TICKET
  ticketDiv
    .querySelector(".ticketContentArea")
    .addEventListener("input", (e) => {
      let EditTicketContent = e.currentTarget.innerText;
      let ExtractfromLS = JSON.parse(localStorage.getItem("TicketRecord"));
      ExtractfromLS[currId].TaskAssiged = EditTicketContent;
      localStorage.setItem("TicketRecord", JSON.stringify(ExtractfromLS));
    });

  let AddNewTicketToLS = {
    color: ticketColor,
    TaskAssiged: taskContent,
  };

  let extractLs = JSON.parse(localStorage.getItem("TicketRecord"));
  extractLs[currId] = AddNewTicketToLS;
  localStorage.setItem("TicketRecord", JSON.stringify(extractLs));

  const ticketColorLine = ticketDiv.querySelector(".ticketColorLine");
  let allColors = ["pink", "blue", "green", "black"];

  ticketColorLine.addEventListener("click", (e) => {
    let currColor = e.target.classList[1];
    let idx = -1;
    for (let j = 0; j < allColors.length; j++) {
      if (allColors[j] == currColor) {
        idx = j;
      }
    }
    idx++;
    idx = idx % 4;
    let newColor = allColors[idx];
    ticketColorLine.classList.remove(currColor);
    ticketColorLine.classList.add(newColor);
    let ExtractColorFromLS = JSON.parse(localStorage.getItem("TicketRecord"));
    ExtractColorFromLS[currId].color = newColor;
    localStorage.setItem("TicketRecord", JSON.stringify(ExtractColorFromLS));
  });
  ticketDiv.addEventListener("click", (e) => {
    if (DeleteTicket.classList.contains("deleteSelected")) {
      e.currentTarget.remove();
    }
  });
}

//ADD TICKET
add.addEventListener("click", (e) => {
  let isModalAlreadyPresent = document.querySelector(".modal");
  if (isModalAlreadyPresent) return;

  if (DeleteTicket.classList.contains("deleteSelected")) {
    DeleteTicket.classList.remove("deleteSelected");
  }

  let modal = document.createElement("div");
  modal.classList.add("modal");
  grid.append(modal);
  modal.innerHTML = `
  <div class="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
  </div>
  <div class="priority-section">
    <div class="inner-priority">
        <div class="modal-priority pink"></div>
        <div class="modal-priority blue"></div>
        <div class="modal-priority green "></div>
        <div class="modal-priority black selected"></div>
    </div>
  </div>
  `;
  ticketColor = "black";
  const priorityList = document.querySelectorAll(".modal-priority");
  for (let i = 0; i < priorityList.length; i++) {
    priorityList[i].addEventListener("click", (e) => {
      for (let j = 0; j < priorityList.length; j++)
        priorityList[j].classList.remove("selected");
      e.target.classList.add("selected");
      ticketColor = e.target.classList[1];
    });
  }
  let taskContent = "";
  const taskInnerContainer = document.querySelector(".task-inner-container");
  const modalPriority = document.querySelector(".modal-priority");
  taskInnerContainer.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      taskContent = e.target.innerText;
      let currId = uid();
      modal.remove();
      listners(ticketColor, currId, taskContent);
    } else if (e.key == "Escape") {
      modal.remove();
    }
  });
});

//DELETE TICKET
DeleteTicket.addEventListener("click", () => {
  if (DeleteTicket.classList.contains("deleteSelected")) {
    DeleteTicket.classList.remove("deleteSelected");
  } else {
    DeleteTicket.classList.add("deleteSelected");
  }
});

//FILTER
const selectFilter = document.querySelectorAll(".filter>div");
for (let f = 0; f < selectFilter.length; f++) {
  selectFilter[f].addEventListener("click", (e) => {
    for (let s = 0; s < selectFilter.length; s++)
      selectFilter[s].classList.remove("selected");
    e.target.classList.add("selected");
    ApplyFilter(e.target.classList[0]);
  });
}
