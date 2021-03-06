var loadState = {

	preload: function(){

		var loadingLabel = game.add.text(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,'loading...',{font:'30px Arial',fill:'#ffffff'});

		game.load.image('space', 'assets/starfield.jpg')
                //game.load.spritesheet('dude', 'assets/ship3.png', 83, 74)
                game.load.atlas('arcade', 'assets/arcade-joystick.png', 'assets/arcade-joystick.json');
                //game.load.image('space', 'assets/tileable-space.jpg')
                game.load.spritesheet('dude-green', 'assets/G1.png', 160, 160)
                game.load.spritesheet('dude-alt-green', 'assets/G2.png', 160, 160)
                game.load.spritesheet('dude-blue', 'assets/B1.png', 160, 160)
                game.load.spritesheet('dude-alt-blue', 'assets/B2.png', 160, 160)
                game.load.image('laser', 'assets/player_laser.png');
                //game.load.image('laser', 'assets/laser.png');
                game.load.image('laser-alt', 'assets/laser2.png');
                game.load.image('big_laser', 'assets/big_laser.png');
                game.load.image('capital_laser', 'assets/capital_laser.png');
                game.load.image('mini_map', 'assets/mini_map.png');
                game.load.image('flare_diamond', 'assets/flare_diamond.png');
                game.load.image('flare_point', 'assets/flare_point.png');
                game.load.image('flare_vertical', 'assets/flare_vertical.png');
                game.load.image('rock', 'assets/rock.png');
                game.load.image('item', 'assets/item.png');
                game.load.image('capital-green', 'assets/Star_Destroyer.png');
                game.load.image('planet', 'assets/planet-compressor.png');
                game.load.image('white', 'assets/white.png');
                //game.load.image("background", "images/jungle-bg-2.png");

	},

	create: function(){
		game.state.start('menu');
	}

};