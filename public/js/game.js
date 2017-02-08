/* global Phaser RemotePlayer io */

//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render })
// if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
// 	//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, '')
// 	var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '')
// }else{
// 	var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '')
// }
var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '')


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
var capital
var healthbar
var minimap
var playerCount = 0
var titleLabel
var team
var teamLabel
var timer
var timerEvent
var text
var username
var pad
var stick1
var stick2
//var weapon;
var weapons
var currentWeapon = 0
var weaponName = null
var dpr = window.devicePixelRatio;
if(dpr == 1){
	dpr = 1.5
}
var scaleRatio = dpr / 3
var manager = null
var emitter = null
var obstacles
var planet
var ai

// if(/(iPhone|iPod|iPad)/i.test(navigator.userAgent)){
// 	screen.orientation.lock('landscape');
// }


game.state.add('boot',bootState);
game.state.add('load',loadState);
game.state.add('menu',menuState); 
game.state.add('lobby',lobbyState);
game.state.add('registerShip',registerShipState);
game.state.add('play',playState);
game.state.add('dead',deadState);

game.state.start('boot');


function joinAction(){
	username = $('#gamer_tag').val();
	$('#main-wrapper').hide();
	game.state.start('lobby');
}

//window.onorientationchange = function() { window.location.reload(); };
// window.onresize = function(event) {
//     window.location.reload();
// };
