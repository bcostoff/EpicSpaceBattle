var loadState = {

	preload: function(){

		var loadingLabel = game.add.text(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio,'loading...',{font:'30px Arial',fill:'#ffffff'});

		//game.load.image('space', 'assets/space-bg.jpg')
                //game.load.spritesheet('dude', 'assets/ship3.png', 83, 74)
                game.load.image('space', 'assets/tileable-space.jpg')
                game.load.spritesheet('dude', 'assets/G1.png', 180, 180)
                game.load.spritesheet('dude-alt', 'assets/B1.png', 180, 180)
                game.load.image('laser', 'assets/laser.png');
                game.load.image('laser-alt', 'assets/laser2.png');
                //game.load.image('rock', 'assets/rock.png');
                //game.load.image("background", "images/jungle-bg-2.png");

	},

	create: function(){
		game.state.start('menu');
	}

};