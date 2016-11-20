var gameOver = function(){};

gameOver.prototype = {
      init:function(score){
        this.score = score
      },

     preload: function(){
         
     },


      create: function(){
         if(localStorage.getItem("jumpingGame")==undefined)
         {
            localStorage.setItem("jumpingGame",0);
         }

        console.log(localStorage.getItem('jumpingGame'))
         if (this.score > localStorage.getItem('jumpingGame')) 
         {    
              score = this.score 
              console.log(score)
              localStorage.setItem('jumpingGame', score);
         }

         game.camera.y = 0;
         game.world.setBounds(0,0, gameOptions.gameWidth, gameOptions.gameHeight );
         gameOverText = game.add.text(game.world.centerX ,game.world.centerY - 150,
            "Game Over",
            {font: "60px Arial", fill: "#fff"});
         gameOverText.anchor.setTo(0.5,0.5) 

         bestText = game.add.text(game.world.centerX ,game.world.centerY - 50,
            "Best: "+ localStorage.getItem("jumpingGame"),
            {font: "40px Arial", fill: "#fff"});
         bestText.anchor.setTo(0.5,0.5) 

         yourText = game.add.text(game.world.centerX ,game.world.centerY + 30,
            "Your: "+ this.score,
            {font: "40px Arial", fill: "#fff"});
         yourText.anchor.setTo(0.5,0.5) 
         game.input.onDown.add(this.restart,this)
      },
      restart:function(){
         game.state.start("TheGame");
      },
      update:function(){

      }

}