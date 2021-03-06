var Bullet = function (game, key) {

  Phaser.Sprite.call(this, game, 0, 0, key);
  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

  this.anchor.set(0.5);


  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;

  this.tracking = false;
  this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

  gx = gx || 0;
  gy = gy || 0;

  this.reset(x, y);
  this.scale.set(1);

  this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

  this.angle = angle;

  this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

  if (this.tracking){
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
  }

  if (this.scaleSpeed > 0){
    this.scale.x += this.scaleSpeed;
    this.scale.y += this.scaleSpeed;
  }

};

var Weapon = {};



//SINGLE LASER SHOT

Weapon.SingleBullet = function (game) {

  Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 700;
  this.fireRate = 300;

  for (var i = 0; i < 500; i++){
    this.add(new Bullet(game, 'laser'), true);
  }

  return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

  if (this.game.time.time < this.nextFire) { return; }  

  var myPoint = new Phaser.Point(source.width / 2 + 10, -source.height / 2 + 40);
  myPoint.rotate(0,0,source.angle,true,40);

  this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, source.angle, this.bulletSpeed, 0, 0);  
  socket.emit('new laser', {x: source.x+myPoint.x, y: source.y+myPoint.y, angle: source.angle, type: 'single'})

  this.nextFire = this.game.time.time + this.fireRate;

};




//SPLIT SHOT, WORKING ON IT

Weapon.SplitShot = function (game) {

  Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 700;
  this.fireRate = 40;

  for (var i = 0; i < 64; i++){
    this.add(new Bullet(game, 'laser'), true);
  }

  return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {

  if (this.game.time.time < this.nextFire) { return; }

  var myPoint = new Phaser.Point((source.width/2) + 150, (-source.height/2) + 40);
  myPoint.rotate(0,0,source.angle,true,40);

  this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, source.angle, this.bulletSpeed, 0, -500);
  this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, source.angle, this.bulletSpeed, 0, 0);
  this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, source.angle, this.bulletSpeed, 0, 500);

  this.nextFire = this.game.time.time + this.fireRate;

};




//BEAM SHOT

Weapon.Beam = function (game) {

  Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 1000;
  this.fireRate = 45;

  for (var i = 0; i < 500; i++){
    this.add(new Bullet(game, 'big_laser'), true);
  }

  return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

  if (this.game.time.time < this.nextFire) { return; }


    var myPoint = new Phaser.Point((source.width/2) + 150, (-source.height/2) + 40);
    myPoint.rotate(0,0,source.angle,true,40);

    this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, source.angle, this.bulletSpeed, 0, 0);  
    socket.emit('new laser', {x: source.x+myPoint.x, y: source.y+myPoint.y, angle: source.angle, type: 'beam'})


    this.nextFire = this.game.time.time + this.fireRate;

};



//SINGLE LASER SHOT FROM CAPITAL SHIP

Weapon.SingleCapitalBullet = function (game) {

  Phaser.Group.call(this, game, game.world, 'Single Capital Bullet', false, true, Phaser.Physics.ARCADE);

  this.nextFire = 0;
  this.bulletSpeed = 500;
  this.fireRate = 300;

  for (var i = 0; i < 500; i++){
    this.add(new Bullet(game, 'capital_laser'), true);
  }

  return this;

};

Weapon.SingleCapitalBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleCapitalBullet.prototype.constructor = Weapon.SingleCapitalBullet;

Weapon.SingleCapitalBullet.prototype.fire = function (source, player) {
  //console.log(source.team);
  //console.log(source.angle);
  if (this.game.time.time < this.nextFire) { return; }  

  var myPoint = new Phaser.Point(source.width / 2 + 10, -source.height / 2 + 40);
  myPoint.rotate(0,0,source.angle,true,40);

  newAngle = game.physics.arcade.angleBetween(source, player);

  this.getFirstExists(false).fire(source.x+myPoint.x, source.y+myPoint.y, newAngle*60, this.bulletSpeed, 0, 0);  
  socket.emit('new laser', {x: source.x+myPoint.x, y: source.y+myPoint.y, angle: newAngle*60, type: 'capital_laser'})

  this.nextFire = this.game.time.time + this.fireRate;

};
