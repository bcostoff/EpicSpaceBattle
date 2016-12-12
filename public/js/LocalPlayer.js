/* global game */

var LocalPlayer = function (game) {
  // The base of our player
  //var startX = Math.round(Math.random() * (1000) - 500)
  //var startY = Math.round(Math.random() * (1000) - 500)

  var startX = 550;
  var startY = 550;

  if(ship_ver == 1){
    this.player = game.add.sprite(startX, startY, 'dude-' + team)            
  }else if(ship_ver == 2){
    this.player = game.add.sprite(startX, startY, 'dude-alt-' + team)
  }

  // this.player.scale.setTo(0.5, 0.5);
  this.player.scale.setTo(scaleRatio, scaleRatio);
  this.player.anchor.setTo(0.5, 0.5)
  this.player.animations.add('move', [0], 0, true)
  this.player.animations.add('stop', [0], 0, true)

  // This will force it to decelerate and limit its speed
  // player.body.drag.setTo(200, 200)
  game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.enableBody = true; 
  this.player.body.maxVelocity.setTo(400, 400)
  this.player.body.immovable = true
  this.player.body.collideWorldBounds = true

  var barConfig = {x: -5, y: 0};
  this.healthbar = new HealthBar(game, barConfig);
  this.player.addChild(this.healthbar.bgSprite)
  this.player.addChild(this.healthbar.barSprite)  

  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: ship_ver, health: this.healthbar.getPercentage(), username: username }
}


LocalPlayer.prototype.update = function () {

  if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {

    currentSpeed = 400

    if (stick1.isDown){
      game.physics.arcade.velocityFromRotation(stick1.rotation, stick1.force * currentSpeed, this.player.body.velocity);
      this.player.rotation = stick1.rotation;
    }else{
      this.player.body.velocity.set(0);
    }

  }else{

    if(cursors.left.isDown){
      this.player.angle -= 4
    }else if(cursors.right.isDown) {
      this.player.angle += 4
    }


    if (cursors.up.isDown){
      // The speed we'll travel at
      currentSpeed = 400
    }else{
      if (currentSpeed > 0) {
          currentSpeed -= 4
      }
    }

    if (cursors.down.isDown){
      // The speed we'll travel at
      currentSpeed = -200
    }else{
      if (currentSpeed > 0) {
        currentSpeed -= 4
      }
    }

   game.physics.arcade.velocityFromRotation(this.player.rotation, currentSpeed, this.player.body.velocity)

  }
  

  if(currentSpeed > 0){
    this.player.animations.play('move')
  }else{
    this.player.animations.play('stop')
  }

  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: ship_ver, health: this.healthbar.getPercentage(), username: username }
  this.sendToServer(this.newServerUpdate);

  //OLD CODE TO EMIT
  //socket.emit('move player', { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: ship_ver, health: this.healthbar.getPercentage() })

}


LocalPlayer.prototype.fireLaser = function () {
  //Fire Laser
  if(game.time.now > laserTime){
    newLaser = newLasers.getFirstExists(false);
    if(newLaser){
      newLaser.reset(this.player.body.x + 35, this.player.body.y + 35);
      if(ship_ver == 1){
        newLaser.reset(this.player.body.x + 35, this.player.body.y + 35);
      //  newLaser = game.add.sprite(this.player.body.x + 35, this.player.body.y + 35, 'laser')
      }else if(ship_ver == 2){
        newLaser.reset(this.player.body.x + 40, this.player.body.y + 40);
      //  newLaser = game.add.sprite(this.player.body.x + 40, this.player.body.y + 40, 'laser-alt')
      }      
      //newLaser.enableBody = true; 
      //newLaser.anchor.setTo(0.5, 0.5)
      game.physics.enable(newLaser, Phaser.Physics.ARCADE)
      //newLaser.body.collideWorldBounds = false
      newLaser.lifespan = 2000;
      newLaser.rotation = this.player.rotation;      
      newLaser.angle = this.player.angle
      //newLaser.body.immovable = true
      game.physics.arcade.velocityFromRotation(this.player.rotation, 800, newLaser.body.velocity);
      laserTime = game.time.now + 100;
      socket.emit('new laser', {x: newLaser.x, y: newLaser.y, angle: newLaser.angle})
    }
  }  
}


LocalPlayer.prototype.sendToServer = function (serverUpdate) {
  setTimeout(function(){ socket.emit('move player', serverUpdate); }, 100);  
}


LocalPlayer.prototype.takeDamage = function (health,emitter) {
  if(health == 0){
    this.explode(emitter);
    socket.emit('disconnect')
    game.state.start('dead');    
  }else{
    this.healthbar.setPercent(health) 
  }  
}


LocalPlayer.prototype.explode = function(emitter) {
    emitter.emit('basic', pointer.x, pointer.y, { total: 32 });
}


window.LocalPlayer = LocalPlayer
