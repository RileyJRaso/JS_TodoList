//selecting the elements that are permanent
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("item");
const add = document.getElementById("add");

//CSS Class variables
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";
const Expanded = "fa-arrow-up";
const Collapsed = "fa-arrow-down";

//global variables
let LIST;
let id;

// get list from local storage
let data = localStorage.getItem("TODO");

// if data exists inside the localStorage
if(data){
  LIST = JSON.parse(data);
  id = LIST.length;
  loadList(LIST);
}else{
  LIST = [];
  id = 0;
}

// add item to local storage
//localStorage.setItem("TODO", JSON.stringify(LIST));

//showing todays date
const today = new Date();
const Format_Date = {weekday: "long", month: "long", day: "numeric"};

dateElement.innerHTML = today.toLocaleDateString("en-US", Format_Date);

//loading a saved List into the interface
function loadList(array){
  array.forEach(function(item){
    if(item.Subitem){
      addSubToDo(item.name, item.id, item.done, item.trash, item.parentTaskID);
    }else{
      addToDo(item.name, item.id, item.done, item.trash);
    }
  });
}

//add todo function
function addToDo(toDo, id, done, trash){

  const position = "beforeend";
  if(trash){
    return;
  }
  const DONE = done ? CHECK : UNCHECK;
  const TEXT_FORMAT = done ? LINE_THROUGH : "";
  const item = `
                <li class="item" job="selectTask">
                  <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                  <p class="text ${TEXT_FORMAT}">${toDo}</p>
                  <i class="fa fa-arrow-down ar" job="expand/Collapse" aria-hidden="true" id="${id}"></i>
                  <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  <ul id="sublist" style="display: none;"></ul>
                </li>
               `;
  list.insertAdjacentHTML(position, item);
}

function addSubToDo(toDo, id, done, trash, parentTaskId){
  if(trash){
    return;
  }

  const position = "beforeend";
  const parentTask = document.getElementById(parentTaskId).parentNode;
  const parentTaskSubList = parentTask.querySelector("#sublist");

  const DONE = done ? CHECK : UNCHECK;
  const TEXT_FORMAT = done ? LINE_THROUGH : "";
  const item = `
                <li class="Subitem">
                  <i class="fa fa-long-arrow-right sub" aria-hidden="true"></i>
                  <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                  <p class="text ${TEXT_FORMAT}">${toDo}</p>
                  <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
               `;

  parentTaskSubList.insertAdjacentHTML(position, item);
}

//complete a ToDo
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
    localStorage.setItem("TODO", JSON.stringify(LIST));
}

//remove a ToDo
function removeToDo(element){
  if(element.parentNode.classList == "item"){
    SubList = element.parentNode.querySelector("#sublist").getElementsByClassName("Subitem");;
    if(SubList.length != 0){
      for(i=0;i<SubList.length;i++){
        LIST[SubList[i].children[1].id].trash = true;
        localStorage.setItem("TODO", JSON.stringify(LIST));
      }
    }
  }

  element.parentNode.parentNode.removeChild(element.parentNode);
  LIST[element.id].trash = true;
  localStorage.setItem("TODO", JSON.stringify(LIST));
}

//select a task to make sub tasks
function selectTask(element){
  currentBackgroundColor = element.style.backgroundColor;

  if(currentBackgroundColor == "rgb(0, 121, 193)"){
    element.style.backgroundColor = "";
    input.placeholder = "Add an item";
  }else{
    ListofTasks = document.getElementsByClassName("item");
    NumofTasks = ListofTasks.length;

    for(i = 0; i<NumofTasks; i++){
      ListofTasks[i].style.backgroundColor = "";
    }

    element.style.backgroundColor = "#0079C1";
    input.placeholder = "Add a subitem";
  }
}

function findSelectedTask(){
  let SelectedTask = "";
  ListofTasks = document.getElementsByClassName("item");
  NumofTasks = ListofTasks.length;

  for(i = 0; i<NumofTasks; i++){
    if(ListofTasks[i].style.backgroundColor == "rgb(0, 121, 193)"){
      SelectedTask = ListofTasks[i];
    }
  }
  if(SelectedTask){
    return SelectedTask.children[0].id;
  }else{
    return "";
  }

}

function expandCollapse(element){
  element.classList.toggle(Expanded);
  element.classList.toggle(Collapsed);

  if(element.classList.contains(Expanded)){
    element.parentNode.querySelector("#sublist").style.display = "block";
  }else{
    element.parentNode.querySelector("#sublist").style.display = "none";
  }


}

//listener for ToDo complete and delete
list.addEventListener("click", function(event){
  const element = event.target; //return the clicked element inside the list
  const elementJob = element.attributes.job.value; // complete or delete or item

  if(elementJob == "complete"){
    completeToDo(element);
  }else if(elementJob == "delete"){
    removeToDo(element);
  }else if(elementJob == "expand/Collapse"){
    expandCollapse(element);
  }else if(elementJob == "selectTask"){
    selectTask(element);
  }

});

//add an item to the list using the enter key
document.addEventListener("keyup",function(event){
    if(event.keyCode == 13){
      const toDo = input.value;
      const SelectedTaskId = findSelectedTask();


      if(SelectedTaskId){
        //if not an empty string
        if(toDo){
          addSubToDo(toDo, id, false, false, SelectedTaskId);

          LIST.push({
            Subitem : true,
            parentTaskID : SelectedTaskId,
            name : toDo,
            id : id,
            done : false,
            trash : false
          });
          localStorage.setItem("TODO", JSON.stringify(LIST));

          id = id + 1;
        }
      }else{
        //if not an empty string
        if(toDo){
          addToDo(toDo, id, false, false);

          LIST.push({
            Subitem : false,
            parentTaskID : "",
            name : toDo,
            id : id,
            done : false,
            trash : false
          });
          localStorage.setItem("TODO", JSON.stringify(LIST));

          id = id + 1;
        }
      }


      input.value = "";
      //deselect the input field
      input.blur();

    }
});



//adding an item by clicking the plus button
add.addEventListener("click", function(){
  const toDo = input.value;
  const SelectedTaskId = findSelectedTask();

  if(SelectedTaskId){
    //if not an empty string
    if(toDo){
      addSubToDo(toDo, id, false, false, SelectedTaskId);

      LIST.push({
        Subitem : true,
        parentTaskID : SelectedTaskId,
        name : toDo,
        id : id,
        done : false,
        trash : false
      });
      localStorage.setItem("TODO", JSON.stringify(LIST));

      id = id + 1;
    }
  }else{
    //if not an empty string
    if(toDo){
      addToDo(toDo, id, false, false);

      LIST.push({
        Subitem : false,
        parentTaskID : "",
        name : toDo,
        id : id,
        done : false,
        trash : false
      });
      localStorage.setItem("TODO", JSON.stringify(LIST));

      id = id + 1;
    }
  }

  input.value = "";
  //deselect the input field
  input.blur();
});

//clearing the list with the refresh button
clear.addEventListener("click", function(){
  localStorage.clear();
  location.reload();
});
