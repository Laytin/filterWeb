const outputField = document.getElementById('outputField');
const map1 = new Map();
const dataPromise = fetchDict();
let quantStr = "";
let sizeStr = "";
let ineedthismodstype="any";
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
function setRadioState(src){
    ineedthismodstype=src.value;
    updateOutput();
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
    let finalStr = filterCheckedAndGetFormattedStringBad("firstCol");
    let goodStr = filterCheckedAndGetFormattedStringGood("secondCol");
    finalStr = goodStr.length=="" ? finalStr : finalStr +" "+goodStr;

    finalStr = quantStr.length==0 ? finalStr : quantStr + " " + finalStr;
    finalStr = sizeStr.length==0 ? finalStr : sizeStr + " " + finalStr;
    if(finalStr.length!=0){
        outputField.style.color= "#ffffff";
        outputField.textContent =finalStr.substring(0,75);
    }else{
        outputField.style.color= "#838383";
        outputField.textContent = "Выберите хотя бы один из модов...";
    }
    inputTextField3.textContent = "Символов: " + finalStr.length + "/50"
    inputTextField3.style.color = finalStr.length>50 ? "red" : "white";
}
function filterCheckedAndGetFormattedStringBad(containerId){
    let finalStr = "";
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    if(checkedCheckboxes.length==0)
        return "";
    checkedCheckboxes.forEach(checkbox => finalStr+= `${checkbox.id}|`);
    return "\"!" + finalStr.substring(0,finalStr.length-1)+"\"";
}
function filterCheckedAndGetFormattedStringGood(containerId){
    let finalStr = "";
    const container = document.getElementById(containerId);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    if(checkedCheckboxes.length==0)
        return "";
    if(ineedthismodstype =="any"){
        checkedCheckboxes.forEach(checkbox => finalStr+= `${checkbox.id}|`);
        return "\"" +finalStr.substring(0,finalStr.length-1)+"\"";
    }else{
         checkedCheckboxes.forEach(checkbox => {
             finalStr = (`${checkbox.id}`).includes(" ") ? finalStr + `\"${checkbox.id}\" ` : finalStr + `${checkbox.id} `;
         });
        return finalStr.substring(0,finalStr.length-1);
    }
}
window.addEventListener('DOMContentLoaded', () => {
    dataPromise.then(() => {
        createCheckboxes();
    });
});
const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(outputField.textContent);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
const clearAll = async () => {
    const container = document.getElementById("firstCol");
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    Array.from(checkboxes).forEach(checkbox=> checkbox.checked = false);

    const container1 = document.getElementById("secondCol");
    const checkboxes1 = container1.querySelectorAll('input[type="checkbox"]');
    Array.from(checkboxes1).forEach(checkbox=> checkbox.checked = false);
    updateOutput();
  }
