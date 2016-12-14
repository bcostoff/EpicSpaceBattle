var MiniMap = function(game) {
    miniMapContainer = game.add.group();    
    resolution = 1 / 100;    
    if (game.world.width > 8000) {        
      var renderWH = 8000;    
    } else {       
      var renderWH = game.world.width;    
    }    
    renderTexture = game.add.renderTexture(renderWH, renderWH);    
    renderTexture.resolution = resolution;    
    var cropRect = new Phaser.Rectangle(0, 0, 200, 200);    
    renderTexture.crop = cropRect;    
    // var miniMapY = game.camera.view.height - (game.world.height * resolution);    
    var miniMapUI = game.add.image(0, 0, 'mini_map');    
    renderTexture.trueWidth = renderTexture.resolution * game.world.width;    
    renderTexture.trueHeight = renderTexture.resolution * game.world.height;    
    // var cropRect = new Phaser.Rectangle(0, 0, renderTexture.trueWidth, renderTexture.trueHeight);    
    // renderTexture.crop = cropRect;    
    // var miniWidth = .075 * renderTexture.trueWidth;    
    // var miniHeight = miniMapY - (.06 * renderTexture.trueHeight);  

    // //miniMap = game.add.sprite(miniWidth, miniHeight, renderTexture);    
    // miniMap = game.add.sprite(0, 0, renderTexture);    

    // var padding = .241 * renderTexture.trueHeight;    
    miniMapUI.width = (renderTexture.trueWidth + padding);    
    miniMapUI.height = (renderTexture.trueHeight + padding);    
    
    //miniMapUI.y = game.camera.view.height - miniMapUI.height;    
    miniMapUI.y = 0;    

    miniMapUI.fixedToCamera = true;    
    // miniMap.fixedToCamera = true;    
    // viewRect = game.add.graphics(0, 0);    
    // viewRect.lineStyle(1, 0xFFFFFF);  

    // //viewRect.drawRect(miniMap.x, miniMap.y, game.camera.view.width * resolution, game.camera.view.height * resolution);      
    // viewRect.drawRect(0, 0, game.camera.view.width * resolution, game.camera.view.height * resolution);    

    // unitDots = game.add.graphics(miniMap.x, miniMap.y);    
    // unitDots.fixedToCamera = true;    
    // var bg = game.add.graphics(0, 0);    
    // bg.beginFill(0x000000, 1);    
    
    // //bg.drawRect(0, miniMapUI.y + (miniMapUI.height * .1), miniMapUI.width * .95, miniMapUI.height * .9);    
    // bg.drawRect(0, 0, miniMapUI.width, miniMapUI.height);    

    // bg.fixedToCamera = true;    
    // var children = [bg, miniMap, unitDots, viewRect, miniMapUI];    
    var children = [miniMapUI];    
    miniMapContainer.addMultiple(children);
};

MiniMap.prototype.constructor = MiniMap;

MiniMap.prototype.update = function (player,enemies) {
    unitDots.clear();            
    var unitMiniX = player.player.x * renderTexture.resolution;        
    var unitMiniY = player.player.y * renderTexture.resolution;    
    var color = '0x6cf641';    
    unitDots.beginFill(color);   
    unitDots.drawEllipse(unitMiniX, unitMiniY, 2, 2);    
    for(var i = 0; i < enemies.length; i++){
        if(enemies[i].alive){
            var eunitMiniX = enemies[i].player.x * renderTexture.resolution;        
            var eunitMiniY = enemies[i].player.y * renderTexture.resolution;    
            var color = '0x1f99f7';  
            unitDots.beginFill(color);  
            unitDots.drawEllipse(eunitMiniX, eunitMiniY, 2, 2);           
        }
    }  
}
