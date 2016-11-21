var game,
    player,
    topPlatform,
    haveLeftWall = 0,
    haveRightWall = 0,
    score,
    scoreLabel
   

var worldBoundHeight = 0;
var gameOptions = {
    gameWidth: 375, 
    gameHeight: 660,
    gap:66

}

window.onload = function() {    
     
     game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
     game.state.add("TheGame", TheGame);
     game.state.add("gameOver", gameOver);
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
        game.camera.y = 0;
        game.world.setBounds(0,0, gameOptions.gameWidth, gameOptions.gameHeight );

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        
        topPlatform = gameOptions.gameHeight + gameOptions.gap
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

        haveLeftWall = Math.random();
        haveRightWall = Math.random();


        score = 0;
        scoreLabel = game.add.text(gameOptions.gameWidth - 20,10,
            "Score: "+ score,
            {font: "25px Arial", fill: "#fff"});
        scoreLabel.anchor.setTo(1,0)
        scoreLabel.fixedToCamera = true;
        game.input.onDown.add(this.playerJump,this)
        game.camera.follow(player);

        

      },
      addOnePlatform:function(){
         topPlatform -=gameOptions.gap
         wallhor = this.platforms.create(0,topPlatform,"wallHor");
         wallhor.body.immovable = true;
         wallhor.anchor.x = 0;
         wallhor.anchor.y = 1;
         wallhor.scale.setTo(1,0.5)
         wallhor.width = gameOptions.gameWidth;
         
        wallhor.checkWorldBounds = true; 
        wallhor.outOfBoundsKill = true;

            if(Math.random() + haveLeftWall >= 0.6)
            {
                  wall = this.walls.create(0,topPlatform,"wallVer");
                  wall.anchor.setTo(0,1)
                  
                  haveLeftWall = 0
            }
             else
            {
                   haveLeftWall += 0.1
            }

            if(Math.random() + haveRightWall >= 0.6)
            {
                  wall = this.walls.create(gameOptions.gameWidth,topPlatform,"wallVer");
                  wall.anchor.setTo(1,1)
                  
                  haveRightWall = 0
            }
             else 
            {
                  haveRightWall+=0.1
            }
              
         
          this.walls.setAll("scale.x",0.5);
          this.walls.setAll("height",gameOptions.gap);
          this.walls.setAll("body.immovable",true);

        
      },
      addWall:function(){
         this.platforms = this.add.group();
         this.platforms.enableBody = true;
         this.platforms.physicsBodyType = Phaser.Physics.ARCADE;

         this.walls = this.add.group();
         this.walls.enableBody = true;
         this.walls.physicsBodyType = Phaser.Physics.ARCADE;         
        for(var i=gameOptions.gameHeight; i>0 ; i-=gameOptions.gap)
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
            score +=10;
            scoreLabel.text = "Score: "+score;
            player.velocity.x *= 1.2
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
      playerDie:function(){
           game.state.start("gameOver", true, false, score);
      },
      update:function(){
           this.physics.arcade.collide( player, this.platforms );
           this.physics.arcade.collide(player, this.walls , this.changeVelocity);
           game.camera.y = player.y;
           player.yChange = Math.max( player.yChange, Math.abs( player.y - player.yOrig ) );  
          
           game.world.setBounds(0, -player.yChange, gameOptions.gameWidth, gameOptions.gameHeight + player.yChange);
          if (!player.inWorld) { 
            this.playerDie();
          }
      }

}