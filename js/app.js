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

//global variables
let LIST;
let id;

// get list from local storage
let data = localStorage.getItem("TODO");

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
    addToDo(item.name, item.id, item.done, item.trash);
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
                <li class="item">
                  <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                  <p class="text ${TEXT_FORMAT}">${toDo}</p>
                  <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
               `;
  list.insertAdjacentHTML(position, item);
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
  element.parentNode.parentNode.removeChild(element.parentNode);

  LIST[element.id].trash = true;
  localStorage.setItem("TODO", JSON.stringify(LIST));
}

//listener for ToDo complete and delete
list.addEventListener("click", function(event){
  const element = event.target; //return the clicked element inside the list
  const elementJob = element.attributes.job.value; // complete or delete

  if(elementJob == "complete"){
    completeToDo(element);
  }else if(elementJob == "delete"){
    removeToDo(element);
  }
});

//add an item to the list using the enter key
document.addEventListener("keyup",function(event){
    if(event.keyCode == 13){
      const toDo = input.value;

      //if not an empty string
      if(toDo){
        addToDo(toDo, id, false, false);

        LIST.push({
            name : toDo,
            id : id,
            done : false,
            trash : false
        });
        localStorage.setItem("TODO", JSON.stringify(LIST));

        id = id + 1;
      }
      input.value = "";

      //deselect the input field
      input.blur();
    }
});

//adding an item by clicking the plus button
add.addEventListener("click", function(){
  const toDo = input.value;
  //if not an empty string
  if(toDo){
    addToDo(toDo, id, false, false);

    LIST.push({
        name : toDo,
        id : id,
        done : false,
        trash : false
    });
    localStorage.setItem("TODO", JSON.stringify(LIST));

    id = id + 1;
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
