var Local = function(socket) {
    //游戏对象
    var game
    // 时间间隔
    var INTERVAL = 300
    //定时器
    var timer = null
    //时间计数器
    var timeCount = 0
    //时间
    var time = 0
    // 绑定事件
    var bindKeyEvent = function() {
        document.onkeydown = function (ev) {
            if (ev.keyCode == 38) { // up
                game.rotate()
                socket.emit('rotate')
            } else if(ev.keyCode == 39) { // right
                game.right()
                socket.emit('right')
            } else if(ev.keyCode == 40) { // down
                game.down()
                socket.emit('down')
            } else if(ev.keyCode == 37) { // left
                game.left()
                socket.emit('left')
            } else if(ev.keyCode == 32) { // space
                game.fall()
                socket.emit('fall')
            }
        }
    }
    // 移动
    var move = function() {
        timeFunc()
        if(!game.down()){
            game.fixed()
            socket.emit('fixed')
            let line = game.checkClear()
            if(line) {
                game.addScore(line)
                socket.emit('line', line)
                if(line > 1) {
                    var bottomLines = generateBottomLine(line)
                    socket.emit('bottomLines', bottomLines)
                }
            }
            var gameOver = game.checkGameOver()
            if(gameOver){
                game.gameover(false)
                document.getElementById('remote_gameover').innerHTML = 'You win'
                socket.emit('lose')
                stop()
            } else {
                let s = Math.floor(Math.random()*7)
                let r = Math.floor(Math.random()*4 + 1)
                game.performNext(s, r)
                socket.emit('next', {s: s, r: r})
            }
        } else {
            socket.emit('down')
        }
    }
    // 随机生成干扰行
    var generateBottomLine = function(lineNum) {
        var lines = []
        for(var i = 0; i < lineNum; i++) {
            var line = []
            for(var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1)
            }
            lines.push(line)
        }
        return lines
    }

    //计时函数
    var timeFunc = function() {
        let oldTime = Math.floor(timeCount * INTERVAL / 1000)
        timeCount = timeCount + 1
        let newTime = Math.floor(timeCount * INTERVAL / 1000)
        if(newTime - oldTime == 1){
            game.setTime(newTime)
            socket.emit('time', newTime)
        }
    }
    //begin
    var start = function() {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv: document.getElementById('local_next'),
            timeDiv: document.getElementById('local_time'),
            scoreDiv: document.getElementById('local_score'),
            resultDiv: document.getElementById('local_gameover')
        }
        game = new Game()
        let s = Math.floor(Math.random() * 7)
        let r = Math.floor(Math.random() * 4)
        let s1 = Math.floor(Math.random() * 7)
        let r1 = Math.floor(Math.random() * 4)
        game.init(doms, s, r, s1, r1)
        socket.emit('init', {s: s, r: r, s1: s1, r1: r1})
        bindKeyEvent()
        timer = setInterval(move, INTERVAL)

    }

    var stop = function() {
        if(timer) {
            clearInterval(timer)
            timer = null
        }
        document.onkeydown = null
    }
    //导出API
    // this.start = start
    //这里就不需要导出start了，而是直接使用socket来启动
    socket.on('start', function() {
        document.getElementById('waiting').innerHTML = ''
        start()
    })

    socket.on('lose', function() {
        game.gameover(false)
        stop()
    })

    socket.on('leave', function(){
        document.getElementById('local_gameover').innerHTML = '对方掉线'
        document.getElementById('remote_gameover').innerHTML = '已掉线'
        stop()
    })
    socket.on('bottomLines', function(data){
        game.addTailLines(data)
        socket.emit('addTailLines', data)
    })
}