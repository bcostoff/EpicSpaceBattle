var bootState = {

	create: function(){
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// game.scale.forceOrientation(true, false);
		//this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('load');
	}

};


