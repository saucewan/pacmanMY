// JavaScript Document
var screenH=window.innerWidth;
var size;
var mapsize;
var cellSize;
var canvas = document.getElementById("canvas"); 
var cxt = canvas.getContext("2d");
var mapArr=new Array();
var crossRoad=new Array();
var mainChar = [1, 0];
var timeCounter =1.0;
var x;
var y;
var a,b,c,d,g,f;
var ghost_x=new Array();
var ghost_y=new Array();
var direction=[0,0,0];
var life=5;
var score=0;
var canvas = document.getElementById("canvas");
var refreshInterval;
var manDir=-1;
var timer=180;
var cover=document.getElementById("cover");
var name;
var divSize=document.getElementById("sizeSelect");
var dirbutton=document.getElementsByClassName("dirButton");
var buttons=document.getElementById("buttons");

function welcome(){
		
	cover.style.width=screenH.toString()+"px";
	cover.style.height=screenH.toString()+"px";
	cover.style.visibility="visible";	
}

function end(){
	location.reload();
}

function oldPlayer(){
	name=document.getElementById("existname").value;
	var url="http://www2.comp.polyu.edu.hk/~12130691d/pacman/loginExist.php?existname="+name;
	
		try
		{
			asyncRequest=new XMLHttpRequest();
			asyncRequest.onreadystatechange = loginAlready;
			asyncRequest.open( 'GET', url, true );
			asyncRequest.send( null );
		}
		catch(exception)
		{
			alert("Request Failed");
		}		
}

function checkForm(){
	var username1=document.getElementById("username").innerHTML;
	var choosegender=document.getElementsByName("gender");
	var chooseagegroup=document.getElementsByName("agegroup");
	
	var gender;
	var agegroup;
	
	if(choosegender[0].checked)
		gender=choosegender[0].value;
	else if(choosegender[1].checked)
		gender=choosegender[1].value;
		
	if(chooseagegroup[0].checked)
		agegroup=chooseagegroup[0].value;
	else if(chooseagegroup[1].checked)
		agegroup=chooseagegroup[1].value;
	else if(chooseagegroup[2].checked)
		agegroup=chooseagegroup[2].value;
			
	if(username1=="× Name existed")
		alert("Please change to another name");
	else if(username1=="√ Valid"){
		var url="http://www2.comp.polyu.edu.hk/~12130691d/pacman/login.php?name="+name+"&agegroup="+agegroup+"&gender="+gender;
	
		try
		{
			asyncRequest=new XMLHttpRequest();
			asyncRequest.onreadystatechange = loginAlready;
			asyncRequest.open( 'GET', url, true );
			asyncRequest.send( null );
		}
		catch(exception)
		{
			alert("Request Failed");
		}	
	}		
	
}

function loginAlready(){
	if ( asyncRequest.readyState == 4 && asyncRequest.status == 200){
		cover.style.visibility="hidden";
		divSize.style.visibility="visible";
		buttons.style.visibility="visible";
		document.getElementById("PlayerInGame").innerHTML="Welcome! "+name+"!";
	}
}

function validateName(query){
	name=query;
	var url="http://www2.comp.polyu.edu.hk/~12130691d/pacman/validateName.php?query="+query;
	
	try
	{
		asyncRequest=new XMLHttpRequest();
		asyncRequest.onreadystatechange = processResponse;
		asyncRequest.open( 'GET', url, true );
		asyncRequest.send( null );
	}
	catch(exception)
	{
		alert("Request Failed");
	}	
}

function processResponse(){
	if ( asyncRequest.readyState == 4 && asyncRequest.status == 200 && asyncRequest.responseText){
		document.getElementById("username").innerHTML=asyncRequest.responseText;	
	}
}

function start(){
	divSize.style.visibility="hidden";
	for(var i =0, il = dirbutton.length;i<il;i++){
     dirbutton[i].style.visibility = "visible";
    }
	var chooseSize=document.getElementsByName("chooseSize");
	if(chooseSize[0].checked)
		size=24;
	else if(chooseSize[1].checked)
		size=40;
		
	mapsize=size+1;
	cellSize=Math.floor(screenH/mapsize);
	x=cellSize*size/2+cellSize/2;
	y=cellSize*(size/2+2)+cellSize/2;
	
	canvas.width=mapsize*cellSize;
	canvas.height=mapsize*cellSize;
	
	setMap();
	getCross();
	drawmap();
	ghostInitial();

	refreshInterval=setInterval(refreshMap, 200);
	
	putPacman();
	canvas.focus(); 
	canvas.addEventListener( "keydown", doKeyDown, true);
	
}

function refreshMap(){
	drawmap();
	putPacman();
	
	putGhost();
	rdmGhostLoc(0);
	rdmGhostLoc(1);
	rdmGhostLoc(2);
	move();
	whetherMeet();
	showTime();
	showScore();
	showLife();
	
}

function setMap(){
	for (var i=0;i<mapsize;i++){
		mapArr[i]=new Array();
		for (var j=0; j<mapsize; j++){
			mapArr[i][j]=-1;	
		}
	}
	
	for(var i=1;i<=3;i++)
		for(var j=1;j<=4;j++)
			mapArr[i][j]=1;			
	for(var i=1;i<=3;i++)
		for(var j=6;j<=10;j++)
			mapArr[i][j]=1;		
	for(var i=5;i<=6;i++)
		for(var j=1;j<=4;j++)
			mapArr[i][j]=1;	
	for(var i=8;i<=11;i++)
		for(var j=0;j<=4;j++)
			mapArr[i][j]=1;	
	for(var i=5;i<=10;i++)
		for(var j=6;j<=7;j++)
			mapArr[i][j]=1;	
	for(var i=6;i<=6;i++)
		for(var j=9;j<=11;j++)
			mapArr[i][j]=1;	
	for(var i=8;i<=8;i++)
		for(var j=8;j<=11;j++)
			mapArr[i][j]=1;	
	for(var i=10;i<=11;i++)
		for(var j=9;j<=11;j++)
			mapArr[i][j]=1;	

	
	mapArr[2][11]=1;
	mapArr[12][10]=1;
	mapArr[12][14]=1;
	mapArr[13][12]=1;
			
	for (var i=0;i<size/2;i++){
		for (var j=0;j<size/2;j++){
			mapArr[size-i][j]=mapArr[i][j];
		}
	}
	
	for(var i=0;i<size;i++){
		for (var j=0;j<size/2;j++){
			mapArr[i][size-j]=mapArr[i][j];
		}
	}
	
	
}


function getCross(){
	for (var i=0;i<mapsize;i++){
		crossRoad[i]=new Array();
		for (var j=0; j<mapsize; j++){
			crossRoad[i][j]=0;	
		}
	}
	
	for (var i=0;i<mapsize;i++){
		for (var j=0; j<mapsize; j++){
			if(mapArr[i][j]==-1)
				if((i>0)&&(j>0)&&(i<mapsize-1)&&(j<mapsize-1)){
					if((mapArr[i][j-1]==-1||mapArr[i][j+1]==-1)&&(mapArr[i-1][j]==-1||mapArr[i+1][j]==-1))
						crossRoad[i][j]=1;
				}else if((j==0)&&(i<mapsize-1)&&(i>0)){
					if((mapArr[i][j+1]==-1)&&(mapArr[i-1][j]==-1||mapArr[i+1][j]==-1))
						crossRoad[i][j]=1;	
				}else if((j==mapsize-1)&&(i<mapsize-1)&&(i>0)){
					if((mapArr[i][j-1]==-1)&&(mapArr[i-1][j]==-1||mapArr[i+1][j]==-1))	
						crossRoad[i][j]=1;
				}else if((i==0)&&(j<mapsize-1)&&(j>0)){
					if((mapArr[i][j-1]==-1||mapArr[i][j+1]==-1)&&(mapArr[i+1][j]==-1))
						crossRoad[i][j]=1;
				}else if((i==mapsize-1)&&(j<mapsize-1)&&(j>0)){
					if((mapArr[i][j-1]==-1||mapArr[i][j+1]==-1)&&(mapArr[i-1][j]==-1))
						crossRoad[i][j]=1;
				}else if((i==0)&&(j==0)||(i==0)&&(j==mapsize-1)||(j==0)&&(i==mapsize-1)||(j==mapsize-1)&&(i==mapsize-1))
					crossRoad[i][j]=1;
		}
	}
	
	crossRoad[size/2][size/2]=0;
	crossRoad[size/2][size/2-1]=0;
	crossRoad[size/2][size/2+1]=0;
}	

function doKeyDown(e) { 

	if(e.keyCode == 40)	
		manDir=1;
	
		
    if(e.keyCode == 38)
		manDir=0;

			
	if(e.keyCode == 37)
		manDir=2;

				
	if(e.keyCode == 39)
		manDir=3;
	
}

function move() { 

	switch(manDir){
		case 1:	
			if(mapArr[b][c]!=1 && y<mapsize*cellSize-cellSize){
				if(mapArr[b][c]==-1){
					mapArr[b][c]=0;
					score++;
				}
				y += cellSize;
			}
			break;
			
    	case 0:
			if(mapArr[f][c]!=1 && y>cellSize/2){
				if(mapArr[f][c]==-1){
					mapArr[f][c]=0;
					score++;
				}
				y -= cellSize;
			}	
			break;
			
		case 2:
			if(mapArr[d][g]!=1 && x>cellSize/2){
				if(mapArr[d][g]==-1){	
					mapArr[d][g]=0;
					score++;
				}
				x -= cellSize;
			}
			break;
				
		case 3:
			if(mapArr[d][a]!=1 && x<mapsize*cellSize-cellSize){
				if(mapArr[d][a]==-1){
					mapArr[d][a]=0;
					score++;
				}
				x += cellSize;
			}
			break;
				
		default:
			return;
	}
}



function whetherMeet(){
	for(var i=0;i<3;i++){
		if((ghost_x[i]==x-cellSize/2)&&(ghost_y[i]==y-cellSize/2)){
			alert("You have been catched");
			life--;
			if(life==0){
				alert("Game Over");
				clearInterval(refreshInterval);
			}
		}
	}
}



function drawmap(){
	cxt.clearRect(0,0,mapsize*cellSize,mapsize*cellSize);
	for(var i=0;i<mapsize;i++)
		for(var j=0;j<mapsize;j++){
			if (mapArr[i][j] == -1){
			cxt.fillStyle="#000000";
			cxt.fillRect(j*cellSize,i*cellSize,cellSize,cellSize);
			}
			
			if(mapArr[i][j] == 1){
			cxt.fillStyle="#084B8A";
			cxt.fillRect(j*cellSize,i*cellSize,cellSize,cellSize);
			}
			
			if(mapArr[i][j] == 0){
			cxt.fillStyle="#000000";
			cxt.fillRect(j*cellSize,i*cellSize,cellSize,cellSize);
			}
		}

	for(var i=0;i<mapsize;i++)
		for(var j=0;j<mapsize;j++){
			if (mapArr[i][j] == -1)
				{	
				cxt.beginPath();
				cxt.fillStyle="#FFFF00";
				cxt.arc(cellSize*j+cellSize/2,cellSize*i+cellSize/2,cellSize/8,0,Math.PI*2);	
			
			cxt.closePath(); 
			cxt.fill(); }
	}
}

function putPacman(){
	if(timeCounter % 2 ==0){
		
	cxt.beginPath();
	cxt.fillStyle="#FFFF00";
	cxt.sector(x,y,cellSize/2,Math.PI*0.167,Math.PI*1.833).fill();
	}else{
	cxt.beginPath();
	cxt.fillStyle="#FFFF00";
	cxt.sector(x,y,cellSize/2,0,Math.PI*2).fill();
	}
	cxt.closePath(); 
	cxt.fill(); 
	timeCounter += 1;

	a = (x+cellSize/2)/cellSize;
	b = (y+cellSize/2)/cellSize;
	c = (x-cellSize/2)/cellSize;
	d = (y-cellSize/2)/cellSize;
	g = (x-cellSize/2*3)/cellSize;
	f = (y-cellSize/2*3)/cellSize;
}

function ghostInitial(){
	ghost_x[0]=size/2*cellSize;
	ghost_y[0]=size/2*cellSize;
	
	ghost_x[1]=(size/2-1)*cellSize;
	ghost_y[1]=size/2*cellSize;
	
	ghost_x[2]=(size/2+1)*cellSize;
	ghost_y[2]=size/2*cellSize;
}

function putGhost(){
	
		cxt.beginPath();
		cxt.fillStyle="#800080";
		cxt.ghost(ghost_x[0],ghost_y[0]).fill();
	
		cxt.closePath(); 
		cxt.fill();
		
		cxt.beginPath();
		cxt.fillStyle="#800000";
		cxt.ghost(ghost_x[1],ghost_y[1]).fill();
	
		cxt.closePath(); 
		cxt.fill();
		
		cxt.beginPath();
		cxt.fillStyle="#800060";
		cxt.ghost(ghost_x[2],ghost_y[2]).fill();
	
		cxt.closePath(); 
		cxt.fill();
	
	
}

function rdmGhostLoc(i){
	if(timeCounter>15*(i+1)){
		if((ghost_y[i]/cellSize%1==0)&&(ghost_x[i]/cellSize%1==0)){
			if(crossRoad[ghost_y[i]/cellSize][ghost_x[i]/cellSize]==1){
				
				direction[i]=Math.floor(Math.random()*4);
			}
			
			if((ghost_y[i]/cellSize==11)&&(ghost_x[i]/cellSize==12)||(ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==12))
				direction[i]=0;
				
			if((ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==0)||(ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==15)||(ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==11))
				direction[i]=2;
			
			if((ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==24)||(ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==9)||(ghost_y[i]/cellSize==12)&&(ghost_x[i]/cellSize==13))
				direction[i]=1;
				
			if((ghost_y[i]/cellSize==14)&&(ghost_x[i]/cellSize==12))
				direction[i]=3;
							
		}
		
		var counter=0;
		while(counter<4){
			switch(direction[i]){
				//move up
				case 0:	
					if((ghost_y[i]>cellSize)&&(mapArr[Math.floor((ghost_y[i]-cellSize)/cellSize)][Math.floor(ghost_x[i]/cellSize)]!=1)){
						ghost_y[i]=ghost_y[i]-cellSize;
						return;
					}else{
						counter++;
						direction[i]=1+direction[i]%4;
						break;
						}
				//move left		
				case 1:
					if((ghost_x[i]>cellSize)&&(mapArr[Math.floor(ghost_y[i]/cellSize)][Math.floor((ghost_x[i]-cellSize)/cellSize)]!=1)){
						ghost_x[i]=ghost_x[i]-cellSize;
						return;
					}else{
						counter++;
						direction[i]=1+direction[i]%4;
						break;	
					}
				//move right
				case 2:
					if((ghost_x[i]<(mapsize-1)*cellSize)&&(mapArr[Math.floor(ghost_y[i]/cellSize)][Math.ceil((ghost_x[i]+cellSize)/cellSize)]!=1)){
						ghost_x[i]=ghost_x[i]+cellSize;
						return;
					}else{
						counter++;
						direction[i]=1+direction[i]%4;
						break;	
					}
				//move down					
				case 3:
					if((ghost_y[i]<(mapsize-1)*cellSize)&&(mapArr[Math.ceil((ghost_y[i]+cellSize)/cellSize)][Math.floor(ghost_x[i]/cellSize)]!=1)){
						ghost_y[i]=ghost_y[i]+cellSize;
						return;	
					}else{
						counter++;
						direction[i]=1+direction[i]%4;
						break;	
					}
			}
			break;
			
		}
					
	}else
		return;
}

function showLife(){
	document.getElementById("life").innerHTML="Life: "+life;		
}

function showScore(){
	document.getElementById("score").innerHTML="Score: "+score;		
}

function showTime(){
	if(timeCounter%5==0){
		timer--;
		document.getElementById("time").innerHTML="Time: "+timer;
	}
}


CanvasRenderingContext2D.prototype.ghost = function(x,y){	
	this.save();
	this.translate(x,y);
	this.beginPath();
	this.moveTo(0,cellSize/2);
	this.quadraticCurveTo(cellSize/2,-5,cellSize,cellSize/2);
	
	this.lineTo(cellSize,cellSize);
	this.lineTo(0,cellSize);
	this.moveTo(0,cellSize);
	this.lineTo(0,cellSize/2);
	this.closePath();
	this.restore();
	return this;
};

CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
	this.save();
	this.translate(x, y);
	this.beginPath();
	this.arc(0,0,radius,sDeg, eDeg);
	this.save();
	this.rotate(eDeg);
	this.moveTo(radius,0);
	this.lineTo(0,0);
	this.restore();
	this.rotate(sDeg);
	this.lineTo(radius,0);
	this.closePath();
	this.restore();
	return this;
}

function upOnClick(){
	manDir=0;
}
function downOnClick(){
	manDir=1;
}
function leftOnClick(){
	manDir=2;
}
function rightOnClick(){
	manDir=3;
}