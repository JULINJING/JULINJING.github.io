let randomNumber = Math.floor(Math.random() * 100) + 1;

//定义变量常量
const guesses = document.querySelector('.guesses');
const lastResult = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');

const guessSubmit = document.querySelector('.guessSubmit');
const guessField = document.querySelector('.guessField');

let guessCount = 1;
let resetButton;
//聚焦输入框
guessField.focus();
//检查输入值
function checkGuess() {
    const userGuess = Number(guessField.value);
    if (guessCount === 1) {
        guesses.textContent = '之前的猜测是：';
    }
    guesses.textContent += `${userGuess} `;

    if (userGuess === randomNumber) {
        lastResult.textContent = '恭喜你!你答对了!';
        lastResult.style.backgroundColor = 'green';
        lowOrHi.textContent = '';
        setGameOver();
    } else if (guessCount === 10) {
        lastResult.textContent = '！！！游戏结束！！！';
        lastResult.style.backgroundColor = 'red';
        lowOrHi.textContent = '';
        setGameOver();
    } else {
        lastResult.textContent = '错误！';
        lastResult.style.backgroundColor = 'red';
        if (userGuess < randomNumber) {
        lowOrHi.textContent = '上一猜测值过低！';
        } else if (userGuess > randomNumber) {
        lowOrHi.textContent = '上一猜测值过高！';
        }
}

guessCount++;
guessField.value = '';
guessField.focus();
}
//事件监听器关联函数
guessSubmit.addEventListener('click', checkGuess);
//游戏结束响应
function setGameOver() {
    guessField.disabled = true;//禁止输入和提交猜测值
    guessSubmit.disabled = true;
    resetButton = document.createElement('button');//重新开始新的游戏按钮
    resetButton.textContent = '开始新游戏';
    document.body.append(resetButton);
    resetButton.addEventListener('click', resetGame);
}

function resetGame() {
    guessCount = 1;

    const resetParas = document.querySelectorAll('.resultParas p');
    for (const resetPara of resetParas) {//循环删除提示行
    resetPara.textContent = '';
    }

    resetButton.parentNode.removeChild(resetButton);//删除重新开始按钮

    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = '';
    guessField.focus();//聚焦输入框

    lastResult.style.backgroundColor = 'white';//统一置白色

    randomNumber = Math.floor(Math.random() * 100) + 1;
}


//随机改变背景色
const btn = document.querySelector('button');

function random(number) {
return Math.floor(Math.random()*(number+1));//随机整数
}

btn.onclick = function() {
const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
document.body.style.backgroundColor = rndCol;
}
