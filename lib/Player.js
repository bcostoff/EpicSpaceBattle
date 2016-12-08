/* ************************************************
** GAME PLAYER CLASS
************************************************ */
var Player = function (startX, startY, startAngle, startVer, startHealth, startTeam, startUsername) {
  var x = startX
  var y = startY
  var angle = startAngle
  var ver = startVer
  var health = startHealth
  var team = startTeam
  var username = startUsername
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

  var getUsername = function () {
    return username
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

  var setUsername = function (newUsername) {
    tean = username
  }

  // Define which variables and methods can be accessed
  return {
    getX: getX,
    getY: getY,
    getAngle: getAngle,
    getVer: getVer,
    getHealth: getHealth,
    getTeam: getTeam,
    getUsername: getUsername,
    setX: setX,
    setY: setY,
    setAngle: setAngle,
    setVer: setVer,
    setHealth: setHealth,
    setTeam: setTeam,
    setUsername: setUsername,
    id: id
  }
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player
