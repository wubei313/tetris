var Square = function(s, r) {
    console.log('square被调用', s, r)
    var square = [
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 0],
            [0, 2, 2, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 2, 0],
            [0, 0, 2, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 2, 0],
            [0, 2, 2, 0],
            [0, 2, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 2, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 2, 0],
            [0, 0, 2, 0],
            [0, 2, 2, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 2, 2, 2],
            [0, 0, 2, 0],
            [0, 0, 0, 0]
        ],
    ]

    //制造方块
    const makeSquare = function(s, r) {
        let result = square[s]
        console.log('result', result, 's', s)
        for(var i = 0; i < r; i++) {
            result = blokTrunLeft(result)
        }
        console.log('result', result)
        return result
    }
    //方块数据
    this.data = makeSquare(s, r)
    //原点
    this.origin = {
        x: 0,
        y: 4
    }
}
//顺时针旋转
var blokTrunLeft = function(data) {
    var rows = data.length
    var column = data[0].length
    var newArr = []

    for(var i = 0; i < column; i++){
        let tempArr = []
        for(var j = rows - 1; j >= 0; j--){
            tempArr.push(data[j][i])
        }
        newArr.push(tempArr)
    }
    return newArr
}

// Square.prototype.makeSquare = function(type, rotate) {
//     let result = this.square[type]
//     for(var i = 0; i < rotate; i++) {
//         result = blokTrunLeft(result)
//     }
//     return result
// }

Square.prototype.canRotate = function(isValid) {
    var test = blokTrunLeft(this.data)
    return isValid(this.origin, test)
}
Square.prototype.canDown = function(isValid) {
    var test = {}
    test.x = this.origin.x + 1
    test.y = this.origin.y
    return isValid(test, this.data)
}
Square.prototype.canLeft = function(isValid) {
    var test = {}
    test.x = this.origin.x
    test.y = this.origin.y - 1
    return isValid(test, this.data)
}
Square.prototype.canRight = function(isValid) {
    var test = {}
    test.x = this.origin.x
    test.y = this.origin.y + 1
    return isValid(test, this.data)
}
Square.prototype.rotate = function() {
   this.data = blokTrunLeft(this.data)
}
Square.prototype.down = function() {
    this.origin.x = this.origin.x + 1
}
Square.prototype.left = function() {
    this.origin.y = this.origin.y - 1
}
Square.prototype.right = function() {
    this.origin.y = this.origin.y + 1
}
