var registerShipState = {

	create: function(){

		// Our tiled scrolling background
	    space = game.add.tileSprite(0, 0, 6144, 6144, 'space');
		
		var titleLabel = game.add.text(0, 0,'Choose Your Ship',{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		titleLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

		ver1 = game.add.sprite(game.world.centerX - 100, game.world.centerY + 100, 'dude-' + team)
		ver1.scale.setTo(scaleRatio, scaleRatio);
		ver1.name = 1;
        ver2 = game.add.sprite(game.world.centerX + 100, game.world.centerY + 100, 'dude-alt-' + team)
        ver2.scale.setTo(scaleRatio, scaleRatio);
        ver2.name = 2;

        //  Enables all kind of input actions on this image (click, etc)
    	ver1.inputEnabled = true;
    	ver2.inputEnabled = true;

    	ver1.events.onInputDown.add(listener, this);
    	ver2.events.onInputDown.add(listener, this);

	},

	update: function(){

	}

};

function listener (ship) {

    if(ship.name == 1) {
	  ship_ver = 1
	}else if(ship.name == 2) {
	  ship_ver = 2
	}
	game.state.start('play');

}