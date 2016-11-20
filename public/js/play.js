var playState = {

	create: function(){

		  socket = io.connect()

      // Resize our game world to be a 2000 x 2000 square
      game.world.setBounds(0, 0, 6144, 6144)

      // Our tiled scrolling background
      space = game.add.tileSprite(0, 0, 6144, 6144, 'space')
      space.fixedToCamera = true

      player = new LocalPlayer(game);

      //-----------TEST ITEM---------//
      // rock = game.add.sprite(100, 100, 'rock')
      // rock.anchor.setTo(0.5, 0.5)
      // game.physics.enable(rock, Phaser.Physics.ARCADE);
      // rock.enableBody = true; 
      // rock.body.immovable = true;
      // rock.bringToTop()

      // Create some baddies to waste :)
      enemies = []
      lasers = []

      newLasers = game.add.group();
      newLasers.enableBody = true;
      newLasers.physicsBodyType = Phaser.Physics.ARCADE;     
      if(ship_ver == 1){    
        newLasers.createMultiple(1000,'laser');
      }else if(ship_ver == 2){
        newLasers.createMultiple(1000,'laser-alt');
      }
      newLasers.setAll('checkWorldBounds', true);
      newLasers.setAll('outOfBoundsKill', true);   

      game.camera.follow(player.sprite)
      game.camera.deadzone = new Phaser.Rectangle(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
      //game.camera.focusOnXY(player.x, player.y)

      cursors = game.input.keyboard.createCursorKeys()
      game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

      // Start listening for events
      setEventHandlers()

	},

	update: function(){

		//-----------TEST ITEM---------//
    //game.physics.arcade.collide(player, rock, changeHealth, null, this);                
    for(var i = 0; i < enemies.length; i++){
      if (enemies[i].alive) {
        enemies[i].update()                
        game.physics.arcade.collide(player.player, enemies[i].player, crashPlayers, null, this)    
        game.physics.arcade.collide(newLasers, enemies[i].player, damageEnemy, null, this);        
        //game.physics.arcade.collide(newLaser, enemies[i].player, damageEnemy, null, this);                
      }
    }
        
    player.update();

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
      player.fireLaser(enemies);
    }


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
  enemies.push(new RemotePlayer(data.id, game, data.x, data.y, data.angle, data.ver, data.health))
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
  data.laser.kill()

  var damagePlayer = playerById(data.id)

  // Player not found
  // if (!damagePlayer) {
  //   console.log('Player not found: ', data.id)
  //   return
  // }

  // // Update player health
  // damagePlayer.takeDamage(data.health)
  
  if(data.health == 0){
    //socket.emit('disconnect')
    game.state.start('dead');    
  }else{
    player.takeDamage(data.health)
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

function damageEnemy(e, l){
  //console.log(e.name)
   console.log('Enemy Hit!')
  // if(Math.abs(laser.body.velocity.x) > 0 && Math.abs(laser.body.velocity.y) > 0) {  

  //socket.emit('take damage', { damageType: 'laser', enemy: e.name, laser: l.name })
  l.kill();   
  // }
}


function crashPlayers(player, enemy){
  //console.log(enemy.name)
    // console.log('Enemy Hit!')
    // if(Math.abs(laser.body.velocity.x) > 0 && Math.abs(laser.body.velocity.y) > 0) {  
    //socket.emit('take damage', { damageType: 'laser', enemy: enemy.name, laser: laser.name })
    //laser.kill();   
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
  