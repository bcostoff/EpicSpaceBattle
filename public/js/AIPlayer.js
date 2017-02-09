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
  this.player = this.game.add.sprite(startX, startY, 'dude-' + this.team)         

  // this.player.scale.setTo(0.5, 0.5);
  this.player.scale.setTo(scaleRatio, scaleRatio);
  this.player.anchor.setTo(0.5, 0.5)
  this.player.animations.add('move', [0], 0, true)
  this.player.animations.add('stop', [0], 0, true)
  
  this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.enableBody = true; 
  this.player.body.maxVelocity.setTo(400, 400)
  this.player.body.immovable = true
  this.player.body.collideWorldBounds = true

  // This will force it to decelerate and limit its speed
  //this.player.body.drag.setTo(200, 200)
  this.player.body.drag.setTo(200)

  var barConfig = {x: -5, y: 0};
  this.healthbar = new HealthBar(this.game, barConfig);
  this.player.addChild(this.healthbar.bgSprite)
  this.player.addChild(this.healthbar.barSprite)  

  if(this.team == 'blue'){
    this.player.angle = 180;
  }

  //-----------CREATE WEAPONS ARRAY---------//
  this.weapons = [];
  this.weapons.push(new Weapon.SingleBullet(this.game));
  this.currentWeapon = 0;
  this.weapons[this.currentWeapon].visible = true;


  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: ship_ver, health: this.healthbar.getPercentage(), username: username }
}


AIPlayer.prototype.update = function (shipEmitter,player,capitalG,capitalB) {  

  if(this.team == 'green'){
    var target = capitalB.capitalShip
  }else{
    var target = capitalG.capitalShip    
  }

  this.currentSpeed = 300
  shipEmitter.emit('ship_spark', this.player.x, this.player.y, { repeat: 0, frequency: 70 });
  shipEmitter.emit('ship_flame', this.player.x, this.player.y, { repeat: 0, frequency: 20 });

  if(this.game.physics.arcade.distanceBetween(this.player, player.player) < 600 && this.game.physics.arcade.distanceBetween(this.player, player.player) > 200){
    var angleTo = Phaser.Math.radToDeg(this.player.position.angle(player.player.position));
    var shortestAngle = this.getShortestAngle(angleTo, this.player.angle);
    var newAngle = this.player.angle + shortestAngle;
    this.game.add.tween(this.player).to({angle: newAngle}, 150, Phaser.Easing.Linear.None, true);
    this.weapons[0].fire(this.player);
  }else{
    var angleTo = Phaser.Math.radToDeg(this.player.position.angle(target.position));
    var shortestAngle = this.getShortestAngle(angleTo, this.player.angle);
    var newAngle = this.player.angle + shortestAngle;
    this.game.add.tween(this.player).to({angle: newAngle}, 150, Phaser.Easing.Linear.None, true);
    if(this.game.physics.arcade.distanceBetween(this.player, target) < 600 && this.game.physics.arcade.distanceBetween(this.player, target) > 200){
      this.weapons[0].fire(this.player);
    }
  }

  this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity)

  //this.game.physics.arcade.collide(this.weapons[this.currentWeapon], player.player, this.damageEnemy, null, this);  

  //NEW CODE TO EMIT
  this.newServerUpdate = { x: this.player.x, y: this.player.y, angle: this.player.angle, ver: 1, health: this.healthbar.getPercentage(), username: 'Computer' }
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
    this.player.kill();
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
  this.player.kill();
  socket.emit('remove player');
  setTimeout(function(){ 
    this.game.state.start('dead');    
  }, 3000);
}


AIPlayer.prototype.explode = function(emitter) {
    emitter.emit('ship_explosion', this.player.x, this.player.y, { total: 32 });
}


AIPlayer.prototype.getShortestAngle = function(angle1, angle2) {

        var difference = angle2 - angle1;
        var times = Math.floor((difference - (-180)) / 360);

        return (difference - (times * 360)) * -1;

}


AIPlayer.prototype.takeDamage = function(health,emitter) {
  if(health < 1){
    this.explode(emitter);
    this.player.kill();  
    this.weapons.kill();
  }else{
    newHealth = health - 10;
    this.healthbar.setPercent(newHealth) 
  }   
}



window.AIPlayer = AIPlayer
