var deadState = {

	create: function(){
 
 		var deadLabel = game.add.text(0,0,'You Died',{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		deadLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) -100);
		var startLabel = game.add.text(0,0,'Click to Restart',{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		startLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

	},

	update: function(){
		if(game.input.activePointer.justPressed()) {
	      game.state.start('registerShip');
	    }
	}

};