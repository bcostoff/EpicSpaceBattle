/* global Phaser RemotePlayer io */

//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '')

// function preload () {
//   game.load.image('space', 'assets/space-bg.jpg')
//   //game.load.spritesheet('dude', 'assets/ship3.png', 83, 74)
//   game.load.spritesheet('dude', 'assets/ship5.png', 70, 70)
//   game.load.spritesheet('dude-alt', 'assets/ship4.png', 83, 62)
//   game.load.image('laser', 'assets/laser.png');
// }

var socket // Socket connection
var space
var ship_ver = 1
var player
var enemies
var lasers
var currentSpeed = 0
var cursors
var laser
var laserTime = 0
var healthTime = 0
var ver1
var ver2
var newLaser
var newLasers
var rock
var healthbar
var playerCount = 0;
var titleLabel;
var team;
var teamLabel;
var timer
var timerEvent
var text;

game.state.add('boot',bootState);
game.state.add('load',loadState);
game.state.add('menu',menuState); 
game.state.add('lobby',lobbyState);
game.state.add('registerShip',registerShipState);
game.state.add('play',playState);
game.state.add('dead',deadState);

game.state.start('boot');


// function create () {
//   socket = io.connect()

//   // Resize our game world to be a 2000 x 2000 square
//   game.world.setBounds(0, 0, 4800, 6000)

//   // Our tiled scrolling background
//   space = game.add.tileSprite(0, 0, 4800, 6000, 'space')
//   space.fixedToCamera = true

//   // The base of our player
//   var startX = Math.round(Math.random() * (1000) - 500)
//   var startY = Math.round(Math.random() * (1000) - 500)
//   if(ship_ver == 1){
//     player = game.add.sprite(startX, startY, 'dude')
//   }else{
//     player = game.add.sprite(startX, startY, 'dude-alt')
//   }
//   player.anchor.setTo(0.5, 0.5)
//   player.animations.add('move', [0], 0, true)
//   player.animations.add('stop', [0], 0, true)

//   // This will force it to decelerate and limit its speed
//   // player.body.drag.setTo(200, 200)
//   game.physics.enable(player, Phaser.Physics.ARCADE);
//   player.body.maxVelocity.setTo(400, 400)
//   player.body.collideWorldBounds = true

//   // Create some baddies to waste :)
//   enemies = []
//   lasers = []


//   //Laser
//   //laser = game.add.sprite(player.x, player.y, 'laser')
//   //laser.anchor.setTo(0.5, 0.5)
//   //game.physics.enable(laser, Phaser.Physics.ARCADE)
//   //laser.body.immovable = true
//   //laser.body.collideWorldBounds = false

//   // lasers = game.add.group();
//   // lasers.enableBody = true;
//   // lasers.physicsBodyType = Phaser.Physics.ARCADE;            
//   // lasers.createMultiple(40,'laser');
//   // lasers.setAll('anchor.x', 0.5);
//   // lasers.setAll('anchor.y', 0.5);
//   // lasers.setAll('checkWorldBounds', true);
//   // lasers.setAll('outOfBoundsKill', true);     


//   player.bringToTop()

//   game.camera.follow(player)
//   game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300)
//   game.camera.focusOnXY(0, 0)

//   cursors = game.input.keyboard.createCursorKeys()
//   game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

//   // Start listening for events
//   setEventHandlers()
// }

// var setEventHandlers = function () {
//   // Socket connection successful
//   socket.on('connect', onSocketConnected)

//   // Socket disconnection
//   socket.on('disconnect', onSocketDisconnect)

//   // New player message received
//   socket.on('new player', onNewPlayer)

//   // Player move message received
//   socket.on('move player', onMovePlayer)

//   // Player move message received
//   socket.on('move laser', onMoveLaser)

//   // Player removed message received
//   socket.on('remove player', onRemovePlayer)

//   // New laser message received
//   socket.on('new laser', onNewLaser)
// }

// // Socket connected
// function onSocketConnected () {
//   console.log('Connected to socket server')

//   // Reset enemies on reconnect
//   enemies.forEach(function (enemy) {
//     enemy.player.kill()
//   })
//   enemies = []
//   lasers = []
//   if(ship_ver == 1){
//     ship_ver = 2;
//   }else if(ship_ver == 2){
//     ship_ver = 1;
//   }
//   // Send local player data to the game server
//   socket.emit('new player', { x: player.x, y: player.y, angle: player.angle })
// }

// // Socket disconnected
// function onSocketDisconnect () {
//   console.log('Disconnected from socket server')
// }

// // New player
// function onNewPlayer (data) {
//   console.log('New player connected:', data.id)

//   // Avoid possible duplicate players
//   var duplicate = playerById(data.id)
//   if (duplicate) {
//     console.log('Duplicate player!')
//     return
//   }
//   //lasers = []
//   // Add new player to the remote players array
//   enemies.push(new RemotePlayer(data.id, game, player, data.x, data.y, data.angle))
// }

// // Move player
// function onMovePlayer (data) {
//   var movePlayer = playerById(data.id)

//   // Player not found
//   if (!movePlayer) {
//     console.log('Player not found: ', data.id)
//     return
//   }

//   // Update player position
//   movePlayer.player.x = data.x
//   movePlayer.player.y = data.y
//   movePlayer.player.angle = data.angle
// }

// // New laser
// function onNewLaser (data) {
//   // Add new player to the players array
//   var duplicate = laserById(data.id)
//   if (duplicate) {
//     console.log('Duplicate laser!')
//     return
//   }
//   console.log('New Laser: ', data.id)
//   //console.log('Creating new laser')
//   lasers.push(new RemoteLaser(data.id, game, laser, data.x, data.y, data.angle))
//   lasers.splice(lasers.indexOf(data.id), 1)
// }

// // Move laser
// function onMoveLaser (data) {
//   var moveLaser = laserById(data.id)

//   // Player not found
//   if (!moveLaser) {
//     console.log('Laser not found: ', data.id)
//     return
//   }

//   // Update laser position
//   moveLaser.laser.x = data.x
//   moveLaser.laser.y = data.y
//   moveLaser.laser.angle = data.angle
// }

// // Remove player
// function onRemovePlayer (data) {
//   var removePlayer = playerById(data.id)

//   // Player not found
//   if (!removePlayer) {
//     console.log('Player not found: ', data.id)
//     return
//   }

//   removePlayer.player.kill()

//   // Remove player from array
//   enemies.splice(enemies.indexOf(removePlayer), 1)
// }

// function update () {
//   for (var i = 0; i < enemies.length; i++) {
//     if (enemies[i].alive) {
//       enemies[i].update()
//       game.physics.arcade.collide(player, enemies[i].player)
//     }
//   }

//   for (var l = 0; l < lasers.length; l++) {
//     //if (lasers[l].alive) {
//       //lasers[l].update()
//       //socket.emit('move laser', { x: lasers[l].x, y: lasers[l].y, angle: lasers[l].angle })
//       //game.physics.arcade.collide(player, lasers[i].player)
//     //}
//   }


//   if (cursors.left.isDown) {
//     player.angle -= 4
//   } else if (cursors.right.isDown) {
//     player.angle += 4
//   }

//   if (cursors.up.isDown) {
//     // The speed we'll travel at
//     currentSpeed = 300
//   } else {
//     if (currentSpeed > 0) {
//       currentSpeed -= 4
//     }
//   }

//   game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity)

//   if (currentSpeed > 0) {
//     player.animations.play('move')
//   } else {
//     player.animations.play('stop')
//   }

//   space.tilePosition.x = -game.camera.x
//   space.tilePosition.y = -game.camera.y

//   //if (game.input.activePointer.isDown) {
//   //  if (game.physics.arcade.distanceToPointer(player) >= 10) {
//   //    currentSpeed = 300

//   //    player.rotation = game.physics.arcade.angleToPointer(player)
//   //  }
//   //}

//   //Fire Arrow
//   if(game.input.activePointer.isDown){
//     fireLaser();
//   }

//   socket.emit('move player', { x: player.x, y: player.y, angle: player.angle })
  
// }

// function render () {

// }

// // Find player by ID
// function playerById (id) {
//   for (var i = 0; i < enemies.length; i++) {
//     if (enemies[i].player.name === id) {
//       return enemies[i]
//     }
//   }

//   return false
// }

// // Find laser by ID
// function laserById (id) {
//   var i
//   for (i = 0; i < lasers.length; i++) {
//     if (lasers[i].id === id) {
//       return lasers[i]
//     }
//   }
//   return false
// }

// function fireLaser(){
//   //Fire Laser
//   if(game.time.now > laserTime){
//       newLaser = game.add.sprite(player.body.x + 60, player.body.y + 30, 'laser')
//       newLaser.anchor.setTo(0.5, 0.5)
//       game.physics.enable(newLaser, Phaser.Physics.ARCADE)
//       newLaser.body.immovable = true
//       newLaser.body.collideWorldBounds = false
//       newLaser.lifespan = 2000;
//       newLaser.rotation = player.rotation;
//       game.physics.arcade.velocityFromRotation(player.rotation, 400, newLaser.body.velocity);
//       laserTime = game.time.now + 500;
//       //console.log('First Step')
//       socket.emit('new laser', {x: newLaser.x, y: newLaser.y, angle: newLaser.angle})
//   }  
// }