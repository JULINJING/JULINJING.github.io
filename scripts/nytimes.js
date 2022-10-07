// 定义一个baseURL和key作为请求URL的一部分
const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = '4nojFLVJ3kMAtmRzfpk7aGvFBAG0C69D';
let url;

// 抓取所有你需要操作的DOM元素的引用
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');

// 这一点从未被使用过
// const submitBtn = document.querySelector('.submit');

const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');

const section = document.querySelector('section');
const nav = document.querySelector('nav');

// 首先隐藏 "上一页"/"下一页 "导航，因为我们不需要立即使用它。
nav.style.display = 'none';

// 定义正在显示的导航的初始页数和状态
let pageNumber = 0;

// 这一点从未被使用过
// let displayNav = false;

// 事件监听器来控制功能
searchForm.addEventListener('submit', submitSearch);//当表单提交时 (按钮按下时) 运行这个函数 submitSearch()
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function submitSearch(e){
    pageNumber = 0;
    fetchResults(e);
}

function fetchResults(e) {
    // 使用preventDefault()来停止提交表单
    e.preventDefault();

    // 组建完整的URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value + '&fq=document_type:("article")';

    if(startDate.value !== '') {
        url += '&begin_date=' + startDate.value;
    };

    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };

    // 使用fetch()向API发出请求
    fetch(url).then(function(result) {
        return result.json();
    }).then(function(json) {
        displayResults(json);
    });
}

//显示数据
function displayResults(json) {
    while (section.firstChild) {//不断查询 <section> 结点是否有子节点，如果有，就删除。当 <section> 没有子节点时退出循环。
        section.removeChild(section.firstChild);
    }

    const articles = json.response.docs;//来自查询结果，是所有文章对象构成的数组

    if(articles.length === 10) {//该 API 一次最多返回 10 篇文章
        nav.style.display = 'block';//把 <nav> 显示出来
    } else {
        nav.style.display = 'none';
    }

    if(articles.length === 0) {
        const para = document.createElement('p');
        para.textContent = '没有查询结果！'
        section.appendChild(para);
    } else {
    for(let i = 0; i < articles.length; i++) {
        const article = document.createElement('article');
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        const img = document.createElement('img');
        const para1 = document.createElement('p');
        const para2 = document.createElement('p');
        const clearfix = document.createElement('div');

        const current = articles[i];
        console.log(current);

        link.href = current.web_url;
        link.textContent = current.headline.main;
        para1.textContent = current.snippet;
        para2.textContent = '关键词：';
        for(let j = 0; j < current.keywords.length; j++) {
            const span = document.createElement('span');
            span.textContent = current.keywords[j].value + ' ';
            para2.appendChild(span);
        }

        if(current.multimedia.length > 0) {
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
        }

        clearfix.setAttribute('class','clearfix');

        article.appendChild(heading);
        heading.appendChild(link);
        article.appendChild(img);
        article.appendChild(para1);
        article.appendChild(para2);
        article.appendChild(clearfix);
        section.appendChild(article);
    }
    }
};

function nextPage(e) {
    pageNumber++;
    fetchResults(e);
};

function previousPage(e) {
    if(pageNumber > 0) {
    pageNumber--;
    }
    else{
    return;
    }
    fetchResults(e);
};