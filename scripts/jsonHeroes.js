var header = document.querySelector('header');
var section = document.querySelector('section');

var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';//保存一个即将访问的 URL 作为变量

var request = new XMLHttpRequest();//通过 new 构造函数的形式，创建一个 HTTP 请求对象

request.open('GET', requestURL);//使用 open() 函数打开一个新的请求

request.responseType = 'json';//设定 responseType 为 JSON并发送请求
request.send();

request.onload = function() {//请求的数据 (访问 response 属性) 在变量 superHeroes，当请求对象load事件触发时执行代码，保证事件触发时 request.response 是绝对可以访问的
    var superHeroes = request.response;
    populateHeader(superHeroes);
    showHeroes(superHeroes);
}

function populateHeader(jsonObj) {//数据填充<header>
    var myH1 = document.createElement('h1');
    myH1.textContent = jsonObj['squadName'];
    header.appendChild(myH1);

    var myPara = document.createElement('p');
    myPara.textContent = 'Hometown: ' + jsonObj['homeTown'] + ' // Formed: ' + jsonObj['formed'];
    header.appendChild(myPara);
}

function showHeroes(jsonObj) {//创建一个信息卡片，然后把它插入<section>中
    var heroes = jsonObj['members'];

    for(i = 0; i < heroes.length; i++) {
    var myArticle = document.createElement('article');
    var myH2 = document.createElement('h2');
    var myPara1 = document.createElement('p');
    var myPara2 = document.createElement('p');
    var myPara3 = document.createElement('p');
    var myList = document.createElement('ul');

    myH2.textContent = heroes[i].name;
    myPara1.textContent = 'Secret identity: ' + heroes[i].secretIdentity;
    myPara2.textContent = 'Age: ' + heroes[i].age;
    myPara3.textContent = 'Superpowers:';

    var superPowers = heroes[i].powers;
    for(j = 0; j < superPowers.length; j++) {
        var listItem = document.createElement('li');
        listItem.textContent = superPowers[j];
        myList.appendChild(listItem);
    }

    myArticle.appendChild(myH2);
    myArticle.appendChild(myPara1);
    myArticle.appendChild(myPara2);
    myArticle.appendChild(myPara3);
    myArticle.appendChild(myList);

    section.appendChild(myArticle);
    }
}