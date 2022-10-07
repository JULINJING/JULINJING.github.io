const btn = document.querySelector('button');
const videoBox = document.querySelector('div');

function displayVideo() {
    if (videoBox.getAttribute('class') === 'hidden') {
    videoBox.setAttribute('class','showing');
    }
}

btn.addEventListener('click', displayVideo);//响应点击按钮

videoBox.addEventListener('click', () => videoBox.setAttribute('class', 'hidden'));//点击视频盒内非视频区域，视频隐藏

const video = document.querySelector('video');

video.addEventListener('click', e => {//点击视频开始播放
    e.stopPropagation();//取消冒泡到div元素上
    video.play();
});