/*
 * @Author: D-lyw 
 * @Date: 2019-04-14 18:49:31 
 * @Last Modified by: D-lyw
 * @Last Modified time: 2019-04-14 23:19:37
 */

// 辅助函数
function get(node){
    return document.getElementById(node);
}


// 初始化某一局游戏
function setGame(data){
    var contain = get("container");
    contain.innerHTML = '';
    contain.style.width = 40*data.width + "px";
    contain.style.height = 40*data.height + "px";
    
    // 为每个小格子添加相应的类
    for(var i =0; i < data.height; i++){
        for(var j = 0; j < data.width; j++){
            var node = document.createElement('div');
            node.id = i + '_' + j;
            switch(data.map[i][j]){
                case 0: node.className = "padding";break;
                case 1: node.className = "person"; break;
                case 4: node.className = "wall"; break;
                case 6: node.className = "way"; break;
                case 8: node.className = "box"; break;
                case 9: node.className = "target"; node.staticClass = 'target';break;
            }
            contain.appendChild(node);
        }
    }
    // 监听键盘操作
    listenKeyDowm(data);
}




// 通过键盘控制移动, 监听键盘操作, 做出响应
function listenKeyDowm(data){
    document.onkeydown = function(event){
        var curPoint = document.getElementsByClassName('person')[0].id.split('_');
        var x = curPoint[1];
        var y = curPoint[0];
        
        var rows = data.height;
        var cols = data.width;

        var moveTo = null;
        switch(event.keyCode){
            case 37:    // 向左移动
                moveTo = "left";
                x--;
                var nextName = get(y + '_' + x).className;
                if(x< 0 || nextName == 'wall'){
                    return;
                } else if(nextName == 'box' || nextName == 'boxok'){
                    x--;
                    if(x < 0 || get(y + '_' + x).className == 'wall' || get(y + '_' +x).className == 'boxok' ){
                        return ;
                    }
                    x++;
                }
                break;
            case 38:    // 向上移动
                moveTo = "up";
                y--;
                var nextName = get(y + '_' + x).className;
                if(y < 0 || nextName == "wall"){
                    return;
                }else if(nextName == 'box' || nextName == 'boxok'){
                    y--;
                    if(y < 0 || get(y + '_' + x).className == 'wall' || get(y + '_' +x).className == 'boxok'){
                        return;
                    }
                    y++;
                }
                break;
            case 39:    // 向右移动
                moveTo = "right";
                x++;
                var nextName = get(y + '_' + x).className;
                if(x >= cols || nextName == 'wall'){
                    return;
                } else if(nextName == 'box' || nextName == 'boxok'){
                    x++;
                    if(x >=cols || get(y + '_' + x).className == 'wall' || get(y + '_' +x).className == 'boxok' ){
                        return ;
                    }
                    x--;
                }
                
                break;
            case 40:    // 向下移动
                moveTo = "down";
                y++;
                var nextName = get(y + '_' + x).className;
                if(y >=rows || nextName == "wall"){
                    return;
                }else if(nextName == 'box' || nextName == 'boxok'){
                    y++;
                    if(y >= rows || get(y + '_' + x).className == 'wall' || get(y + '_' +x).className == 'boxok'){
                        return;
                    }
                    y--;
                }
                break;
            default:
                break;
            
        }
        doMoveNext(curPoint, x, y, moveTo);
    }
}

// 执行具体一步操作, 两个格子的class类的转换
function doMoveNext(cur, x, y, driection){
    var curNode = get(cur.join('_'));
    var nexNode = get(y + '_' + x);
    if(curNode.staticClass == 'target'){
        curNode.className = 'target'
    } else {
        curNode.className = 'way';
    }

    if(nexNode.className == 'way' || nexNode.className == 'target'){
        nexNode.className = 'person'
    }else {
        get(y + '_' + x).className = 'person';
        switch(driection){
            case 'up': y--; break;
            case 'right': x++; break;
            case 'down': y++; break;
            case 'left': x--; break;
        }
        if(get(y + '_' + x).className == 'way'){
            get(y + '_' + x).className = 'box';
        }else{
            get(y + '_' + x).className = 'boxok';
        }
    }

    // 判断是否通关
    setTimeout(function(){
        if(!document.getElementsByClassName('box')[0]){
            if(selectNode.value == 6){
                alert("恭喜通关!");
            }else {
                selectNode.value += 1;
                setGame(levelMsg[selectNode.value ]);
            }
        } 
    }, 500);
   
}


var selectNode = document.getElementById('chooseLevel');
    for(var i = 0; i < levelMsg.length; i++){
        var node = document.createElement('option');
        node.value = i + 1;
        node.innerText = "第" + (i+1) +"关";
        selectNode.appendChild(node);
    }
    // 监听 选择关卡
    selectNode.onchange = function(e){
        setGame(levelMsg[parseInt(this.value) - 1]);
        this.blur();
    }
    // 刷新重玩
    get("replay").onclick = function(e){
        setGame(levelMsg[parseInt(selectNode.value) -1]);
    }
    setGame(levelMsg[0]);