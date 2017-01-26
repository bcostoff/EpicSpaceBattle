/* ************************************************
** GAME CAPITAL CLASS
************************************************ */
var Capital = function (startX, startY, startAngle, startHealth, startTeam) {
  var x = startX
  var y = startY
  var angle = startAngle
  var health = startHealth
  var team = startTeam
  var id

  // Getters and setters
  var getX = function () {
    return x
  }

  var getY = function () {
    return y
  }

  var getAngle = function () {
    return angle
  }

  var getHealth = function () {
    return health
  }

  var getTeam = function () {
    return team
  }

  var setX = function (newX) {
    x = newX
  }

  var setY = function (newY) {
    y = newY
  }

  var setAngle = function (newAngle) {
    angle = newAngle
  }

  var setHealth = function (newHealth) {
    health = newHealth
  }

  var setTeam = function (newTeam) {
    tean = newTeam
  }

  // Define which variables and methods can be accessed
  return {
    getX: getX,
    getY: getY,
    getAngle: getAngle,
    getHealth: getHealth,
    getTeam: getTeam,
    setX: setX,
    setY: setY,
    setAngle: setAngle,
    setHealth: setHealth,
    setTeam: setTeam,
    id: id
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Capital
