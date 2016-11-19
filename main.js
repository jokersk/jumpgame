var game,
    player,
    topPlatform = 660

var worldBoundHeight = 0;
var gameOptions = {
    gameWidth: 450, 
    gameHeight: 600

}

window.onload = function() {    
     
     game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
     game.state.add("TheGame", TheGame);
     game.state.start("TheGame");
}

var TheGame = function(){};

TheGame.prototype = {


     preload: function(){
          game.stage.backgroundColor = "#4488AA";
          game.load.spritesheet("player", "player2.png", 20, 20);
          game.load.image("wallHor","wallHorizontal.png");
          game.load.image("wallVer","wallVertical.png");
          game.load.audio("jump","jump.mp3");
          // game.load.image("player", "playerPath"); 
     },


      create: function(){
        

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
       
        // game.world.setBounds(0, 0, 400, 1920);
        this.jumpSound = game.add.audio("jump")
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.addWall();
        player = game.add.sprite(game.world.centerX, 500, 'player');
        player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(player);
        player.body.velocity.x = 150;
        player.body.gravity.y = 900;
        player.body.checkCollision.up = false;
        player.animations.add('right', [1, 2], 8, true);
        player.animations.add('left', [3, 4], 8, true);
        player.animations.play('right');
        player.body.bounce.setTo(1, 0);
        player.direction = "right"
        player.yOrig = player.y;
        player.yChange = 0;

        game.input.onDown.add(this.playerJump,this)
        game.camera.follow(player);
      },
      addOnePlatform:function(){
         topPlatform -=60
         wallhor = this.platforms.create(0,topPlatform,"wallHor");
         wallhor.body.immovable = true;
         wallhor.anchor.x = 0;
         wallhor.anchor.y = 1;
         wallhor.scale.setTo(1,0.5)
         wallhor.width = gameOptions.gameWidth;
         
         if(Math.random() >= 0.2)
          {   
            if(Math.random() >= 0.3)
            {
                  wall = this.walls.create(0,topPlatform,"wallVer");
                  wall.anchor.setTo(0,1)
            }
            if(Math.random() >= 0.3)
            {
                  wall = this.walls.create(gameOptions.gameWidth,topPlatform,"wallVer");
                  wall.anchor.setTo(1,1)
            }
              
          }
          this.walls.setAll("scale.x",0.5);
          this.walls.setAll("height",60);
          this.walls.setAll("body.immovable",true);

        
      },
      addWall:function(){
         this.platforms = this.add.group();
         this.platforms.enableBody = true;
         this.platforms.physicsBodyType = Phaser.Physics.ARCADE;

         this.walls = this.add.group();
         this.walls.enableBody = true;
         this.walls.physicsBodyType = Phaser.Physics.ARCADE;         
        for(var i=600; i>0 ; i-=60)
        {
          this.addOnePlatform();
        }
       

      },
      playerJump:function(){
        if(player.body.touching.down)
        {
            player.body.velocity.y = -400;
            this.addOnePlatform()
            this.jumpSound.play()
        }
        
        

      },
      changeVelocity:function(){
        if(player.direction=="right")
        {
          player.animations.play('left');
          player.direction = "left"
        }
        else{
           player.animations.play('right');
           player.direction = "right"
        }

      },
      update:function(){
           this.physics.arcade.collide( player, this.platforms );
           this.physics.arcade.collide(player, this.walls , this.changeVelocity);
           game.camera.y = player.y;
           player.yChange = Math.max( player.yChange, Math.abs( player.y - player.yOrig ) );  
          
           game.world.setBounds(0, -player.yChange, 400, 600 + player.yChange);
      }

}