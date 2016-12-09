var loadState = {

	preload: function(){

		var loadingLabel = game.add.text(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,'loading...',{font:'30px Arial',fill:'#ffffff'});

		//game.load.image('space', 'assets/space-bg.jpg')
                //game.load.spritesheet('dude', 'assets/ship3.png', 83, 74)
                game.load.atlas('arcade', 'assets/arcade-joystick.png', 'assets/arcade-joystick.json');
                game.load.image('space', 'assets/tileable-space.jpg')
                game.load.spritesheet('dude-green', 'assets/G1.png', 160, 160)
                game.load.spritesheet('dude-alt-green', 'assets/G2.png', 160, 160)
                game.load.spritesheet('dude-blue', 'assets/B1.png', 160, 160)
                game.load.spritesheet('dude-alt-blue', 'assets/B2.png', 160, 160)
                game.load.image('laser', 'assets/laser.png');
                game.load.image('laser-alt', 'assets/laser2.png');
                game.load.image('mini_map', 'assets/mini_map.png');
                //game.load.image('rock', 'assets/rock.png');
                //game.load.image("background", "images/jungle-bg-2.png");

	},

	create: function(){
		game.state.start('menu');
	}

};