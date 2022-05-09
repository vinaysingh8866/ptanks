/*
.ball animation problem corrected by removing reqanimationframe and using setinterval
.understood and used procedural generation. WOW
.different weapons added 
.different weapon damage added
.calculated speeds
*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//define all variables
var width = canvas.width;        
var height = canvas.height;
var terrainY = new Array();
var weapons = [[8,7,"blue", "Regular",10], [11,5,"red","Medium",20],
               [14,3,"black", "Large",30]];
var tank1 = new tank(1);
var tank2 = new tank(2);
var curPlayer = 1;

var gamePaused = false;
var gamePlay = false;
var gameStarted = false;

var gravity = .02;
var rally = 0;
var volley = 1;


//images
var bg = new Image();
var bgi = new Image();


bg.src = 'assets/img/bg.png';
bgi.src = 'assets/img/canvasbg.jpg';

//////////////////////////////////////////////////
//utility

function circle(ctx, cx, cy, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
}



////////////////////////////////////////////////////////
//this part creates a randomized terrain
    
    // terrainY[0] = 500;
    // for (var i = 1; i <= width; i++){
    //     if(i<width/4||(i>width/2&&i<width*3/4)){terrainY[i] = terrainY[i-1] - 2*Math.random() }
    //    else{terrainY[i] = terrainY[i-1] + 2*Math.random()  }    
    // }

    var base = canvas.height*0.8;// min coord from which terrain should start
    var roughness =  0.5;
    var iterations =  5;
    var p;
    var points =  [];//to store the mountains outer points

    var coord =  function(x,y)
     {
      this.x =  x;
      this.y =  y;

    }
    var midPoint =  function(p1, p2) 
      {
        return new coord((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }

    function randomInRange(min,max)
    {
        var rand =  Math.floor(Math.random()*(max-min))+min; 
        return rand;
    }

    function generatePoints(width) 
    {
      var displacement = 275;//mxm height of terrainY to be displaced above base line
      points =  [];
      var temp =  [];
      points[0] =  new coord(0, 0 + base);
      points[1] =  new coord(width, 0 + base);

      for(var i =  0; i < iterations; i++) 
      {
        temp =  [];
        for(var j =  0; j < points.length - 1; j++)
         {
          var p1 =  points[j];
          var p2 =  points[j+1];
          var mid =  midPoint(p1, p2);
          if(mid.x > canvas.width / 3 && mid.x < canvas.width * 0.66)
          {
            mid.y += randomInRange( -displacement, -displacement / 2);
          }
          else
          {
            mid.y += randomInRange(-displacement / 10, -displacement / 25);}
            temp.push(p1, mid);
          }
          temp.push(points[points.length - 1]);
          displacement *=  roughness;
          points =  temp;
        }

      return points;
    }

    var  len =  points.length;
    function generate() {
        generatePoints(width);
        len =  points.length;
    }

    generate();
    var terrainY =  [];
    var t = 0;

    for(var i =  1; i < len; i++) 
      {    
        var m= (points[i].y-points[i-1].y)/(points[i].x-points[i-1].x);
         t= 0;
         for(var j= points[i-1].x; j < points[i].x; ++j)
         {
             temp= new coord(Math.floor(j),Math.floor(points[i-1].y+m*(t++)));
              terrainY.push(temp.y);
         }
    }




//this function draws the terrain formed from above points
function drawTerrain(){
    //  for ( var i =  0; i < width; i++ ) 
    // {
    //   ctx.beginPath();
    //   ctx.fillStyle =  "green";
    //   ctx.fillRect(i,Math.floor(terrainY[i].y),1,800);
    //   ctx.closePath();            
    // }

    ctx.drawImage(bg,0,0,width,height);

  

    for (var i = 0; i <= width; i++){
        my_grad=ctx.createLinearGradient(0,terrainY[i],0,900);
    
        my_grad.addColorStop(0,"green");
        my_grad.addColorStop(0.15,"darkgreen");
        my_grad.addColorStop(0.7,"black");
        ctx.fillStyle= my_grad;
        ctx.fillRect(i,Math.floor(terrainY[i]),1,height-terrainY[i]);
    }
   

}

/////////////////////////////////////////////////////////////////////////////////////////////

//class 
function tank(start){
    this.player = start;
    this.w = 0;
    this.health = 100;
    this.moves = 50;
    this.power = 50;
    this.steepbool = false;
    if(start ==1){
        this.px = 60;
        this.theta = Math.PI/4;
        
        }
    else{
        this.px = 1100;
        this.theta = 3*Math.PI/4;
        
        }
    this.getplayer= function(){return this.player}
    
    this.angle = function(){return this.theta+this.phi}
        
    this.setpx= function(x){this.px = x}//position
    this.getpx= function(){return this.px}
    this.setpy= function(y){this.py = y}
    this.getpy= function(){return terrainY[this.px]}
    
    this.setnx= function(x){this.nx = x}//nozzle end
    this.getnx= function(){return this.nx}
    this.setny= function(y){this.ny = y}
    this.getny= function(){return this.ny}
       
    this.settheta= function(x){this.theta = x}//angle of tank
    this.gettheta= function(){return this.theta}

    this.setphi= function(x){this.phi = x}
    this.getphi= function(){return this.phi}
    
    this.sethealth= function(x){this.health = x}//health of tank
    this.gethealth= function(){return this.health}
    
    this.seti= function(x){this.i = x}
    this.geti=function(){return this.i}
    
    this.changeWeapon= function(){this.w = (this.w+1)%3;}//weapon of tank
    this.getweapon=function(){return this.w;}
    
    this.getmoves = function(){return this.moves}//moves of tank
    this.moved = function(){this.moves = this.moves-1}
   
    this.toosteep = function(){this.steepbool = true}//checking steep level
    this.notsteep = function(){this.steepbool = false}
    this.steep = function(){return this.steepbool}
   
    this.getpower = function(){return this.power}//power of Turret
    this.setpower = function(tpower){this.power = tpower;}
    //ugh realised this.xxx is public and var is private.
}
////////////////////////////////////////////////////////////////////////////////////
   
let player;
let disabled;
const newSocket = io('http://localhost:3000')
newSocket.on('gamePlayer', (message)=>{
    if(message==1){
        player=1
        curPlayer= tank1;
    }if(message==2){
        player=2
        curPlayer= tank2;
        disabled = true;
    }
    
    //console.log(curPlayer)
})
newSocket.on('playerMove', (message)=>{
    if(player==2){
        if(message==32){
            launch(tank1)
        }
        if(message==39){
            console.log("move")
            console.log(tank1)
            moveTank(tank1, 5);
            console.log(tank1)
        }
        if(message==37){
            moveTank(tank1, -5);
        }
        
    }
    if(player==1){
        if(message==32){
            launch(tank2)
        }
        if(message==39){
            moveTank(tank2, 5);
            
        }
        if(message==37){
            moveTank(tank2, -5);
        }
    }
    console.log(message)
    
})
function start(){
    newSocket.emit("gameStart")
}


document.addEventListener('keydown', function(event) {
    if(gameStarted == true && !disabled){
       
        newSocket.emit("keyPressed", event.keyCode)
        ctx.restore();
        ctx.clearRect(0, 0, width, height);
        drawTerrain();
        if (event.keyCode == 38 && !gamePaused && gamePlay){
            rotateTurret(curPlayer,1);  //up rotates turret upwards
        }
        else if(event.keyCode == 40 && !gamePaused && gamePlay){
            rotateTurret(curPlayer,-1);       //down rotates turret downwards
        }
        else if(event.keyCode ==37 && !gamePaused && gamePlay){
            moveTank(curPlayer, -5);    //left moves tanks to the left
        }
        else if(event.keyCode == 39 && !gamePaused && gamePlay){
            moveTank(curPlayer, 5);    //right moves tank to the right
        }
        else if(event.keyCode == 65 && !gamePaused && gamePlay){
           
           if(curPlayer.getpower()>0)
            curPlayer.setpower(curPlayer.getpower()-1);
        }
        else if(event.keyCode == 68 && !gamePaused && gamePlay){
            if(curPlayer.getpower()<100){
                curPlayer.setpower(curPlayer.getpower()+1);
            }
        }
        else if(event.keyCode == 87 && !gamePaused && gamePlay){   //'w' changes the weapons
           
            curPlayer.changeWeapon();
        }
        else if(event.keyCode == 32 && !gamePaused && gamePlay){   //spacebar shoots!!
          
            launch(curPlayer);
        }
        else if(event.keyCode == 80){   //'p' Pauses the game
            pauseGame();
        }
        else if(event.keyCode == 82){   //'r' restarts the game
            // startGame(); if you want to play with same terrain
            location.reload();
        }
        
        redraw();
    }
    else {
        if(event.keyCode == 13 ){
            startGame();
        }
    }
},false);


////////////////////////////////////////////////////////////////////////////////////

//intro function
function introCard(){
    
   
   
    ctx.fillStyle= "white";
    ctx.font="80px Georgia";
    ctx.fillText("Press Enter to start!", width/2-300, 200);
    ctx.font="40px Georgia"
    ctx.fillText("Press p for pause or rules.", width/2-230, 400);
    
    
}

introCard();

function endGame(loser = 0){
  
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(bgi,0,0,width,height);
    ctx.fillStyle= "white";
    ctx.font="80px Georgia";
    ctx.fillText("Game Over!", width/2-190, height/2-100);
    if(loser != 0){
        if(loser.getplayer() ==1){var winner = 2}
        else{var winner = 1;}
        ctx.font="60px Georgia";
        ctx.fillText("Player "+ winner + " Won!" , width/2-170,height/2);
    }
    else {
        ctx.font="60px Georgia";
        ctx.fillText("Draw!" , width/2-90,height/2);
    }
    
    ctx.fillText("Press 'r' to restart!", width/2-220,height/2+100);
   
}
////////////////////////////////////////////////////////////////////////


//starter
function startGame(){
    gameStarted = true;
    drawTerrain();
    tank1 = new tank(1);
    tank2 = new tank(2);
    curPlayer = tank1;
    otherPlayer = tank2;
    createTanks(curPlayer,otherPlayer);
    drawTank(curPlayer);
    drawTank(otherPlayer);
   
    gamePaused = false;
    gamePlay = true;
    redraw();
}



function pauseGame(){
    if(gamePaused==false){
        gamePaused = true;
        gamePlay = false;
        }
    else{
        gamePaused = false;
        gamePlay = true;
        }
}

function drawPauseScreen(){
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(100,130,1000,400);
    ctx.globalAlpha = 1;
    ctx.fillStyle= "white";
    ctx.font="40px Georgia";
    ctx.fillText("Game Paused!", width/2-135, 200);
    popUp();
    
    
}

function popUp(){
    ctx.fillStyle = "white";
    ctx.font="25px Georgia";
    ctx.fillText("Aim & Instructions:", 200, 250);
    ctx.fillText("Controls:", 700, 250);
    ctx.font="18px Georgia";
    ctx.fillText("Fire weapons against your opponent to lower their health.", 200, 275);
    ctx.fillText("Direct hits will have the most impact.", 200, 300);
    ctx.fillText("The different weapons have different speeds and size.", 200, 325);
    ctx.fillText("The weapons with the largest size will have the most impact.", 200, 350);
    ctx.fillText("You have a limited number of moves; so use them wisely.", 200, 375);
    ctx.fillText("There are a total of 10 volleys.", 200, 400);
    ctx.fillText("The last tank standing wins!", 200, 425);
    ctx.fillText("Hit the SpaceBar to fire!", 700, 275);
    ctx.fillText("Left and right arrows will move the tank.", 700, 300);
    ctx.fillText("Up and down arrows will rotate the Turret." , 700, 325);
    ctx.fillText("'A' and 'D' will adjust the power." , 700, 350);
    ctx.fillText("Press 'W' to change your weapon.", 700, 375);
    ctx.fillText("Press 'P' to pause the game.", 700, 400);
    ctx.fillText("Press 'R' to restart the game.", 700, 425);
}



///////////////////////////////////////////////////////////////////////////////////////////////////////

//this function creates the tanks
function createTanks(curPlayer,otherPlayer){
    curPlayer.setpy(terrainY[curPlayer.getpx()]-20);
    otherPlayer.setpy(terrainY[curPlayer.getpx()]-20);
}

//this function draws the tanks
function drawTank(tank){
    if(tank.getplayer() == 1)  
        ctx.fillStyle = "red";
    else
        ctx.fillStyle = "blue"

    //body of player
    ctx.beginPath();
    ctx.moveTo(tank.getpx(),terrainY[tank.getpx()]);
    tank.seti(30);
    for(i=0; i<=30; i++){
        if(Math.sqrt((i*i)+(terrainY[tank.getpx()+i]-terrainY[tank.getpx()])*(terrainY[tank.getpx()+i]-terrainY[tank.getpx()]))<=31 &&
           Math.sqrt((i*i)+(terrainY[tank.getpx()+i]-terrainY[tank.getpx()])*(terrainY[tank.getpx()+i]-terrainY[tank.getpx()]))>=29){
            tank.seti(i);
            break;
        }
    }
    tank.setphi(Math.acos(i/30));
    changeDelta(tank);
    if(terrainY[tank.getpx()+i]>terrainY[tank.getpx()]){tank.setphi(2*Math.PI-tank.getphi());}
    ctx.lineTo(tank.getpx()+i,terrainY[tank.getpx()+i]);
    ctx.lineTo((tank.getpx()+tank.geti())-20*Math.sin(tank.getphi()),(terrainY[tank.getpx()+tank.geti()])-20*Math.cos(tank.getphi()));
    ctx.lineTo(tank.getpx()-20*Math.sin(tank.getphi()),terrainY[tank.getpx()]-20*Math.cos(tank.getphi()));
    ctx.closePath();
    ctx.fill();
  
    var midx1= tank.getpx()+25*Math.cos(0.927293432+tank.getphi()); //0.927293432 is the angle in a 3:4:5 Triangle
    if(terrainY[tank.getpx()] >terrainY[tank.getpx()+tank.geti()]){
        var midy1=terrainY[tank.getpx()]-Math.abs(25*Math.sin((0.696706709+tank.getphi())%Math.PI));
    }
    else{
        var midy1=terrainY[tank.getpx()+tank.geti()]-Math.abs(25*Math.cos(Math.abs(0.927293432+tank.getphi())));
    }
    ctx.beginPath();
    ctx.arc(midx1,midy1, 8, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();

   
    //turret
    ctx.beginPath();
    mx = midx1-3*Math.sin(tank.gettheta());
    my = midy1-3*Math.cos(tank.gettheta());
    ctx.moveTo(mx, my);
    ctx.lineTo(mx+6*Math.sin(tank.angle()),my+6*Math.cos(tank.angle()));
    ctx.lineTo((mx+6*Math.sin(tank.angle()))+25*Math.cos(tank.angle()),(my+6*Math.cos(tank.angle()))-25*Math.sin(tank.angle()));
    ctx.lineTo(mx+25*Math.cos(tank.angle()),my-25*Math.sin(tank.angle()));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle='black';
    ctx.stroke();
    tank.setnx(mx+25*Math.cos(tank.angle()));
    tank.setny(my-25*Math.sin(tank.angle()));
    
}

//this function changes the angle of the Turret
function rotateTurret(curPlayer, dir){
    if(curPlayer.getplayer()==2){
        dir= -dir;
    }
    if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)>=0 && (dir*0.01+curPlayer.gettheta())%(2*Math.PI)<= Math.PI){
        curPlayer.settheta((dir*0.01+curPlayer.gettheta())%(2*Math.PI));
    }
    else if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)<0){
        curPlayer.settheta(0);
    }
        else if((dir*0.01+curPlayer.gettheta())%(2*Math.PI)>Math.PI){
        curPlayer.settheta(Math.PI);
    }
}

//this function moves the tank
function moveTank(curPlayer, dir){
    if(curPlayer.getmoves() != 0){
        curPlayer.setpx(curPlayer.getpx()+dir);
        delta = Math.abs(terrainY[curPlayer.getpx()]-terrainY[curPlayer.getpx()+curPlayer.geti()]);
  
        if(delta>25){
            curPlayer.setpx(curPlayer.getpx()-dir);
            curPlayer.toosteep();
         
        }
        else{
            curPlayer.notsteep();
            curPlayer.moved();
        }
    }


}


function changeDelta(victim){
    delta = Math.abs(terrainY[victim.getpx()]-terrainY[victim.getpx()+victim.geti()/2]);
  
    while(delta>25){
    
        if(victim.getplayer() == 2){
            victim.setpx(victim.getpx()+5);
        }
        else{
            victim.setpx(victim.getpx()-5);
        }
        delta = Math.abs(terrainY[victim.getpx()]-terrainY[victim.getpx()+victim.geti()]);
    }
    
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

//this function launches the cannon
function launch(){
    gamePlay = false;
   
   
    weapon = curPlayer.getweapon();
    var t = 0;
    var x = curPlayer.getnx();
    var y = curPlayer.getny();

    var clear = false;
    var ani = setInterval(function(){projectile()}, 10);

    function projectile(){
        if(gamePaused== false){
            t+=1;
            redraw();
            if(y<terrainY[Math.round(x)] && x<=width && x>=0&&clear==false){
                x = curPlayer.getnx() + weapons[weapon][1]*Math.cos(curPlayer.angle())*curPlayer.getpower()*t/100;//percentage of power
                y = curPlayer.getny() - weapons[weapon][1]*Math.sin(curPlayer.angle())*curPlayer.getpower()*t/100 + (0.5*gravity)*(t*t);
                circle(ctx, x, y,weapons[weapon][0],weapons[weapon][2]);
                clear = checkDirectHit(x,y,otherPlayer);
            }
            else 
                if((y>terrainY[Math.round(x)] || x>width || x<0) && clear ==false){
                    explode(x,y,weapons[weapon][0]*2,otherPlayer);
                    clear = true;
                }
        }
       
        if(clear==true){
            clearInterval(ani);
            // if(curPlayer.getplayer()==1){
            //     curPlayer = tank2;
            //     otherPlayer = tank1;
            // }
            // else{
            //     curPlayer = tank1;
            //     otherPlayer = tank2; 
            // }
            //disabled = true
            gamePlay=true;
             ++rally;
            if(rally%2==0 && rally!=0)++volley;
           
            redraw();
        }
    }
}


//this function makes a hole in the terrain where the weapon lands
function explode(x,y,radius,player){
    x = Math.round(x);
    y = Math.round(y);
    for(i=x-radius;i<x+radius; i++){
        terrainY[i]=Math.max(y+Math.sqrt((radius*radius)-(x-i)*(x-i)),terrainY[i]);
    }
    checkIndirectHit(x,y,radius,player);
   
}


//this function checks if the weapon hits the tank
function checkDirectHit(cx,cy,victim){
    
    
    weapon = curPlayer.getweapon();

    //checks if the weapon hits tank directly
    changeDelta(victim);
    if((cx>=victim.getpx() && cx<=victim.getpx()+30 )&&(cy>=terrainY[victim.getpx()]-20 && cy<=terrainY[victim.getpx()])){
        victim.sethealth(victim.gethealth()-weapons[weapon][4]);
        checkEndGame();
        console.log("Direct Hit");
        return true;
    }
    return false;


}
function checkIndirectHit(cx,cy,radius,victim){
        //checks if the weapon hits within certain radius of the tank
    if((cx>=victim.getpx()-radius && cx<=victim.getpx()+30+radius )&&
        (cy>=terrainY[victim.getpx()]-20-radius && cy<=terrainY[victim.getpx()]+radius)){
        victim.sethealth(victim.gethealth()-(weapons[weapon][4]/2));
        checkEndGame();
        console.log("Indirect Hit");
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function drawSetup(curPlayer){
    ctx.fillStyle= "black";
    ctx.font="15px Georgia";
    ctx.fillText('Volley: '+volley, width/2-40, 20);

    ctx.font="20px Georgia";
    ctx.fillText("Player "+ curPlayer.getplayer() + "'s turn!", width/2-75, 40);
    ctx.fillText("Your current weapon is: "+ weapons[curPlayer.getweapon()][3] , width/2-135, 65);
    if(curPlayer.getplayer() == 1){
        ctx.fillText("Angle: " + (Math.floor((curPlayer.gettheta()*360/(2*Math.PI)))), width/2-165, 90);
    }
    else {
        ctx.fillText("Angle: " + (180-Math.floor((curPlayer.gettheta()*360/(2*Math.PI)))), width/2-165, 90);
    }
    ctx.fillText("Power: " + curPlayer.getpower(), width/2-55, 90);
    ctx.fillText("Moves: " + curPlayer.getmoves(), width/2+75, 90);
    if(curPlayer.getmoves() == 0 ){
        curPlayer.notsteep();
        ctx.font = "25px Georgia"
        ctx.fillText("No More Moves!", width/2-96, 155);
    }
    if(curPlayer.steep() == true){
            ctx.font = "25px Georgia";
            ctx.fillText("That is too steep!", width/2-100, 155);
    }
}

function drawHealthBar(tank1,tank2){
    var health1 = tank1.gethealth();
    var health2 = tank2.gethealth();
    
    ctx.fillStyle= "black";
    ctx.font="25px Georgia";
    ctx.fillText("Player 1 Health: "+health1,width*.1,40);
    ctx.fillText("Player 2 Health: "+health2,width*.7,40);
    
    //p1_health
    var my_grad=ctx.createLinearGradient(width*.1,0,width*.1+150,0);
    my_grad.addColorStop(0,"firebrick");
    my_grad.addColorStop(0.5,"gold");
    my_grad.addColorStop(1,"limegreen");
    ctx.fillStyle = "black"
    ctx.fillRect(width*.1,50,150,50);
    ctx.fillStyle=my_grad;
    ctx.strokeStyle = "black";
    if(health1>=0){
        ctx.fillRect(width*.1,50,health1*3/2,50);
    }
    ctx.strokeRect(width*.1,50,150,50);
    
    //p2_health
    var my_gradn=ctx.createLinearGradient(width*.7,0,width*.7+150,0);//why should i initialise again?
    my_gradn.addColorStop(0,"firebrick");
    my_gradn.addColorStop(0.5,"gold");
    my_gradn.addColorStop(1,"limegreen");
    ctx.fillStyle = "black"
    ctx.fillRect(width*.7,50,150,50);
    ctx.fillStyle=my_gradn;
    ctx.strokeStyle = "black";
    if(health2>=0){
        ctx.fillRect(width*.7,50,health2*3/2,50);
    }
    ctx.strokeRect(width*.7,50,150,50);
}



function checkEndGame(){
    if(volley>10){
        if(tank1.gethealth()>tank2.gethealth())
            endGame(tank2);
        else if(tank1.gethealth()<tank2.gethealth())
                endGame(tank1);
            else endGame();

    }  
    else   if(tank1.gethealth()<= 0){
                tank1.sethealth(0);
                endGame(tank1);
            }
            else if(tank2.gethealth()<=0){
                    tank2.sethealth(0);
                    endGame(tank2);
                }  

}

///////////////////////////////////////////////////////////////////////////////////////////
function redraw(){
    ctx.restore();
    ctx.clearRect(0, 0, width, height);
    drawTerrain();
    drawTank(tank1);
    drawTank(tank2);
    if(gamePaused == true){drawPauseScreen();}
    drawSetup(curPlayer);
    drawHealthBar(tank1,tank2);
    checkEndGame();
}

/////////////////////////////////////////////////////////////////////////////////////////////////

