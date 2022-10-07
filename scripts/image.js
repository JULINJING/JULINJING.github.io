const displayedImage = document.querySelector('.displayed-img');
const thumbBar = document.querySelector('.thumb-bar');

const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

/*声明图像文件名数组*/
const images = ['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg', 'pic5.jpg'];

/*声明图像文件替代文本数组*/
const alts = {
    'pic1.jpg' : '图片1',
    'pic2.jpg' : '图片2',
    'pic3.jpg' : '图片3',
    'pic4.jpg' : '图片4',
    'pic5.jpg' : '图片5'
}

/*迭代照片*/
for (const image of images) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', `images/image/${image}`);
    newImage.setAttribute('alt', alts[image]);
    thumbBar.appendChild(newImage);

    newImage.addEventListener('click', e => {
    displayedImage.src = e.target.src;
    displayedImage.alt = e.target.alt;
    });
}

/*明暗按钮*/
btn.addEventListener('click', () => {
    const btnClass = btn.getAttribute('class');
    if (btnClass === 'dark') {
    btn.setAttribute('class','light');
    btn.textContent = '变亮';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    } else {
    btn.setAttribute('class','dark');
    btn.textContent = '变暗';
    overlay.style.backgroundColor = 'rgba(0,0,0,0)';
    }
});