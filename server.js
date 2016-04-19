
//REQUIRED MODULES ----------------------------------------------------
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var url = require('url');
var io = require('socket.io')(http);
var loop = require('node-gameloop');
//---------------------------------------------------------------------

app.get('/', function(req,res){                      //PLAY
        res.sendFile(__dirname+'/wobblesquabble.html');
});

app.get('/' + "socket.io.js", function(req,res){   
        res.sendFile(__dirname+'/socket.io.js');
});

app.get('/' + "tiles/combinedTiles.png", function(req,res){   
        res.sendFile(__dirname+'/tiles/combinedTiles.png');
});

app.use(express.static('public'));
//-------------------------------------------------------------------------------

// GAME LOOP---------------
var frameCount = 0;
var id = loop.setGameLoop(function(delta){



},1000/60);
//-------------------------


//SERVES STATIC FILES (js libraries and game assets)-----------------------------
app.use(express.static('public'));


//SOCKETS------------------------------------------------------------------------
var gameState = [numPlayers=0,numBlue=0,numRed=0,rScore=0,bScore=0, playerNames=[], players=[]];

function player(name, x, y, team, bullets){

    this.name = name;
    this.x = x;
    this.y = y;
    this.team = "none";
    this.bullets = bullets;

}

function assignName(){

    var name = Math.floor(Math.random()*100+10)+"";
    if(playerNames.indexOf(name)<0){
        playerNames.push(name);
        return name;
    }
    else return assignName();

}

function assignX(team){
    return 100; //TODO
}

function assignY(team){
    return 100; //TODO
}


io.on('connection', function(socket){

    gameState.numPlayers++;

    if(numBlue>numRed){

        gameState.numRed++;
        this.player = new player(assignName(),assignX("red"),assignY("red"),"red",[])
        gameState.players.push(this.player);

    }
    else if( numRed>numBlue){

        gameState.numBlue++;
        this.player = new player(assignName(),assignX("blue"),assignY("blue"),"blue",[]);
        gameState.player.push(this.player);

    }

    console.log('User has connected to socket');

    socket.on('message', function(data){
        console.log(data);
        socket.emit('message', data);

    });

    socket.on('keyChange', function(data){


    });


   

    socket.on('disconnect', function(){
        console.log('User has disconnected from socket');

        numPlayers--;
    });


});
//-------------------------------------------------------------------------------

var port2 = process.env.PORT || 8080;

var server = http.listen(port2, '0.0.0.0' , function () {
  
	var port = server.address().port;

	console.log('listening at http %s', port);

});