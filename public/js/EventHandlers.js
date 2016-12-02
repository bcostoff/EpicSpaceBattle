/* global game */

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

window.eventHandlers = eventHandlers
