var registerShipState = {

	create: function(){
		
		var titleLabel = game.add.text(0,0,'Choose Your Ship',{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		titleLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 250);

		ver1 = game.add.sprite((window.innerWidth * window.devicePixelRatio)/4, (window.innerHeight * window.devicePixelRatio)/4, 'dude')
		ver1.scale.setTo(0.5, 0.5);
		ver1.name = 1;
        ver2 = game.add.sprite(((window.innerWidth * window.devicePixelRatio)/2) + 60, (window.innerHeight * window.devicePixelRatio)/4, 'dude-alt')
        ver2.scale.setTo(0.5, 0.5);
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