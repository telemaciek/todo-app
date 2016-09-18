function loadTodoList() {
  var todoList = {}; // define a variable called todo list
  // console.log('Initiating load...');
  var todoStorage = localStorage.getItem('todoStorage'); // get the list data from local storage
  if (todoStorage != null) { // if it exists
    // console.log('List found in local storage')
    todoList = JSON.parse(todoStorage); // make our variable equal to stored value and json it          
    // console.log('List data from local storage loaded')
  } else { // if it doesn't exist, don't do anything
    document.getElementById('js-add-input').placeholder = "Add your first to–do";
    document.getElementById('js-add-button').addEventListener('click', function() {
      document.getElementById('js-add-input').placeholder = "Add to–do";
    } )
    // console.log('You must be new. List doesnt exist in local storage')
  }

  return todoList;
  // console.log('Finished loading list.')
}

function loadTodoSetting(setting) {
  var todoSettings = {}; // define a variable called todo list
  var todoSettingsStorage = localStorage.getItem('todoSettingsStorage'); // get the list data from local storage

  if (todoSettingsStorage != null) { 
    todoSettings = JSON.parse(todoSettingsStorage);
  } else { 
    todoSettings = {
      doneVisible: true
    }
    localStorage.setItem('todoSettingsStorage', JSON.stringify(todoSettings)); // save it for the first time
  }
  return todoSettings[setting];
}

function saveTodoSetting(setting, value) {
  var todoSettingsStorage = localStorage.getItem('todoSettingsStorage'); 
  var todoSettings = JSON.parse(todoSettingsStorage);
  todoSettings[setting] = value;
  localStorage.setItem('todoSettingsStorage', JSON.stringify(todoSettings));
}






function saveTodoList(todoList) {
  console.log('Saving...')
  localStorage.setItem('todoStorage', JSON.stringify(todoList)); // stringify and save todolist as todostorage
  var saveDate = new Date();
  var saveHour = saveDate.getHours();
  var saveMinute = saveDate.getMinutes();
  var saveSecond = saveDate.getSeconds();
  var saveMessage = "Last saved at " + saveHour + ":" + saveMinute + ":" + saveSecond;
  document.getElementById('js-system-message').innerHTML = saveMessage;
  console.log('Done.')
}




function addTodo() {
  var addInput = document.getElementById('js-add-input');
  var value = addInput.value;
  var todoList = loadTodoList();
  // console.log("Input value: " + value);
  
  id = Date.now()
  // console.log("New item ID: " + id)

  if (value) {
    // console.log('Found something in input, proceeding to add to todoList hash')
    // Save new item with ID and value
    todoList[id] = {
      id: id, 
      value: value,
      status: 1 
      // 1 = to do
      // 2 = done
    }
    // console.log('New item added to todoList with id ' + id)
    saveTodoList(todoList);
    // console.log('Redrawing list...')
    drawTodoList()
    // console.log('Done.')
  } else {
    // console.log('Input empty, fool!')
  }
  // console.log('Here is the todoList hash:')
  // console.log(todoList)

  addInput.value = '';
}





function addListToHTML(todoListHTML, status) {
  var todoList = loadTodoList();
  for (key in todoList) {
    todoItem = todoList[key];
    if (todoItem.status === status) {
      todoListHTML += 
        '<li class="list-item js-item status'
        +   
        todoItem.status 
        +
        '" data-id="' 
        +
        todoItem.id
        +
        '"><span class="js-strike item-strike">✔</span> <span contenteditable="true" class="js-edit item-edit" id="edit-'
        +
        todoItem.id
        +
        '">';
      todoListHTML += todoItem.value;
      todoListHTML += '</span><span class="js-delete item-delete">×</span></li>';
    }
  }
  return todoListHTML;
}

function drawTodoList() {
  // console.log('Drawing list...')
  var todoListHTML = '';

  todoListHTML = addListToHTML(todoListHTML, 1);

  if (loadTodoSetting('doneVisible') === true) {
    console.log('as');
    todoListHTML = addListToHTML(todoListHTML, 2);
  }

  document.getElementById('js-list').innerHTML = todoListHTML;

  bindDeleteButtons();
  bindStrikeButtons();
  bindEditContainers();
  bindAddInput();
  // console.log('Generating list finished.')
}





function bindAddInput() {
  var addButton = document.getElementById('js-add-button');
  var addInput = document.getElementById('js-add-input');
  addButton.addEventListener('click', addTodo); 
  addInput.focus();
  console.log('focused on add input');

  addInput.onkeydown = function(e){
    if (e.keyCode === 40) { // arrow down
      document.querySelector('.js-item:first-child .js-edit').focus();
    } else if (e.keyCode === 38) { // arrow up
      document.querySelector('.js-item:last-child .js-edit').focus();
    }
  }

}






function deleteTodo() {
  var todoList = loadTodoList();
  // Remove from list 
  // console.log('Deleting...')
  var id = this.parentNode.getAttribute('data-id');
  // console.log('ID of element: ' + id)
  // console.log(todoList[id]);
  // Delete this item from html  
  // this.parentNode.remove();
  delete todoList[id];
  // console.log('Deleted')
  // console.log(todoList[id]);
  saveTodoList(todoList);
  drawTodoList();
}
function bindDeleteButtons() {
  var deleteTodoButtons = document.getElementsByClassName('js-delete')
  for (var i=0; i < deleteTodoButtons.length; i++) {
      deleteTodoButtons[i].addEventListener('click', deleteTodo);
  };
}







function strikeTodo(strikeButton) {
  var todoList = loadTodoList();
  console.log('Striking!')
  var id = strikeButton.parentNode.getAttribute('data-id');
  // console.log('Status: ' + todoList[id].status);
  if (todoList[id].status === 1) {
    todoList[id].status = 2;  
  } else {
    todoList[id].status = 1;  
  }
  // console.log('New Status: ' + todoList[id].status);

  saveTodoList(todoList);
  drawTodoList();
}
function bindStrikeButtons() {
  var strikeButtons = document.getElementsByClassName('js-strike')
  for (var i=0; i < strikeButtons.length; i++) {
      console.log('binding');
      strikeButtons[i].addEventListener('click', function(){
        var strikeButton = this;
        strikeTodo(strikeButton)
      });
  };
}







function bindEditContainers() {
  var todoList = loadTodoList();
  
  var editContainers = document.getElementsByClassName('js-edit');

  for (var i=0; i < editContainers.length; i++) {

      editContainers[i].onkeydown = function(e){

        if (e.metaKey) { // when you hold down command...

          if (event.keyCode == 40) { // cmd + arrow down
            console.log('CMD DOWN');
          }

          if (event.keyCode == 38) { // cmd + arrow up
            console.log('CMD UP');
          }

          if (event.keyCode == 8) { // cmd + backspace?
            // console.log('a');
            var thisItem = this;

            var thisItemId = "edit-" + thisItem.parentNode.getAttribute('data-id');
            var nextItem = document.getElementById(thisItemId).parentNode.nextSibling;
            var prevItem = document.getElementById(thisItemId).parentNode.previousSibling;

            strikeTodo(thisItem);

            console.log(nextItem);
            console.log(prevItem);

            if (nextItem != null) {
              document.getElementById("edit-" + nextItem.getAttribute('data-id')).focus();
            }
            
            // nextItem.getAttribute('data-id').focus();
            console.log(thisItemId);


            // var nextItemId = thisItem.parentNode.nextSibling;
            // .querySelector(".js-edit")
            // console.log(nextItemId);
            // var prevItemId = "edit-" + this.parentNode.previousElement.getAttribute('data-id');

            // var focusOnThisBitch = "edit-" + this.parentNode.getAttribute('data-id');
            // document.getElementById(focusOnThisBitch).focus();
            
            // console.log(this);
            // console.log('b');
            return false;
          }

        } else { // if not holding down command and...

          if (e.keyCode === 13) { // enter
            e.preventDefault();

          } else if (e.keyCode === 40) { // arrow down
            // console.log('Arrow is down');
            moveDownList(this, this.parentNode);

          } else if (e.keyCode === 38) { // arrow up
            // console.log('Arrow is up');
            moveUpList(this, this.parentNode);
          } 
        }
      }

      editContainers[i].onkeyup = function(e){
        if (e.keyCode === 13) { // enter
          
          drawTodoList();

        } else { // all other keys
          
          editTodoItem(this, this.parentNode, todoList); // save content to memory 
          saveTodoList(todoList); 

        }
      } 

  };
};

function editTodoItem(editableElement, editableElementParent, todoList) {
  var todoList = todoList;
  // console.log('editing' + editableElement);
  var id = editableElementParent.getAttribute('data-id');
  var value = editableElement.innerHTML;
  todoList[id].value = value;  
  // console.log('editing finished, new: ' + id + value);
};

function moveUpList(editableElement, editableElementParent) {
  // console.log('UP');
  if (editableElementParent != document.getElementById("js-list").firstChild) {
    var previousElement = editableElementParent.previousSibling.querySelector(".js-edit");

    previousElement.focus();
    // console.log('is not first');
  } else {
    // console.log('is first');
    drawTodoList();
  }
};

function moveDownList(editableElement, editableElementParent) {
  // console.log('DOWN');
  if (editableElementParent != document.getElementById("js-list").lastChild) {
    var nextElement = editableElementParent.nextSibling.querySelector(".js-edit");
    nextElement.focus();
    // console.log('is not last');
  } else {
    // console.log('is last');
    drawTodoList();
  }
};


function bindSaveShortcut() {
  document.onkeydown = function(e) {
    if (event.metaKey) { // when you hold down command...
      if (event.keyCode == 83) {
        var todoList = loadTodoList();
        saveTodoList(todoList); // It's probably saved already, but let's make sure. Kinda fake. :)
        console.log('This, for the moment, is just to point you to the actual last save and make you feel kind–of safe.')
        flashSystemMessage();
        return false;
      }
    }
  }
}
bindSaveShortcut();

function flashSystemMessage() {
  var systemMessageContainer = document.getElementById('js-system-message');
  systemMessageContainer.className = "system-message system-message--flash";
  setTimeout(function () {
    systemMessageContainer.className = "system-message";
  }, 1000);
}


document.getElementById('js-toggle-done').addEventListener('click', toggleDone);

function toggleDone() {
  var doneItems = document.getElementsByClassName('status2');

  for (var i=0; i < doneItems.length; i++) {
    // var className = doneItems[i].className;
    doneItems[i].classList.toggle('hide');
  }

  if (loadTodoSetting('doneVisible') === true) {
    console.log('t');
    saveTodoSetting('doneVisible', false);
    // localStorage.setItem('todoSettingsStorage[doneVisible]', 'false');  
  } else {
    console.log('n');
    saveTodoSetting('doneVisible', true);
    drawTodoList();
    // function saveTodoSetting(doneVisible, true);
    // localStorage.setItem('todoSettingsStorage[doneVisible]', 'true');  
  }
}


// loadTodoList(); // retrieve data from local storage
drawTodoList(); // draw list in html







// INFO:
// • Your todo's are saved on your computer, in your browser. They won't be visible in other browsers. They are NOT backed up on the server.
