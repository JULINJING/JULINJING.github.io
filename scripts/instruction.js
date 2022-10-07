document.addEventListener("DOMContentLoaded", function() {/*事件监听器 HTML 文档体加载、解释完毕事件。事件触发时将调用代码*/
    var tabs = document.querySelectorAll('.infobox li a');
    var panels = document.querySelectorAll('.infobox article');

    for(i = 0; i < tabs.length; i++) {
    var tab = tabs[i];
    setTabHandler(tab, i);
    }

    function setTabHandler(tab, tabPos) {
    tab.onclick = function() {
        for(i = 0; i < tabs.length; i++) {
            tabs[i].className = '';
        }

        tab.className = 'active';

        for(i = 0; i < panels.length; i++) {
            panels[i].className = '';
        }

        panels[tabPos].className = 'active-panel';
        }
    }
})