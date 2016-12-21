var playState = {

	create: function(){

		  //socket = io.connect()

      // Our tiled scrolling background
      space = game.add.tileSprite(0, 0, 6144, 6144, 'space');
      //space.fixedToCamera = true;

      // Resize our game world to be a 2000 x 2000 square
      game.world.setBounds(0, 0, 6144, 6144);

      player = new LocalPlayer(game);
      //weapon = new Weapon.SingleBullet(game);

      weapons = [];
      weapons.push(new Weapon.SingleBullet(game));
      weapons.push(new Weapon.Beam(game));

      currentWeapon = 0;

      // for(var i = 1; i < weapons.length; i++){
      //   weapons[i].visible = false;
      // }

      weapons[currentWeapon].visible = true;

      //-----------TEST ITEM---------//
      rock = game.add.sprite(450, 450, 'rock')
      rock.anchor.setTo(0.5, 0.5)
      game.physics.enable(rock, Phaser.Physics.ARCADE);
      rock.enableBody = true; 
      rock.body.immovable = false;
      rock.body.drag.setTo(500, 500)
      rock.bringToTop()

      // var rock_array = [];
      // var index = 0;
      // for(var i = 0; i < gridLinesHorizontal; i++){
      //   for (var j = 0; j < gridLinesVertical; j++){        
      //     rock_array.push(new Phaser.Point(i * gridSize, j * gridSize));    
      //   }
      // } 

      // Phaser.Utils.shuffle(rock_array); 

      // if(spawn){    
      //   spawnAtPos(rock_array[index]);    
      //   index++;    
      //   if (index === rock_array.length) {       
      //     index = 0;        
      //     Phaser.Utils.shuffle(rock_array);    
      //   }
      // }

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

      //console.log(player);
      game.camera.follow(player.player);
      //game.camera.deadzone = new Phaser.Rectangle(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
      //game.camera.focusOnXY(player.x, player.y)
      //game.camera.deadzone = new Phaser.Rectangle(500, 500, 500, 500);

      if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick1 = pad.addStick(0, 0, 100, 'arcade');
        stick1.scale = 1;
        stick1.alignBottomLeft(48);
        stick2 = pad.addStick(0, 0, 100, 'arcade');
        stick2.scale = 1;
        stick2.alignBottomRight(48);
      }else{
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
      }

      // Start listening for events
      //setEventHandlers()
      onLobbyJoined();
      
      minimap = new MiniMap(game);

      manager = this.game.plugins.add(Phaser.ParticleStorm);
      var data = {
        lifespan: { min: 500, max: 2000 },
        image: ['flare_diamond', 'flare_point', 'flare_vertical'],
        scale: { min: 0.2, max: 0.4 },
        rotation: { delta: 3 },
        velocity: { radial: { arcStart: -90, arcEnd: 90 }, initial: { min: 3, max: 6 }, control: [ { x: 0, y: 1 }, { x: 0.5, y: 0.5 }, { x: 1, y: 0 } ]  }
      };
      manager.addData('ship_explosion', data);
      emitter = manager.createEmitter();
      //emitter.force.y = 0.1;
      emitter.addToWorld();

	},

	update: function(){

    //updateUnitDots(player,enemies);

    //-----------TEST ITEM---------//
    game.physics.arcade.collide(player.player, rock, playerHitObstacle, null, this);   

    for(var i = 0; i < enemies.length; i++){
      if (enemies[i].alive) {
        enemies[i].update()                
        //game.physics.arcade.collide(player.player, enemies[i].player, crashPlayers, null, this)    
        //game.physics.arcade.collide(newLasers, enemies[i].player, damageEnemy, null, this); 
        game.physics.arcade.collide(weapons[currentWeapon], enemies[i].player, damageEnemy, null, this);      
        game.physics.arcade.collide(enemies[i].player, rock, enemyHitObstacle, null, this);               
      }
    }
        
    minimap.update(player,enemies)

    player.update();

    space.tilePosition.x = -game.camera.x
    space.tilePosition.y = -game.camera.y

    //if (game.input.activePointer.isDown) {
    //  if (game.physics.arcade.distanceToPointer(player) >= 10) {
    //    currentSpeed = 300

    //    player.rotation = game.physics.arcade.angleToPointer(player)
    //  }
    //}

    if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      if(stick2.isDown){
        weapons[currentWeapon].fire(player.player);
        //player.fireLaser(enemies);
      }
    }else{
      //Fire Laser
      if(game.input.activePointer.isDown){
        weapons[currentWeapon].fire(player.player);
        //player.fireLaser(enemies);
      }
    }

	},

  shutdown: function() {  
    player.player.destroy();
    for(var i = 0; i < enemies.length; i++){
      if (enemies[i].alive) {
        enemies[i].player.destroy();                             
      }
    }
  }

}


var setEventHandlers = function () {
  // Socket connection successful
  socket.on('connect', onSocketConnected)

  // Socket disconnection
  socket.on('disconnect', onSocketDisconnect)

  // New player message received
  socket.on('new player', onNewPlayer)

  // New player message received
  socket.on('lobby joined', onLobbyJoined)

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

  socket.on('player count', function(data) {
      playerCount = data.num_of_players;
  });

  socket.on('player team', function(data) {
      team = data.team;
  });

}


// Socket connected
function onSocketConnected () {
  console.log('Connected to socket server')  
  // // Reset enemies on reconnect
  // enemies.forEach(function (enemy) {
  //   enemy.player.kill()
  // })
  // enemies = []

  // // Reset lasers on reconnect
  // lasers.forEach(function (laser) {
  //   laser.laser.kill()
  // })
  // lasers = []

  // // Send local player data to the game server
  // //console.log('Player picked ship: ' + ship_ver)
  //socket.emit('new player', { team: team })
}


function onLobbyJoined () {
  console.log('Lobby Joined')

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
  socket.emit('new player', { x: player.x, y: player.y, angle: player.angle, ver: ship_ver, health: 100, team: team, username: username })
}


// Socket disconnected
function onSocketDisconnect () {
  console.log('Disconnected from socket server')
}


// New player
function onNewPlayer (data) {
  console.log('New player connected: ', data.id)
  console.log('Total Players: ', data.num_of_players)
  //console.log('New player uses: ', data.ver)

  // Avoid possible duplicate players
  var duplicate = playerById(data.id)
  if (duplicate) {
    console.log('Duplicate player!')
    return
  }
  // Add new player to the remote players array
  enemies.push(new RemotePlayer(data.id, game, data.x, data.y, data.angle, data.ver, data.health, data.team, data.username))
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
  //data.laser.sprite.kill()

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
    player.takeDamage(data.health,emitter)
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
  console.log('Total Players: ', data.num_of_players)

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
  console.log('Enemy Hit!')
  var enemyDamaged = playerById(e.name)

  // Player not found
  if (!enemyDamaged) {
    console.log('Laser not found: ', e.name)
    return
  }

  enemyDamaged.takeDamage(enemyDamaged.healthbar.getPercentage(),emitter)
  socket.emit('take damage', { damageType: 'laser', enemy: e.name, laser: l.name })
  l.kill();   
  // }
}

function isEven(n) {
   return n % 2 == 0;
}


function playerHitObstacle(p, r){
  player.destroyPlayer(emitter);
}


function enemyHitObstacle(e, r){
  var enemyDestroyed = playerById(e.name)

  // Player not found
  if (!enemyDestroyed) {
    console.log('Laser not found: ', e.name)
    return
  }

  enemyDestroyed.destroyPlayer(emitter);
}