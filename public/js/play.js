var playState = {

	create: function(){

		  //socket = io.connect()

      // Our tiled scrolling background
      space = game.add.tileSprite(0, 0, 6144, 6144, 'space');
      //space.fixedToCamera = true;

      // Resize our game world to be a 2000 x 2000 square
      game.world.setBounds(0, 0, 6144, 6144);

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

      console.log(player);
      game.camera.follow(player.player);
      //game.camera.deadzone = new Phaser.Rectangle(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
      //game.camera.focusOnXY(player.x, player.y)
      //game.camera.deadzone = new Phaser.Rectangle(500, 500, 500, 500);

      cursors = game.input.keyboard.createCursorKeys();
      game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

      // Start listening for events
      //setEventHandlers()
      onLobbyJoined();

      minimap = new MiniMap(game);
      //createMiniMap();


	},

	update: function(){

    //updateUnitDots(player,enemies);

		//-----------TEST ITEM---------//
    //game.physics.arcade.collide(player, rock, changeHealth, null, this);                
    for(var i = 0; i < enemies.length; i++){
      if (enemies[i].alive) {
        enemies[i].update()                
        game.physics.arcade.collide(player.player, enemies[i].player, crashPlayers, null, this)    
        game.physics.arcade.collide(newLasers, enemies[i].player, damageEnemy, null, this);                  
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

  enemyDamaged.takeDamage(enemyDamaged.healthbar.getPercentage())
  socket.emit('take damage', { damageType: 'laser', enemy: e.name, laser: l.name })
  l.kill();   
  // }
}

function isEven(n) {
   return n % 2 == 0;
}


// function createMiniMap() {    
//   miniMapContainer = game.add.group();    
//   resolution = 2 / 100;    
//   if (game.world.width > 8000) {        
//     var renderWH = 8000;    
//   } else {       
//     var renderWH = game.world.width;    
//   }    
//   renderTexture = game.add.renderTexture(renderWH, renderWH);    
//   renderTexture.resolution = resolution;    
//   var cropRect = new Phaser.Rectangle(0, 0, 200, 200);    
//   renderTexture.crop = cropRect;    
//   var miniMapY = game.camera.view.height - (game.world.height * resolution);    
//   var miniMapUI = game.add.image(0, 0, 'mini_map');    
//   renderTexture.trueWidth = renderTexture.resolution * game.world.width;    
//   renderTexture.trueHeight = renderTexture.resolution * game.world.height;    
//   var cropRect = new Phaser.Rectangle(0, 0, renderTexture.trueWidth, renderTexture.trueHeight);    
//   renderTexture.crop = cropRect;    
//   var miniWidth = .075 * renderTexture.trueWidth;    
//   var miniHeight = miniMapY - (.06 * renderTexture.trueHeight);    
//   miniMap = game.add.sprite(miniWidth, miniHeight, renderTexture);    
//   var padding = .241 * renderTexture.trueHeight;    
//   miniMapUI.width = (renderTexture.trueWidth + padding);    
//   miniMapUI.height = (renderTexture.trueHeight + padding);    
//   miniMapUI.y = game.camera.view.height - miniMapUI.height;    
//   miniMapUI.fixedToCamera = true;    
//   miniMap.fixedToCamera = true;    
//   viewRect = game.add.graphics(0, 0);    
//   viewRect.lineStyle(1, 0xFFFFFF);    
//   viewRect.drawRect(miniMap.x, miniMap.y, game.camera.view.width * resolution, game.camera.view.height * resolution);    
//   unitDots = game.add.graphics(miniMap.x, miniMap.y);    
//   unitDots.fixedToCamera = true;    
//   var bg = game.add.graphics(0, 0);    
//   bg.beginFill(0x000000, 1);    
//   bg.drawRect(0, miniMapUI.y + (miniMapUI.height * .1), miniMapUI.width * .95, miniMapUI.height * .9);    
//   bg.fixedToCamera = true;    
//   var children = [bg, miniMap, unitDots, viewRect, miniMapUI];    
//   miniMapContainer.addMultiple(children);
// }


// function updateUnitDots(player,enemies) {    
//   unitDots.clear();            
//   var unitMiniX = player.player.x * renderTexture.resolution;        
//   var unitMiniY = player.player.y * renderTexture.resolution;    
//   var color = '0x6cf641';    
//   unitDots.beginFill(color);   
//   unitDots.drawEllipse(unitMiniX, unitMiniY, 2, 2);    
//   for(var i = 0; i < enemies.length; i++){
//     if(enemies[i].alive){
//       var eunitMiniX = enemies[i].player.x * renderTexture.resolution;        
//       var eunitMiniY = enemies[i].player.y * renderTexture.resolution;    
//       var color = '0x1f99f7';  
//       unitDots.beginFill(color);  
//       unitDots.drawEllipse(eunitMiniX, eunitMiniY, 2, 2);           
//     }
//   }       
// }
