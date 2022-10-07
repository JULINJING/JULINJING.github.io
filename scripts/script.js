//获取当前位置并显示OSM地图链接
function geoFindMe() {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    mapLink.href = '';
    mapLink.textContent = '';

    function success(position) {//成功
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = '';
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `纬度：${latitude} °，经度：${longitude} °`;
    }

    function error() {//失败 权限等原因
    status.textContent = '无法获取你的位置';
    }

    if (!navigator.geolocation) {
    status.textContent = '你的浏览器不支持地理位置';
    } else {
    status.textContent = '定位中……';
    navigator.geolocation.getCurrentPosition(success, error);//回调
    }
}

document.querySelector('#find-me').addEventListener('click', geoFindMe);//点击事件

//更改主题
var select = document.querySelector('select');//选择文档中第一个符合条件目标
var html = document.querySelector('html');
var label=document.querySelector('label');

function update(bgColor,textLabelColor,textSelectColor,bColor,labelText) {//更新内容
    html.style.backgroundColor = bgColor;
    label.style.color = textLabelColor;
    select.style.color = textSelectColor;
    select.style.backgroundColor = bColor;
    label.textContent = labelText;
};

select.onchange = function() {//改变事件
    ( select.value === 'grey' ) ? update('#395260','white','white',"#395260","🌃主题：") : update('white','black','black','white',"🌇主题：");//三元运算符
};

//搜索框百度搜索
var oInp = document.getElementById('inp');
var oBtn = document.getElementById('btn');
	
oBtn.onclick = function () {//点击事件
    Search();
}

document.onkeydown = function () {//键盘事件
    if (event.keyCode == 13) {
        Search();
    }
}

function Search() {//调用百度搜索
    var url = 'https://www.baidu.com/s?wd=' + oInp.value;
    window.open(url);
}

//简易时钟
window.onload = function(){
    setInterval(NowTime,1000);//每隔1s
    NowTime();//初始1s出现
    function NowTime(){
        var clock = document.getElementById('clock');
        var a = new Date();
        var b = a.getHours();
        var c = a.getMinutes();
        var d = a.getSeconds();
        clock.innerHTML ="当前时间："+check(b)+":"+check(c)+":"+check(d);
    };
    
    function check(val){//纠正格式
        if(val < 10){
        return("0" + val)
        }else{
        return(val)
        }
    }
}

//快速到顶 JQuery实现
$(function(){
    $(window).scroll(function(){  //只要窗口滚动,就触发下面代码
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop; //获取滚动后的高度
    
        if( scrollt >800 ){  //判断滚动后高度超过800px,就显示
            $("#back_top").fadeIn(400); //淡入
        }else{
            $("#back_top").stop().fadeOut(400); //如果返回或者没有超过,就淡出.必须加上stop()停止之前动画,否则会出现闪动
        }
    });
    
    $("#back_top").click(function(){ //当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部
        $("html").animate({scrollTop:"0px"},200);
    }); 
});