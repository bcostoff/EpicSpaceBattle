/* global game */

var RemotePlayer = function (index, game, startX, startY, startAngle, startVer, startHealth, startTeam, startUsername) { 
  var x = startX
  var y = startY
  var angle = startAngle
  var ver = startVer
  var health = startHealth
  var team = startTeam
  var username = startUsername

  this.game = game
  //this.health = startHealth
  this.alive = true

  if(ver == 1){
    this.player = game.add.sprite(x, y, 'dude-' + team)
  }else if(ver == 2){
    this.player = game.add.sprite(x, y, 'dude-alt-' + team)
  }
  // this.player.scale.setTo(0.5, 0.5);
  this.player.scale.setTo(scaleRatio, scaleRatio);
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

  this.lastPosition = { x: x, y: y, angle: angle }
  
}

RemotePlayer.prototype.update = function () {
  if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y || this.player.angle != this.lastPosition.angle) {
    //this.player.play('move')

    //ADDED BELOW TO SMOOTH MOVEMENT
    game.add.tween(this.player).to( { x: this.player.x, y: this.player.y }, this.game.time.physicsElapsed, Phaser.Easing.Default, true);
    this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y)
    if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y){
      shipEmitter.emit('ship_spark', this.player.x, this.player.y, { repeat: 0, frequency: 70 });
      shipEmitter.emit('ship_flame', this.player.x, this.player.y, { repeat: 0, frequency: 20 });
    }    
  } else {
    //this.player.play('stop')
  }

  this.lastPosition.x = this.player.x
  this.lastPosition.y = this.player.y
  this.lastPosition.angle = this.player.angle
}

RemotePlayer.prototype.takeDamage = function (health,emitter) {
  if(health < 1){
    this.explode(emitter);
    this.player.kill();  
  }else{
    newHealth = health - 10;
    this.healthbar.setPercent(newHealth) 
  }  
}

RemotePlayer.prototype.destroyPlayer = function(emitter){  
  this.explode(emitter);
  this.player.kill();
}

RemotePlayer.prototype.explode = function(emitter) {
    emitter.emit('ship_explosion', this.player.x, this.player.y, { total: 32 });
}


window.RemotePlayer = RemotePlayer
