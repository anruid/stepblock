let gameRender = (function anonymous() {

    // 获取基础DOM
    let mainBox = document.getElementsByClassName('mainBox')[0],
        titleBox = mainBox.getElementsByClassName('titleBox')[0],
        moveBox = mainBox.getElementsByClassName('moveBox')[0];
        
    // 获取每一行色块的整体DOM
    let outerDiv = moveBox.children;

    // 全局变量
    let score = 0, // 记分
        moveFlag = true, // 游戏动画执行标记
        moveSpeed = 0.5; // 游戏运行速度

    // 获取十六进制随机颜色
    let randomColor = function randomColor() {
        let r = Math.round(Math.random() * 255),
            g = Math.round(Math.random() * 255),
            b = Math.round(Math.random() * 255),
            randomRGB = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
        // 由于会生成少于6位的十六进制颜色需要补齐
        if (randomRGB.length != 7) {
            for (let i = 0, len = 7 - randomRGB.length; i < len; i++) {
                randomRGB += '0';
            }
        }
        return randomRGB;
    };

    // 1. 点击开始后生成游戏初始状态
    let gameInit = function gameInit() {
        moveBox.style.top = '-40%';

        // 点击开始后，出现游戏界面
        titleBox.ontouchend = function anonymous() {
            titleBox.style.display = 'none';
            [].forEach.call(outerDiv, (item, index) => {
                item.style.height = '20%'; // 设置每一个大的DIV的行高为20%                
                let innerDiv = item.children,
                    randomNum = Math.round(Math.random() * 3);
                [].forEach.call(innerDiv, (item, index) => {
                    item.style.width = '25%'; // 设置每一个大的DIV里面的4个小DIV宽度为25%
                    if (randomNum == index) {
                        // 对色块进行上色并标记
                        item.style.backgroundColor = randomColor();
                        item.setAttribute('class', 'target');
                    }
                });
            });

            // 2. 游戏开始
            gameStart();
        };
    };

    // 2. 游戏开始
    let gameStart = function gameStart() {
        // 仅仅只能点击第一行才能开始游戏
        moveBox.addEventListener('touchend', function anonymous(ev) {
            let target = ev.target,
                targetParent = target.parentNode;

            // 开始移动判定
            if (targetParent.className == 'clickRow') {
                if (target.className == 'target') {
                    score++; // 计算得分
                    // 选中后的色块颜色
                    target.style.backgroundColor = '#ccc';
                    // 避免色块被点击多次
                    targetParent.setAttribute('class', '');
                    // 这种方法是避免隔行点击色块的情况
                    targetParent.previousElementSibling.setAttribute('class', 'clickRow');
                    // 标志是在游戏结束后置为false，防止游戏结束后还能移动
                    if (moveFlag) {
                        // 3. 开始移动
                        moveStart();
                        moveFlag = false;
                    }
                } else {
                    // 5. 游戏结束
                    gameOver();
                }
            } else {
                // 5. 游戏结束
                gameOver();
            }
        })
    };

    // 3. 开始移动
    let moveStart = function moveStart() {
        // 开启无限循环动画
        moveBox.style.animation = `move-Box ${moveSpeed}s linear infinite`;
        // 每一次的动画结束时创建一个Div
        moveBox.addEventListener("animationiteration", creatDiv);
    };

    // 4. DOM创建、移除
    let creatDiv = function creatDiv() {
        let insertDiv = document.createElement('div');
        for (let i = 0; i < 4; i++) {
            let tempDiv = document.createElement('div');
            insertDiv.appendChild(tempDiv);
        }
        moveBox.insertBefore(insertDiv, outerDiv[0]);
        outerDiv = moveBox.children;
        
        let randomNum = Math.round(Math.random() * 3),
            innerDiv = outerDiv[0].children;
        outerDiv[0].style.height = '20%';
        [].forEach.call(innerDiv, (item, index) => {
            item.style.width = '25%';
            if (randomNum == index) {
                // 对色块进行上色并标记
                item.style.backgroundColor = randomColor();
                item.setAttribute('class', 'target');
            }
        });
        if (outerDiv.length == 8) {
            moveBox.removeChild(outerDiv[outerDiv.length - 1]);
            outerDiv = moveBox.children;
        }
    };
    
    // 5. gameover
    let gameOver = function gameover() {
        moveBox.style.animation = '';
        alert('游戏结果得分为：' + score);

        // 游戏结束移除可点击的入口
        outerDiv = moveBox.children;
        [].forEach.call(outerDiv, item => {
            item.setAttribute('class', '');
        });
    };

    return {
        init: function init() {
            gameInit();
        }
    }
})();

gameRender.init();