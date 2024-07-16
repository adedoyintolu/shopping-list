//Variables
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');


//Functons

const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach(item => addItemToDOM(item))
  checkUI();

}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}


const addItemToDOM = (item) => {
    //Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  //Create Button
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

const createButton = (classes) => {
  const button =document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

const createIcon = (classes) => {
  const icon =  document.createElement('i');
  icon.className = classes
  return icon;
}

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  //Add new items 
  itemsFromStorage.push(item);

  //convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if(localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  }else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage
}


const onClickItem = (e) => {
    if(e.target.parentElement.classList.contains('remove-item')){
      removeItem(e.target.parentElement.parentElement)
    }else {
      setItemToEdit(e.target);
    }
}

const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

const setItemToEdit = (item) => {
  
  isEditMode = true;

  itemList.querySelectorAll('li').forEach((i)=> i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}


//Remove Individual Items Function

const removeItem = (item) => {
  if(confirm('Are you sure?')){
    //Remove item from DOM
    item.remove();

    //Remove Item From storage
    removeItemFromStorage(item.textContent)

    checkUI();
  }
}


const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  //filter item to be removed

  itemsFromStorage = itemsFromStorage.filter((i)=> i !== item);

  //Re-set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage))

}

//Clear All Items Function

const clearItems = (e) => {
  e.preventDefault();
  while(itemList.firstChild){
    itemList.removeChild(itemList.firstChild);
  }

  //clear from localStorage

  localStorage.removeItem('items');

  checkUI();
}


const checkUI = () => {
  const items = itemList.querySelectorAll('li');

  if(items.length === 0) {
    clearButton.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    filter.style.display = 'block';
  }
}

const filterItems = (e) => {
  const text = e.target.value.toLowerCase();

  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase()

    if(itemName.indexOf(text) != -1){
      item.style.display = 'flex'
    }else{
      item.style.display = 'none'
    }
  })
}


//Initialize App

const init = () => {

  //Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearButton.addEventListener('click', clearItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  itemFilter.addEventListener('input', filterItems)

  checkUI();

}

init();