var util = require('util')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var io = require('socket.io')

var Player = require('./Player')
var Laser = require('./Laser')

var port = process.env.PORT || 3000

/* ************************************************
** GAME VARIABLES
************************************************ */
var socket	// Socket controller
var players	// Array of connected players
var lasers // Array of lasers
var num_of_players = 0 // Player count
//var team // Team

/* ************************************************
** GAME INITIALISATION
************************************************ */

// Create and start the http server
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err
  }

  init()
})

function init () {
  // Create an empty array to store players
  players = []
  lasers = []

  // Attach Socket.IO to server
  socket = io.listen(server)

  // Start listening for events
  setEventHandlers()
}

/* ************************************************
** GAME EVENT HANDLERS
************************************************ */
var setEventHandlers = function () {
  // Socket.IO
  socket.sockets.on('connection', onSocketConnection)
}

// New socket connection
function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id)
  var team = '';
  if(isEven(num_of_players)){
    team = 'green';
  }else{
    team = 'blue';
  }
  num_of_players++; 

  // Listen for client disconnected
  client.on('disconnect', onClientDisconnect)

  // Listen for new player message
  client.on('new player', onNewPlayer)

  // Listen for move player message
  client.on('move player', onMovePlayer)

  // Listen for move laser message
  client.on('move laser', onMoveLaser)

  // Listen for move laser message
  client.on('new laser', onNewLaser)

  // Listen for take Damage
  client.on('take damage', onTakeDamage)

  client.emit('player team', { team: team });  
  socket.emit('player count', { num_of_players: num_of_players })

}


// Socket client has disconnected
function onClientDisconnect () {
  num_of_players--;
  util.log('Player has disconnected: ' + this.id)

  var removePlayer = playerById(this.id)

  // Player not found
  if (!removePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1)

  // Broadcast removed player to connected socket clients
  this.broadcast.emit('remove player', {id: this.id, num_of_players: num_of_players})
}


// New player has joined
function onNewPlayer (data) {
  // Create a new player
  var newPlayer = new Player(data.x, data.y, data.angle, data.ver, data.health, data.team, data.username)
  newPlayer.id = this.id
  console.log('New player ' + newPlayer.id + ' uses: ' + newPlayer.getVer())

  // Broadcast new player to connected socket clients
  this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), angle: newPlayer.getAngle(), ver: newPlayer.getVer(), health: newPlayer.getHealth(), team: newPlayer.getTeam(), username: newPlayer.getUsername()})

  // Send existing players to the new player
  var i, existingPlayer
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i]
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), angle: existingPlayer.getAngle(), ver: existingPlayer.getVer(), health: existingPlayer.getHealth(), team: existingPlayer.getTeam(), num_of_players: num_of_players, username: existingPlayer.getUsername()})
    console.log('Existing player ' + existingPlayer.id + ' uses: ' + existingPlayer.getVer())
  }
   
  // Add new player to the players array
  players.push(newPlayer)
}



// New player has joined
function onNewLaser (data) {
  
  // Create a new player
  var uniqid = Date.now();
  var newLaser = new Laser(data.x, data.y, data.angle)
  newLaser.id = uniqid

  // Broadcast new player to connected socket clients
  this.broadcast.emit('new laser', {id: newLaser.id, x: newLaser.getX(), y: newLaser.getY(), angle: newLaser.getAngle()})

  //Send existing lasers to the new laser
  var i, existingLaser
  for (i = 0; i < lasers.length; i++) {
   existingLaser = lasers[i]
   this.emit('new laser', {id: existingLaser.id, x: existingLaser.getX(), y: existingLaser.getY(), angle: existingLaser.getAngle()})
  }

  // Add new player to the players array
  lasers.push(newLaser)
  lasers.splice(lasers.indexOf(uniqid), 1)
}


// Player has moved
function onMovePlayer (data) {
  // Find player in array
  var movePlayer = playerById(this.id)

  // Player not found
  if (!movePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  // Update player position
  movePlayer.setX(data.x)
  movePlayer.setY(data.y)
  movePlayer.setAngle(data.angle)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), angle: movePlayer.getAngle(), ver: movePlayer.getVer(), health: movePlayer.getHealth(), username: movePlayer.getUsername()})
}


// Player taken damgage
function onTakeDamage (data) {
  // Find player in array
  //var playerDamaged = playerById(this.id)
  var playerDamaged = playerById(data.enemy)


  // Player not found
  if (!playerDamaged) {
    util.log('Player not found: ' + data.enemy)
    return
  }

  if(data.damageType == 'laser'){
    newHealth = playerDamaged.getHealth() - 10;
  }

  // Update player health
  playerDamaged.setHealth(newHealth)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('take damage', {id: playerDamaged.id, x: playerDamaged.getX(), y: playerDamaged.getY(), angle: playerDamaged.getAngle(), ver: playerDamaged.getVer(), health: playerDamaged.getHealth(), laser: data.laser, username: playerDamaged.getUsername()})
}

// Laser has moved
function onMoveLaser (data) {
  console.log('Third Step: move laser')
  // Find player in array
  var moveLaser = laserById(data.id)

  // Player not found
  if (!moveLaser) {
    util.log('Laser not found: ' + data.id)
    return
  }
  util.log('Laser found: ' + data.id)

  // Update laser position
  moveLaser.setX(data.x)
  moveLaser.setY(data.y)
  moveLaser.setAngle(data.angle)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('move laser', {id: moveLaser.id, x: moveLaser.getX(), y: moveLaser.getY(), angle: moveLaser.getAngle()})
}

/* ************************************************
** GAME HELPER FUNCTIONS
************************************************ */
// Find player by ID
function playerById (id) {
  var i
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i]
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

function isEven(n) {
   return n % 2 == 0;
}