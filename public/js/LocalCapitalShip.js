/* global game */

var LocalCapitalShip = function (game,t) {

  if(t == 'green'){
    var startX = 200;
    var startY = 2000;
  }else if(t == 'blue'){
    var startX = 3800;
    var startY = 2000;
  }

  this.capitalShip = game.add.sprite(startX, startY, 'capital-green')        
  this.team = t;

  this.capitalShip.scale.setTo(scaleRatio, scaleRatio);
  this.capitalShip.anchor.setTo(0.5, 0.5)
  game.physics.enable(this.capitalShip, Phaser.Physics.ARCADE);
  this.capitalShip.enableBody = true; 
  this.capitalShip.body.immovable = true;
  this.capitalShip.bringToTop()
  this.capitalShip.name = t

  var barConfig = {x: -5, y: -100};
  this.healthbar = new HealthBar(game, barConfig);
  this.capitalShip.addChild(this.healthbar.bgSprite)
  this.capitalShip.addChild(this.healthbar.barSprite)  

  if(t == 'blue'){
    this.capitalShip.angle = 180;
  }

  socket.emit('new capital', { x: this.capitalShip.x, y: this.capitalShip.y, angle: this.capitalShip.angle, health: 100, team: this.team })
}


LocalCapitalShip.prototype.update = function (player) {  

  // COMMENTED OUT TO TEST FIRING ROTATION
  // if(player.team == this.team){
  //   //Do Nothing
  // }else{
    if(game.physics.arcade.distanceBetween(player.player, this.capitalShip) < 700){     
      weapons[2].fire(this.capitalShip, player.player);
    }
  // }



  //NEW CODE TO EMIT
  // this.newServerUpdate = { health: this.healthbar.getPercentage(), team: t }
  // this.sendToServer(this.newServerUpdate);

}

LocalCapitalShip.prototype.sendToServer = function (serverUpdate) {
  //setTimeout(function(){ socket.emit('update capital health', serverUpdate); }, 100);  
}


LocalCapitalShip.prototype.takeCapitalDamage = function (health,emitter) {
  if(health < 1){
    this.explode(emitter);
    this.capitalShip.kill();
  }else{
    newHealth = health - 10;
    this.healthbar.setPercent(newHealth) 
  }  
}

LocalCapitalShip.prototype.explode = function(emitter) {
    emitter.emit('ship_explosion', this.capitalShip.x, this.capitalShip.y, { total: 64 });
}

window.LocalCapitalShip = LocalCapitalShip
