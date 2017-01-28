var playState = {

	create: function(){

		  //socket = io.connect()

      //-----------CREATE GAMEWORLD---------//
      //space = game.add.tileSprite(0, 0, 4000, 4000, 'space');
      space = game.add.sprite(0, 0, 'space') 
      //space.fixedToCamera = true;

      // Resize our game world to be a 2000 x 2000 square
      game.world.setBounds(0, 0, 4000, 4000);

      planet = game.add.sprite(-1200, 700, 'planet')         


      //-----------NEW LOCAL PLAYER---------//
      player = new LocalPlayer(game);



      //-----------CREATE WEAPONS ARRAY---------//
      weapons = [];
      weapons.push(new Weapon.SingleBullet(game));
      weapons.push(new Weapon.Beam(game));
      weapons.push(new Weapon.SingleCapitalBullet(game));

      currentWeapon = 0;

      // for(var i = 1; i < weapons.length; i++){
      //   weapons[i].visible = false;
      // }

      weapons[currentWeapon].visible = true;


      //-----------TEST OBSTACLES---------//
      obs_1 = [
        [200, 220],
        [900, 900],
        [480, 480],
        [1100, 1260],
        [2000, 1560],
        [2100, 1460],
        [1200, 1600],
        [1200, 1800],
        [2100, 1700],
        [2280, 2750],
        [1300, 840],
        [450, 1900],
        [2600, 1000],
        [2280, 100],
        [1500, 800],
        [1450, 2280]
      ];

      obstacles = game.add.group();

      for(var i = 0; i < obs_1.length; i++){
        var tmp = game.add.sprite(obs_1[i][0], obs_1[i][1], 'rock')
        tmp.anchor.setTo(0.5, 0.5)
        game.physics.enable(tmp, Phaser.Physics.ARCADE);
        tmp.enableBody = true; 
        tmp.body.immovable = false;
        tmp.body.drag.setTo(500, 500)
        tmp.bringToTop()
        obstacles.add(tmp)
      }



      //-----------TEST ITEM---------//
      item = game.add.sprite(600, 600, 'item')
      item.anchor.setTo(0.5, 0.5)
      game.physics.enable(item, Phaser.Physics.ARCADE);
      item.enableBody = true; 
      item.body.immovable = false;
      item.body.drag.setTo(500, 500)
      item.bringToTop()



      //-----------CAPITAL SHIPS---------//
      capitalG = new LocalCapitalShip(game,'green');
      capitalB = new LocalCapitalShip(game,'blue');



      //-----------ENEMY SHIPS/LASER ARRAY---------//
      enemies = []
      lasers = []

      // newLasers = game.add.group();
      // newLasers.enableBody = true;
      // newLasers.physicsBodyType = Phaser.Physics.ARCADE;     
      // if(ship_ver == 1){    
      //   newLasers.createMultiple(1000,'laser');
      // }else if(ship_ver == 2){
      //   newLasers.createMultiple(1000,'laser-alt');
      // }
      // newLasers.setAll('checkWorldBounds', true);
      // newLasers.setAll('outOfBoundsKill', true);   




      //-----------CAMERA CONTROLS---------//
      //This will work
      //game.camera.follow(player.player)


      //game.camera.deadzone = new Phaser.Rectangle(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
      //game.camera.focusOnXY(player.player.x, player.player.y)
      //game.camera.deadzone = new Phaser.Rectangle(500, 500, 500, 500);


      var edge = 100;
      game.camera.deadzone = new Phaser.Rectangle(edge, edge, game.camera.width - (edge * 2), game.camera.height - (edge * 2));
      game.camera.focusOn(player.player);

      //if (this.game.device.desktop) {
        // Only autofollow if we're on desktop.
        game.camera.follow(player.player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT)
      //}



      //-----------JOYSTICK FOR MOBILE---------//
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


      //-----------LOBBY JOINED---------//
      onLobbyJoined();


      
      //-----------INITIALISE MINIMAP---------//
      minimap = new MiniMap(game);



      //-----------CREATE PARTICLE MANAGER---------//
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

    //-----------TEST OBSTACLE---------//
    game.physics.arcade.collide(player.player, obstacles, playerHitObstacle, null, this);             


    //-----------ACTIVATE ITEM---------//    
    game.physics.arcade.collide(weapons[currentWeapon], item, activateItem, null, this);      
    game.physics.arcade.collide(player.player, item, playerHitObstacle, null, this);      


    //-----------CAPITAL SHIP COLLISIONS---------//
    game.physics.arcade.collide(weapons[currentWeapon], capitalB.capitalShip, damageCapitalShip, null, this);   
    game.physics.arcade.collide(weapons[currentWeapon], capitalG.capitalShip, damageCapitalShip, null, this);   


    //-----------PLAYER COLLISIONS---------//
    game.physics.arcade.collide(weapons[2], player.player, takeHeavyDamage, null, this);      


    //-----------ENEMY COLLISIONS---------//
    for(var i = 0; i < enemies.length; i++){
      if (enemies[i].alive) {
        enemies[i].update()                
        //game.physics.arcade.collide(player.player, enemies[i].player, crashPlayers, null, this)     
        game.physics.arcade.collide(weapons[2], enemies[i].player, damageEnemy, null, this);      
        game.physics.arcade.collide(weapons[currentWeapon], enemies[i].player, damageEnemy, null, this);      
        game.physics.arcade.collide(enemies[i].player, rock, enemyHitObstacle, null, this);               
      }
    }
      


    //-----------MINIMAP UPDATE---------//    
    minimap.update(player,enemies,capitalG,capitalB)



    //-----------PLAYER UPDATE---------//
    player.update();



    //-----------CAPITAL SHIP UPDATE---------//
    capitalB.update(player);
    capitalG.update(player);



    //-----------SCROLL BACKGROUND---------//
    //space.tilePosition.x = -game.camera.x
    //space.tilePosition.y = -game.camera.y

    //if (game.input.activePointer.isDown) {
    //  if (game.physics.arcade.distanceToPointer(player) >= 10) {
    //    currentSpeed = 300

    //    player.rotation = game.physics.arcade.angleToPointer(player)
    //  }
    //}


    //-----------FIRE WEAPONS---------//
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
        enemies[i].player.kill();    
        enemies[i].player.destroy();                             
      }
    }
  }

}



//-----------EVENT HANDLERS---------//
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

  // New item destroyed message received
  socket.on('item destoryed', onItemDestroyed)

  // Take Damage message received
  socket.on('take damage', onTakeDamage)

  // Take Damage message received
  socket.on('take capital damage', onTakeCapitalDamage)

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


// Take capital damage
function onTakeCapitalDamage (data) {  
  // if(data.health == 0){
  //   //socket.emit('disconnect')
  //   //game.state.start('dead');    
  // }else{
    if(data.team == 'green'){
      capitalG.takeCapitalDamage(data.health,emitter)
    }else{
      capitalB.takeCapitalDamage(data.health,emitter)
    }    
  //}  
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
  lasers.push(new RemoteLaser(data.id, game, laser, data.x, data.y, data.angle, data.type))
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

function damageCapitalShip(c, w){
  //console.log('Capital Ship Hit')
  w.kill();
  if(player.team == 'green' && c.name == 'green'){
    //Do Nothing
  }else if(player.team == 'green' && c.name == 'blue'){
    capitalB.takeCapitalDamage(capitalB.healthbar.getPercentage(),emitter)
  }else if(player.team == 'blue' && c.name == 'blue'){
    //Do Nothing
  }else if(player.team == 'green' && c.name == 'green'){
    capitalG.takeCapitalDamage(capitalG.healthbar.getPercentage(),emitter)
  }
  socket.emit('take capital damage', { damageType: 'laser' })  
}

function isEven(n) {
   return n % 2 == 0;
}


function playerHitObstacle(p, r){
  player.destroyPlayer(emitter);
}


function activateItem(w, i){
  i.kill();
  emitter.emit('ship_explosion', i.x, i.y, { total: 32 });
  i.destroy();
  socket.emit('item destroyed')
  currentWeapon = 1;
  setTimeout(function(){ 
    //-----------TEST ITEM---------//
    item = game.add.sprite(600, 600, 'item')
    item.anchor.setTo(0.5, 0.5)
    game.physics.enable(item, Phaser.Physics.ARCADE);
    item.enableBody = true; 
    item.body.immovable = false;
    item.body.drag.setTo(500, 500)
    item.bringToTop()
    currentWeapon = 0;
  }, 20000);
}


function onItemDestroyed(){
  item.kill();
  emitter.emit('ship_explosion', item.x, item.y, { total: 32 });
  item.destroy();
  setTimeout(function(){ 
    //-----------TEST ITEM---------//
    item = game.add.sprite(600, 600, 'item')
    item.anchor.setTo(0.5, 0.5)
    game.physics.enable(item, Phaser.Physics.ARCADE);
    item.enableBody = true; 
    item.body.immovable = false;
    item.body.drag.setTo(500, 500)
    item.bringToTop()
  }, 20000);
}


function takeHeavyDamage(p, l){
  l.kill();
  console.log(player.healthbar.getPercentage());
  if(player.healthbar.getPercentage() == 0){
    //socket.emit('disconnect')
    game.state.start('dead');    
  }else{
    newHealth = player.healthbar.getPercentage() - 10;
    player.takeDamage(newHealth,emitter)
  }  
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


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
