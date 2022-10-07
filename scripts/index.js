// 创建所需的常量
const waitDiv = document.querySelector('.wait');
const enterDiv = document.querySelector('.enter');
const rememberDiv = document.querySelector('.remember');
const forgetDiv = document.querySelector('.forget');
const form = document.querySelector('form');
const nameInput = document.querySelector('#entername');
const submitBtn = document.querySelector('#submitname');
const forgetBtn = document.querySelector('#forgetname');

const h1 = document.querySelector('h1');
const personalGreeting = document.querySelector('.personal-greeting');

// 当按钮按下时阻止表单提交，这不是我们想要的行为
form.addEventListener('submit', function(e) {
    e.preventDefault();
});

// 当“提交”按钮被点击时，运行函数
submitBtn.addEventListener('click', function() {
    // 在网络存储中存储输入的名称
    localStorage.setItem('name', nameInput.value);
    // 运行nameDisplayCheck()来整理显示个性化的问候语并更新表单显示
    nameDisplayCheck();
});

// 当“遗忘”按钮被点击时，运行函数
forgetBtn.addEventListener('click', function() {
    // 从网络存储中删除存储的名称
    localStorage.removeItem('name');
    // 运行nameDisplayCheck()来解决显示通用问候语的问题。再次显示通用问候语并更新表单显示
    nameDisplayCheck();
});

// 定义nameDisplayCheck()函数
function nameDisplayCheck() {
    // 检查“姓名”数据项是否存储在网络存储中
    if(localStorage.getItem('name')) {
        // 如果是，显示个性化的问候语
        let name = localStorage.getItem('name');
        h1.textContent = '🌐欢迎，' + name;
        personalGreeting.textContent = '欢迎访问我的网站，' + name + '! 希望你在这里玩得开心。';
        // 隐藏表格的“记住”部分，显示“忘记”部分。
        forgetDiv.style.display = 'block';
        rememberDiv.style.display = 'none';
        enterDiv.style.display = 'block';
        waitDiv.style.display = 'none';
    } else {
        // 如果没有，则显示通用问候语
        h1.textContent = '🌐欢迎访问我的网站';
        personalGreeting.textContent = '欢迎访问我的网站。希望你在这里玩得开心。';
        // 隐藏表格的“忘记”部分，显示“记住”部分。
        forgetDiv.style.display = 'none';
        rememberDiv.style.display = 'block';
        enterDiv.style.display = 'none';
        waitDiv.style.display = 'block';
    }
}

document.body.onload = nameDisplayCheck;