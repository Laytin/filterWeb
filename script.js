const outputField = document.getElementById('outputField');
const map1 = new Map();
const dataPromise = fetchDict();
let quantStr = "";
let sizeStr = "";

function fetchDict(){
    return fetch('dictionary_ru.json')
    .then(response => response.json())
    .then(data => {
        Object.entries(data).forEach(([key, value]) => {
            map1.set(key, value);
        });
    })
    .catch(error => console.error('Ошибка при загрузке JSON:', error));
}

function createCheckboxes() {
    let checkboxContainer = document.getElementById('firstCol');

    for (const [key, value] of map1) {
        const customCheckbox = createCustomCheckbox(`${key}`);
        checkboxContainer.appendChild(customCheckbox);
    }
    checkboxContainer = document.getElementById('secondCol');
    for (const [key, value] of map1) {
        const customCheckbox = createCustomCheckbox(`${key}`);
        checkboxContainer.appendChild(customCheckbox);
    }
}
function createCustomCheckbox(labelText) {
    // Создаем элемент label
    let label = document.createElement('label');
    label.className = 'container';
    label.textContent = labelText;

    // Создаем элемент input типа checkbox
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = map1.get(labelText);

    // Создаем элемент span для кастомного чекбокса
    let checkmark = document.createElement('span');
    checkmark.className = 'checkmark';

    // Вставляем checkbox и checkmark в label
    label.appendChild(checkbox);
    label.appendChild(checkmark);

    checkbox.onchange = () => updateOutput();
    return label;
}
var inputTextField1 = document.getElementById('quant')
var inputTextField2 = document.getElementById('packsize')
var inputTextField3 = document.getElementById('symb')

inputTextField1.oninput = updateQuantAndSizeStr1;
inputTextField2.oninput = updateQuantAndSizeStr2;


function updateQuantAndSizeStr1(){
    quantStr ="";
    if(inputTextField1.value!="" && inputTextField1.value>0){
        //console.log(toRegexRange(inputTextField1.value, 99999, {capture: true}))
    }
    updateOutput();
}
function updateQuantAndSizeStr2(){
    sizeStr ="";
    if(inputTextField2.value!="" && inputTextField2.value>0){
        //console.log(toRegexRange(inputTextField2.value, 99999, { capture: true }))
    }
    updateOutput();
}
function updateOutput() {
    //Bad chechboxes
    let finalStr = "";
    let badStr = filterCheckedAndGetFormattedString("firstCol");
    let goodStr = filterCheckedAndGetFormattedString("secondCol");
    if(badStr.length!=0){
        finalStr += " \"!"+badStr+"\"";
    }
    if(goodStr.length!=0){
        if(finalStr.length!=0)
            finalStr+=" ";
        finalStr += " \""+goodStr+"\"";
    }
    if(quantStr.length!=0)
        finalStr = quantStr + " " + finalStr;
    if(sizeStr.length!=0)
        finalStr = sizeStr + " " + finalStr;
    if(finalStr.length!=0){
        outputField.style.color= "#ffffff";
        outputField.textContent =finalStr;
    }else{
        outputField.style.color= "#838383";
        outputField.textContent = "Выберите хотя бы один из модов...";
    }
    inputTextField3.textContent = "Символов: " + finalStr.length + "/50"
}
function filterCheckedAndGetFormattedString(containerId){
    let finalStr = "";
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
            
    checkedCheckboxes.forEach(checkbox => finalStr+= `${checkbox.id}|`);
    return finalStr.substring(0,finalStr.length-1);
}
window.addEventListener('DOMContentLoaded', () => {
    dataPromise.then(() => {
        createCheckboxes();
    });
});
