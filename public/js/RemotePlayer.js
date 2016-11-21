/* global game */

var RemotePlayer = function (index, game, startX, startY, startAngle, startVer, startHealth) {
  var x = startX
  var y = startY
  var angle = startAngle
  var ver = startVer
  var health = startHealth

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

  // Define which variables and methods can be accessed
  return {
    getX: getX,
    getY: getY,
    getAngle: getAngle,
    getVer: getVer,
    getHealth: getHealth,
    setX: setX,
    setY: setY,
    setAngle: setAngle,
    setVer: setVer,
    setHealth: setHealth,
    id: id
  }

  this.game = game
  //this.health = startHealth
  this.alive = true

  if(ver == 1){
    this.player = game.add.sprite(x, y, 'dude')
  }else if(ver == 2){
    this.player = game.add.sprite(x, y, 'dude-alt')
  }
  this.player.scale.setTo(0.5, 0.5);
  this.player.animations.add('move', [0], 0, true)
  this.player.animations.add('stop', [0], 0, true)

  this.player.anchor.setTo(0.5, 0.5)
  this.player.enableBody = true; 
  this.player.name = index.toString()
  this.player.health = startHealth;
  game.physics.enable(this.player, Phaser.Physics.ARCADE)
  this.player.body.immovable = true
  this.player.body.collideWorldBounds = true

  this.player.angle = angle

  var barConfig = {x: -5, y: 0};
  this.healthbar = new HealthBar(game, barConfig);
  this.player.addChild(this.healthbar.bgSprite)
  this.player.addChild(this.healthbar.barSprite)  

  this.lastPosition = { x: x, y: y, angle: angle, health: this.player.health }
  
}

RemotePlayer.prototype.update = function () {
  if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y || this.player.angle != this.lastPosition.angle) {
    this.player.play('move')
    this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y)
  } else {
    this.player.play('stop')
  }

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
  this.lastPosition.angle = this.player.angle
}

RemotePlayer.prototype.takeDamage = function (health) {
  if(health == 0){
    this.player.kill();  
  }else{
    this.healthbar.setPercent(health) 
  }  
}


window.RemotePlayer = RemotePlayer
