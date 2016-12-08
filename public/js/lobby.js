var lobbyState = {

	create: function(){

		// Our tiled scrolling background
	    space = game.add.tileSprite(0, 0, 6144, 6144, 'space');

		socket = io.connect();
		pCount = 0;
		titleLabel = game.add.text(0,0,'Number of Players Connected: ' + pCount,{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		titleLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 100);
		teamLabel = game.add.text(0,0,'Team: ' + team,{font:'30px Arial',fill:'#ffffff', align: "center", boundsAlignH: "center", boundsAlignV: "middle"});
		teamLabel.setTextBounds(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio));
		timer = game.time.create();        
        // Create a delayed event 1m and 30s from now
        timerEvent = timer.add(Phaser.Timer.SECOND * 6, this.endTimer, this);       
		setEventHandlers();		
	},

	update: function(){		
		titleLabel.setText("Number of Players Connected: " + playerCount); 
		teamLabel.setText("Team: " + team); 

		//CHANGE PLAYER COUNT TO SOMETHING ABOVE ONE IN LIVE VERSION
		if(playerCount >= 1) {
			timer.start();	
			if (timer.running) {
	            game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
	        }else{
	        	game.debug.text("Done!", 2, 14, "#0f0");
	        }			       	
	 	}
	},

    endTimer: function() {
        // Stop the timer when the delayed event triggers
        timer.stop();
        game.state.start('registerShip');        
    },

    formatTime: function(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        //return minutes.substr(-2) + ":" + seconds.substr(-2);   
        return "Game starts in " + seconds.substr(-2);
    }

};

