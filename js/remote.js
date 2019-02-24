var Remote = function(socket) {
    var game

    var bindEvents = function() {
        socket.on('init', function(data) {
            start(data.s, data.r, data.s1, data.r1)
        })
        socket.on('next', function(data) {
            game.performNext(data.s, data.r)
        })
        socket.on('rotate', function() {
            game.rotate()
        })
        socket.on('left', function() {
            game.left()
        })
        socket.on('right', function() {
            game.right()
        })
        socket.on('down', function() {
            game.down()
        })
        socket.on('fall', function() {
            game.fall()
        })
        socket.on('fixed', function() {
            game.fixed()
        })
        socket.on('line', function(data) {
            game.checkClear()
            game.addScore(data)
        })
        socket.on('time', function(data) {
            game.setTime(data)
        })
        socket.on('lose', function(data) {
            game.gameover(false)
        })
        socket.on('addTailLines', function(data) {
            game.addTailLines(data)
        })
    }

    var start = function(s, r, s1, r1) {
        var doms = {
            gameDiv: document.getElementById('remote_game'),
            nextDiv: document.getElementById('remote_next'),
            timeDiv: document.getElementById('remote_time'),
            scoreDiv: document.getElementById('remote_score'),
            resultDiv: document.getElementById('remote_gameover')
        }
        game = new Game()
        game.init(doms, s, r, s1, r1)
    }

    bindEvents()
}