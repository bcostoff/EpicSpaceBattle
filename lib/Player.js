/* ************************************************
** GAME PLAYER CLASS
************************************************ */
var Player = function (startX, startY, startAngle, startVer, startHealth, startTeam) {
  var x = startX
  var y = startY
  var angle = startAngle
  var ver = startVer
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

  var getVer = function () {
    return ver
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

  var setVer = function (newVer) {
    ver = newVer
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
    getVer: getVer,
    getHealth: getHealth,
    getTeam: getTeam,
    setX: setX,
    setY: setY,
    setAngle: setAngle,
    setVer: setVer,
    setHealth: setHealth,
    setTeam: setTeam,
    id: id
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player
