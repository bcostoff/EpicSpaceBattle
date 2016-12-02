var winState = {

	create: function(){

		var titleLabel = game.add.text(80,150,'Stuffed',{font:'30px Arial',fill:'#ffffff'});
		var startLabel = game.add.text(80,250,'Click to Start',{font:'20px Arial',fill:'#ffffff'});

	},

	update: function(){
		if(game.input.activePointer.justPressed()) {
	      game.state.start('play');
	    }
	}

};