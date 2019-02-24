var Game = function() {
    //dom
    var gameDiv
    var nextDiv
    var timeDiv
    var scoreDiv
    var resultDiv
    //分数
    var score = 0

    //div
    var nextDivs = []
    var gameDivs = []
    //game matrix
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    // 当前方块
    var cur
    // 下一方块
    var next

    //初始化div
    var initDiv = function(container, matrix, divs) {
        for(var i = 0; i < matrix.length; i++) {
            var div = []
            for (var j = 0; j < matrix[0].length; j++) {
                var newNode = document.createElement('div')
                newNode.className = 'none'
                newNode.style.top = (i * 20) + 'px'
                newNode.style.left = (j * 20) + 'px'
                container.appendChild(newNode)
                div.push(newNode)
            }
            divs.push(div)
        }
        return divs
    }
    //这里有一个bug，如果旋转位置不发生变化，则divs其实不是一个4*4的矩阵
    //它本身是一个七种方块的图形，这样子会造成根据matrix来循环的话，会造成
    //divs[i][j]有取不到值的状况，为了让它能取到值，并且要把上一轮的图像
    //完全覆盖掉，要么完全清理掉nextdom里面的所有内容，重新插入新内容，
    //但这样子会频繁地操作dom
    //要么把它弄成4*4的标准模型，但这样子旋转就不那么准确,我先改成4*4先
    var refreshDiv = function(matrix, divs) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                if(matrix[i][j] === 0){
                    divs[i][j].className = 'none'
                } else if (matrix[i][j] === 1) {
                    divs[i][j].className = 'done'
                } else if (matrix[i][j] === 2) {
                    divs[i][j].className = 'current'
                }
            }
        }
    }
    // check legal
    var check = function(pos, x, y) {
        if (pos.x + x < 0) {
            return false
        } else if (pos.x + x >= gameData.length) {
            return false
        } else if (pos.y + y < 0) {
            return false
        } else if (pos.y + y >= gameData[0].length) {
            return false
        } else if (gameData[pos.x + x][pos.y + y] == 1){
            return false
        } else {
            return true
        }
    }
    var isValid = function(pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!check(pos, i, j)) {
                        return false
                    }
                }
            }
        }
        return true
    }
    // 清除数据
    var clearData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for(var j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0
                }
            }
        }
    }
    // 设置数据
    var setData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for(var j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
                }
            }
        }
    }
    // 方块移动到底部固定
    var fixed = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for(var j = 0; j < cur.data[0].length; j++) {
                if(check(cur.origin, i, j)) {
                    if(gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }
    // 使用下一个方块
    var performNext = function(s, r) {
        cur = next
        next = new Square(s, r)
        setData()
        refreshDiv(gameData, gameDivs)
        refreshDiv(next.data, nextDivs)
    }
    // 消行
    var checkClear = function() {
        var line = 0
        for (var i = 0; i < gameData.length; i++) {
            let clear = true
            for (var j = 0; j < gameData[i].length; j++){
                if(gameData[i][j] == 0){
                    clear = false
                }
            }
            if(clear) {
                line = line + 1
                gameData.splice(i, 1)
                gameData.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            }
        }
        return line
    }
    //检查游戏是否结束
    var checkGameOver = function() {
        var gameOver = false
        for (var i = 0; i < gameData[0].length; i++) {
            if(gameData[1][i] ==1) {
                gameOver = true
            }
        }
        return gameOver
    }
    // rotate
    var rotate = function() {
        if(cur.canRotate(isValid)) {
            clearData()
            cur.rotate()
            setData()
            refreshDiv(gameData, gameDivs)
        }
    }
    // down
    var down = function(){
        if(cur.canDown(isValid)) {
            clearData()
            cur.down()
            setData()
            refreshDiv(gameData, gameDivs)
            return true
        } else {
            return false
        }
    }

    // left
    var left = function(){
        if(cur.canLeft(isValid)) {
            clearData()
            cur.left()
            setData()
            refreshDiv(gameData, gameDivs)
        }
    }
    // right
    var right = function(){
        if(cur.canRight(isValid)) {
            clearData()
            cur.right()
            setData()
            refreshDiv(gameData, gameDivs)
        }
    }
    // 设置时间
    var setTime = function(time){
        timeDiv.innerHTML = time
    }
    // 加分
    var addScore = function(line) {
        var s = 0
        switch(line) {
            case 1:
                s = 10;
                break
            case 2:
                s = 30;
                break
            case 3:
                s = 60;
                break
            case 4:
                s = 100;
                break
            default:
                break
        }
        score = score + s
        scoreDiv.innerHTML = score
    }
    // 游戏结束
    var gameover = function(win){
        if(win) {
            resultDiv.innerHTML = 'You Win'
        } else {
            resultDiv.innerHTML = 'You Lose'
        }
    }
    // 底部增加行
    var addTailLines = function(lines) {
        for (var i = 0; i < gameData.length - lines.length; i++) {
            gameData[i] = gameData[i + lines.length]
        }
        for (var i = 0; i < lines.length; i++) {
            gameData[gameData.length - lines.length + i] = lines[i]
        }
        refreshDiv(gameData, gameDivs)
    }
    //初始化
    var init = function(doms, s, r, s1, r1) {
        gameDiv = doms.gameDiv
        nextDiv = doms.nextDiv
        timeDiv = doms.timeDiv
        scoreDiv = doms.scoreDiv
        resultDiv = doms.resultDiv
        console.log(s, r)
        cur = new Square(s, r)
        next = new Square(s1, r1)
        initDiv(gameDiv, gameData, gameDivs)
        initDiv(nextDiv, next.data, nextDivs)
        setData()
        refreshDiv(gameData, gameDivs)
        refreshDiv(next.data, nextDivs)
    }
    //导出API
    this.init = init
    this.down = down
    this.left = left
    this.right = right
    this.rotate = rotate
    this.fall = function() {while(down());}
    this.fixed = fixed
    this.performNext = performNext
    this.checkClear = checkClear
    this.checkGameOver = checkGameOver
    this.setTime = setTime
    this.addScore = addScore
    this.gameover = gameover
    this.addTailLines = addTailLines
}



