/* global game */

var RemoteLaser = function (index, game, laser, startX, startY, startAngle, startType) {
  //console.log('New remote laser')
  var x = startX
  var y = startY
  var angle = startAngle
  var type = startType

  this.game = game
  this.laser = laser

  if(type == 'single'){
    this.laser = game.add.sprite(x, y, 'laser')
  }else if(type == 'beam'){
    this.laser = game.add.sprite(x, y, 'big_laser')
  }else if(type == 'capital_laser'){
    this.laser = game.add.sprite(x, y, 'capital_laser')
  }
  
  this.laser.anchor.setTo(0.5, 0.5)
  this.laser.name = index.toString()
  this.laser.lifespan = 2000;
  this.laser.angle = angle


  game.physics.enable(this.laser, Phaser.Physics.ARCADE)
  //this.laser.body.immovable = true
  this.laser.body.collideWorldBounds = false
  game.physics.arcade.velocityFromRotation(this.laser.rotation, 400, this.laser.body.velocity);  

  this.lastPosition = { x: x, y: y, angle: angle }
}

RemoteLaser.prototype.update = function () {
  
  if (this.laser.x !== this.lastPosition.x || this.laser.y !== this.lastPosition.y || this.laser.angle != this.lastPosition.angle) {    
    //socket.emit('move laser', { x: this.laser.x, y: this.laser.y, angle: this.laser.angle })
  //   this.laser.rotation = Math.PI + game.physics.arcade.angleToXY(this.laser, this.lastPosition.x, this.lastPosition.y)
  //   this.laser.lifespan = 2000;
  //   game.physics.arcade.velocityFromRotation(this.laser.rotation, 400, this.laser.body.velocity);
  //   socket.emit('move laser', { x: this.laser.x, y: this.laser.y, angle: this.laser.angle })
    
  } else {



  }

  this.lastPosition.x = this.laser.x
  this.lastPosition.y = this.laser.y
  this.lastPosition.angle = this.laser.angle
}

window.RemoteLaser = RemoteLaser
