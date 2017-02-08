/* global game */

var AIPlayer = function (game,player) {
  // The base of our player
  //var startX = Math.round(Math.random() * (1000) - 500)
  //var startY = Math.round(Math.random() * (1000) - 500)

  if(player.team == 'green'){    
    var startX = 2500;
    var startY = 2000;
    this.team = 'blue';
  }else if(player.team == 'blue'){
    var startX = 500;
    var startY = 2000;
    this.team = 'green';
  }

  this.game = game
  this.aiplayer = this.game.add.sprite(startX, startY, 'dude-' + this.team)         

  // this.player.scale.setTo(0.5, 0.5);
  this.aiplayer.scale.setTo(scaleRatio, scaleRatio);
  this.aiplayer.anchor.setTo(0.5, 0.5)
  this.aiplayer.animations.add('move', [0], 0, true)
  this.aiplayer.animations.add('stop', [0], 0, true)
  
  this.game.physics.enable(this.aiplayer, Phaser.Physics.ARCADE);
  this.aiplayer.enableBody = true; 
  this.aiplayer.body.maxVelocity.setTo(400, 400)
  this.aiplayer.body.immovable = false
  this.aiplayer.body.collideWorldBounds = true

  // This will force it to decelerate and limit its speed
  //this.player.body.drag.setTo(200, 200)
  this.aiplayer.body.drag.setTo(200)

  var barConfig = {x: -5, y: 0};
  this.healthbar = new HealthBar(this.game, barConfig);
  this.aiplayer.addChild(this.healthbar.bgSprite)
  this.aiplayer.addChild(this.healthbar.barSprite)  

  if(this.team == 'blue'){
    this.aiplayer.angle = 180;
  }

  //-----------CREATE WEAPONS ARRAY---------//
  this.weapons = [];
  this.weapons.push(new Weapon.SingleBullet(this.game));
  this.currentWeapon = 0;
  this.weapons[this.currentWeapon].visible = true;


  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.aiplayer.x, y: this.aiplayer.y, angle: this.aiplayer.angle, ver: ship_ver, health: this.healthbar.getPercentage(), username: username }
}


AIPlayer.prototype.update = function (shipEmitter,player,capitalG,capitalB) {  

  if(this.team == 'green'){
    var target = capitalB.capitalShip
  }else{
    var target = capitalG.capitalShip    
  }

  this.currentSpeed = 300
  shipEmitter.emit('ship_spark', this.aiplayer.x, this.aiplayer.y, { repeat: 0, frequency: 70 });
  shipEmitter.emit('ship_flame', this.aiplayer.x, this.aiplayer.y, { repeat: 0, frequency: 20 });

  if(this.game.physics.arcade.distanceBetween(this.aiplayer, player.player) < 600 && this.game.physics.arcade.distanceBetween(this.aiplayer, player.player) > 200){
    var angleTo = Phaser.Math.radToDeg(this.aiplayer.position.angle(player.player.position));
    var shortestAngle = this.getShortestAngle(angleTo, this.aiplayer.angle);
    var newAngle = this.aiplayer.angle + shortestAngle;
    this.game.add.tween(this.aiplayer).to({angle: newAngle}, 150, Phaser.Easing.Linear.None, true);
    this.weapons[0].fire(this.aiplayer);
  }else{
    var angleTo = Phaser.Math.radToDeg(this.aiplayer.position.angle(target.position));
    var shortestAngle = this.getShortestAngle(angleTo, this.aiplayer.angle);
    var newAngle = this.aiplayer.angle + shortestAngle;
    this.game.add.tween(this.aiplayer).to({angle: newAngle}, 150, Phaser.Easing.Linear.None, true);
    if(this.game.physics.arcade.distanceBetween(this.aiplayer, target) < 600 && this.game.physics.arcade.distanceBetween(this.aiplayer, target) > 200){
      this.weapons[0].fire(this.aiplayer);
    }
  }

  this.game.physics.arcade.velocityFromRotation(this.aiplayer.rotation, this.currentSpeed, this.aiplayer.body.velocity)

  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.aiplayer.x, y: this.aiplayer.y, angle: this.aiplayer.angle, ver: 1, health: this.healthbar.getPercentage(), username: 'Computer' }
  this.sendToServer(this.newServerUpdate);

  //OLD CODE TO EMIT
  //socket.emit('move player', { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: ship_ver, health: this.healthbar.getPercentage() })

}



// LocalPlayer.prototype.fireLaser = function () {
//   //Fire Laser
//   if(game.time.now > laserTime){
//     newLaser = newLasers.getFirstExists(false);
//     if(newLaser){
//       newLaser.reset(this.player.body.x + 40, this.player.body.y + 40);
//       if(ship_ver == 1){
//         newLaser.reset(this.player.body.x + 40, this.player.body.y + 40);
//       //  newLaser = game.add.sprite(this.player.body.x + 35, this.player.body.y + 35, 'laser')
//       }else if(ship_ver == 2){
//         newLaser.reset(this.player.body.x + 40, this.player.body.y + 40);
//       //  newLaser = game.add.sprite(this.player.body.x + 40, this.player.body.y + 40, 'laser-alt')
//       }      
//       //newLaser.enableBody = true; 
//       //newLaser.anchor.setTo(0.5, 0.5)
//       game.physics.enable(newLaser, Phaser.Physics.ARCADE)
//       //newLaser.body.collideWorldBounds = false
//       newLaser.lifespan = 2000;
//       newLaser.rotation = this.player.rotation;      
//       newLaser.angle = this.player.angle
//       //newLaser.body.immovable = true
//       game.physics.arcade.velocityFromRotation(this.player.rotation, 800, newLaser.body.velocity);
//       laserTime = game.time.now + 100;
//       socket.emit('new laser', {x: newLaser.x, y: newLaser.y, angle: newLaser.angle})
//     }
//   }  
// }


AIPlayer.prototype.sendToServer = function (serverUpdate) {
  setTimeout(function(){ socket.emit('move player', serverUpdate); }, 100);  
}


AIPlayer.prototype.takeDamage = function (health,emitter) {
  if(health < 1){
    this.explode(emitter);
    this.aiplayer.kill();
    socket.emit('remove player');
    setTimeout(function(){ 
      this.game.state.start('dead');    
    }, 3000);
    //socket.emit('disconnect')
  }else{
    this.healthbar.setPercent(health) 
  }  
}


AIPlayer.prototype.destroyPlayer = function(emitter){  
  this.explode(emitter);
  this.aiplayer.kill();
  socket.emit('remove player');
  setTimeout(function(){ 
    this.game.state.start('dead');    
  }, 3000);
}


AIPlayer.prototype.explode = function(emitter) {
    emitter.emit('ship_explosion', this.aiplayer.x, this.aiplayer.y, { total: 32 });
}


AIPlayer.prototype.getShortestAngle = function(angle1, angle2) {

        var difference = angle2 - angle1;
        var times = Math.floor((difference - (-180)) / 360);

        return (difference - (times * 360)) * -1;

}

window.AIPlayer = AIPlayer
