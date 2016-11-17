var playState = {

	create: function(){

		  socket = io.connect()

          // Resize our game world to be a 2000 x 2000 square
          game.world.setBounds(0, 0, 6144, 6144)


          // Our tiled scrolling background
          space = game.add.tileSprite(0, 0, 6144, 6144, 'space')
          space.fixedToCamera = true

          // The base of our player
          var startX = Math.round(Math.random() * (1000) - 500)
          var startY = Math.round(Math.random() * (1000) - 500)
          if(ship_ver == 1){
            player = game.add.sprite(startX, startY, 'dude')            
          }else if(ship_ver == 2){
            player = game.add.sprite(startX, startY, 'dude-alt')
          }
          player.scale.setTo(0.5, 0.5);
          player.anchor.setTo(0.5, 0.5)
          player.animations.add('move', [0], 0, true)
          player.animations.add('stop', [0], 0, true)

          // This will force it to decelerate and limit its speed
          // player.body.drag.setTo(200, 200)
          game.physics.enable(player, Phaser.Physics.ARCADE);
          player.body.maxVelocity.setTo(400, 400)
          player.body.collideWorldBounds = true
          

          // rock = game.add.sprite(100, 100, 'rock')
          // rock.anchor.setTo(0.5, 0.5)
          // game.physics.enable(rock, Phaser.Physics.ARCADE);
          // rock.enableBody = true; 
          // rock.body.immovable = true;
          // rock.bringToTop()

          // Create some baddies to waste :)
          enemies = []
          lasers = []

          var barConfig = {x: (window.innerWidth * window.devicePixelRatio)/2, y: 50};
          healthbar = new HealthBar(game, barConfig);
          healthbar.barSprite.fixedToCamera = true;
          healthbar.bgSprite.fixedToCamera = true;

          game.camera.follow(player)
          //game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300)
          game.camera.deadzone = new Phaser.Rectangle(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
          //game.camera.focusOnXY(0, 0)

          cursors = game.input.keyboard.createCursorKeys()
          game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

          // Start listening for events
          setEventHandlers()

	},

	update: function(){

		
        //game.physics.arcade.collide(player, rock, changeHealth, null, this);                

        for(var i = 0; i < enemies.length; i++){
            if (enemies[i].alive) {
                enemies[i].update()                
                game.physics.arcade.collide(player, enemies[i].player)    
                game.physics.arcade.collide(newLaser, enemies[i].player, damageEnemy, null, this);                
            }
        }
        

        if(cursors.left.isDown){
            player.angle -= 4
        }else if(cursors.right.isDown) {
            player.angle += 4
        }


        if (cursors.up.isDown){
            // The speed we'll travel at
            currentSpeed = 400
        }else{
            if (currentSpeed > 0) {
                currentSpeed -= 4
            }
        }


        game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity)

        if(currentSpeed > 0){
            player.animations.play('move')
        }else{
            player.animations.play('stop')
        }


        space.tilePosition.x = -game.camera.x
        space.tilePosition.y = -game.camera.y


        //if (game.input.activePointer.isDown) {
        //  if (game.physics.arcade.distanceToPointer(player) >= 10) {
        //    currentSpeed = 300

        //    player.rotation = game.physics.arcade.angleToPointer(player)
        //  }
        //}


        //Fire Laser
        if(game.input.activePointer.isDown){
            fireLaser(enemies);
        }

        socket.emit('move player', { x: player.x, y: player.y, angle: player.angle, ver: ship_ver, health: healthbar.getPercentage() })
		

	},


    // render: function(){

    // }

}


var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('new player', onNewPlayer)

  // Player move message received
  socket.on('move player', onMovePlayer)

  // Player move message received
  socket.on('move laser', onMoveLaser)

  // Player removed message received
  socket.on('remove player', onRemovePlayer)

  // New laser message received
  socket.on('new laser', onNewLaser)

  // Take Damage message received
  socket.on('take damage', onTakeDamage)
}

// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')

  // Reset enemies on reconnect
  enemies.forEach(function (enemy) {
    enemy.player.kill()
  })
  enemies = []

  // Reset lasers on reconnect
  lasers.forEach(function (laser) {
    laser.laser.kill()
  })
  lasers = []

  // Send local player data to the game server
  //console.log('Player picked ship: ' + ship_ver)
  socket.emit('new player', { x: player.x, y: player.y, angle: player.angle, ver: ship_ver, health: 100 })
}

// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}

// New player
function onNewPlayer (data) {
  console.log('New player connected: ', data.id)
  //console.log('New player uses: ', data.ver)

  // Avoid possible duplicate players
  var duplicate = playerById(data.id)
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }
  // Add new player to the remote players array
  enemies.push(new RemotePlayer(data.id, game, player, healthbar, data.x, data.y, data.angle, data.ver, data.health))
}

// Move player
function onMovePlayer (data) {
  var movePlayer = playerById(data.id)

  // Player not found
  if (!movePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  // Update player position
  movePlayer.player.x = data.x
  movePlayer.player.y = data.y
  movePlayer.player.angle = data.angle
}


// Take player damage
function onTakeDamage (data) {
  //Kill Laser
  newLaser.kill()

  // var damagePlayer = playerById(data.id)

  // // Player not found
  // if (!damagePlayer) {
  //   console.log('Player not found: ', data.id)
  //   return
  // }

  // // Update player position
  // damagePlayer.player.x = data.x
  // damagePlayer.player.y = data.y
  // damagePlayer.player.angle = data.angle
  
  if(data.health == 0){
    //socket.emit('disconnect')
    game.state.start('dead');    
  }else{
    healthbar.setPercent(data.health) 
  }  
}

// New laser
function onNewLaser (data) {
  // Add new player to the players array
  var duplicate = laserById(data.id)
  if (duplicate) {
    console.log('Duplicate laser!')
    return
  }
  //console.log('New Laser: ', data.id)
  //console.log('Creating new laser')
  lasers.push(new RemoteLaser(data.id, game, laser, data.x, data.y, data.angle))
  lasers.splice(lasers.indexOf(data.id), 1)
}

// Move laser
function onMoveLaser (data) {
  var moveLaser = laserById(data.id)

  // Player not found
  if (!moveLaser) {
    console.log('Laser not found: ', data.id)
    return
  }

  // Update laser position
  moveLaser.laser.x = data.x
  moveLaser.laser.y = data.y
  moveLaser.laser.angle = data.angle
}

// Remove player
function onRemovePlayer (data) {
  var removePlayer = playerById(data.id)

  // Player not found
  if (!removePlayer) {
    console.log('Player not found: ', data.id)
    return
  }

  removePlayer.player.kill()

  // Remove player from array
  enemies.splice(enemies.indexOf(removePlayer), 1)
}


// Take Damage
// function onTakeDamage (data) {
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


// Find player by ID
function playerById (id) {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].player.name === id) {
      return enemies[i]
    }
  }

  return false
}

// Find laser by ID
function laserById (id) {
  var i
  for (i = 0; i < lasers.length; i++) {
    if (lasers[i].id === id) {
      return lasers[i]
    }
  }
  return false
}

function fireLaser(){
  //Fire Laser
  if(game.time.now > laserTime){
      if(ship_ver == 1){
        newLaser = game.add.sprite(player.body.x + 35, player.body.y + 35, 'laser')
      }else if(ship_ver == 2){
        newLaser = game.add.sprite(player.body.x + 40, player.body.y + 40, 'laser-alt')
      }      
      newLaser.enableBody = true; 
      newLaser.anchor.setTo(0.5, 0.5)
      game.physics.enable(newLaser, Phaser.Physics.ARCADE)
      newLaser.body.collideWorldBounds = false
      newLaser.lifespan = 2000;
      newLaser.rotation = player.rotation;      
      newLaser.angle = player.angle
      game.physics.arcade.velocityFromRotation(player.rotation, 800, newLaser.body.velocity);
      laserTime = game.time.now + 100;
      socket.emit('new laser', {x: newLaser.x, y: newLaser.y, angle: newLaser.angle})
  }  
}

function damageEnemy(laser, enemy){
  //console.log(enemy.name)
    // console.log('Enemy Hit!')
    // if(Math.abs(laser.body.velocity.x) > 0 && Math.abs(laser.body.velocity.y) > 0) {       
       socket.emit('take damage', { damageType: 'laser', enemy: enemy.name, laser: laser.name })
       laser.kill();
    // }
}

// function changeHealth(player, rock){
//   if(game.time.now > healthTime){
//     oldHealth = healthbar.getPercentage();
//     newHealth = oldHealth - 10;
//     healthbar.setPercent(newHealth)
//     healthTime = game.time.now + 500;
//   }
// }
  