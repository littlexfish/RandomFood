
let text
let dialog
let foods

const SLOW_DOWN_MAX_FRAME = 50;
let selectedFood = null;
let slowDownFood = null;
let slowDownFrame = 0;
let frame = 0;

function main() {
    text = document.getElementById('text');
    dialog = document.getElementById('dialog');
    foods = getFoodsFromParam();
    function select() {
        if(selectedFood === null) {
            selectedFood = foods[Math.floor(Math.random() * foods.length)];
        }
        else {
            selectedFood = null;
            foods = getFoodsFromParam();
        }
        slowDownFrame = SLOW_DOWN_MAX_FRAME;
        text.classList.remove('confirm');
    }
    let out_text = document.getElementById('out-text');
    out_text.onclick = select;
    document.onkeydown = evt => {
        if(dialog.open) return;
        if(evt.key === ' ') {
            select();
        }
        else if(evt.key === 'Enter') {
            cleanDialog();
            dialog.showModal();
        }
    }
    dialog.onclose = () => {
        foods = getFoodsFromInput();
    }
    for(const f of foods) {
        addInput(f);
    }
    requestAnimationFrame(tick);
}

function cleanDialog() {
    let needRemove = [];
    let chi = document.getElementById('item-list').childNodes;
    for(const c of chi) {
        let val = c.children[0].value;
        if(!val) {
            needRemove.push(c);
        }
    }
    for(const r of needRemove) {
        document.getElementById('item-list').removeChild(r);
    }
    addInput('');
}

function tick() {
    beforeFrame();
    let showFood
    if(selectedFood == null) {
        showFood = foods[Math.floor(Math.random() * foods.length)];
    }
    else if(slowDownFrame > 0) {
        if(SLOW_DOWN_MAX_FRAME === slowDownFrame || frame % (SLOW_DOWN_MAX_FRAME - slowDownFrame) === 0) {
            slowDownFood = foods[Math.floor(Math.random() * foods.length)];
            slowDownFrame -= 5;
        }
        showFood = slowDownFood;
    }
    else {
        showFood = selectedFood;
        text.classList.add('confirm');
    }
    if(text.innerText !== showFood) text.innerText = showFood;
    nextFrame();
}

function beforeFrame() {
    frame++;
}

function nextFrame() {
    requestAnimationFrame(tick);
}

function getFoodsFromParam() {
    let param = new URLSearchParams(location.search);
    let foods = param.get('food');
    return foods.split(';')
}

function getFoodsFromInput() {
    let inputs = document.getElementById('item-list');
    let foods = [];
    for(const i of inputs.children) {
        foods.push(i.children[0].value);
    }
    return foods.filter(v => v);
}

function addInput(content) {
    let div = document.createElement('div');
    let input = document.createElement('input');
    input.value = content;
    input.placeholder = 'Enter food name';
    input.onkeydown = evt => onInput(evt);
    div.appendChild(input);
    document.getElementById('item-list').appendChild(div);
    input.focus();
}

function onInput(evt) {
    if(evt.key === ';') evt.preventDefault();
    // foods = getFoodsFromInput();
}

function onSave() {
    let param = new URLSearchParams(location.search);
    param.set('food', getFoodsFromInput().join(';'));
    location.search = param.toString();
}
