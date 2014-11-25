// JavaScript Document
var size;
var mapsize;
var cellSize=16;
var canvas = document.getElementById("canvas"); 
var cxt = canvas.getContext("2d");
var mapArr=new Array();
var crossRoad=new Array();
var mainChar = [1, 0];
var timeCounter =1.0;
var x=8;
var y=8;
var a,b,c,d,g,f;
var ghost_x;
var ghost_y;
var direction=0;

function start(){
	var chooseSize=document.getElementsByName("chooseSize");
	if(chooseSize[0].checked)
		size=24;
	else if(chooseSize[1].checked)
		size=40;
		
	mapsize=size+1;
	
	canvas.width=mapsize*cellSize;
	canvas.height=mapsize*cellSize;
	
	setMap();
	getCross();
	drawmap();
	ghostInitial();
	

	setInterval(refreshMap,50);
	
	putPacman();
	canvas.focus();
	canvas.addEventListener( "keydown", doKeyDown, true);
	
}

function refreshMap(){
	drawmap();
	putPacman();
	putGhost(this.ghost_x, this.ghost_y);
	rdmGhostLoc();	
	
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
}	

function doKeyDown(e) { 

	if(e.keyCode == 40 && y<mapsize*cellSize-8)	
		if(mapArr[b][c]==-1 || mapArr[b][c]==0){
			mapArr[b][c]=0;
			y += 16;}
	
		
    if(e.keyCode == 38 && y>8)
		if(mapArr[f][c]==-1 || mapArr[f][c]==0){
			mapArr[f][c]=0;
			y -= 16;}	
			
	if(e.keyCode == 37 && x>8)
		if(mapArr[d][g]==-1 || mapArr[d][g]==0){
			mapArr[d][g]=0
			x -= 16;}
				
	if(e.keyCode == 39 && x<mapsize*cellSize-8)
		 if(mapArr[d][a]==-1 || mapArr[d][a]==0){
			mapArr[d][a]=0;
			x += 16;}	
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
				cxt.arc(16*j+8,16*i+8,2,0,Math.PI*2);	
			
			cxt.closePath(); 
			cxt.fill(); }
	}
}

function putPacman(){
	if(timeCounter % 2 ==0){
		
	cxt.beginPath();
	cxt.fillStyle="#FFFF00";
	cxt.sector(x,y,8,Math.PI*0.167,Math.PI*1.833).fill();
	}else{
	cxt.beginPath();
	cxt.fillStyle="#FFFF00";
	cxt.sector(x,y,8,0,Math.PI*2).fill();
	}
	cxt.closePath(); 
	cxt.fill(); 
	timeCounter += 1;

	a = (x+8)/16;
	b = (y+8)/16
	c = (x-8)/16;
	d = (y-8)/16;
	g = (x-24)/16;
	f = (y-24)/16;
}

function ghostInitial(){
	ghost_x=size/2*cellSize;
	ghost_y=size/2*cellSize;
}

function putGhost(g_x,g_y){
	cxt.beginPath();
	cxt.fillStyle="#800080";
	cxt.ghost(g_x,g_y).fill();

	cxt.closePath(); 
	cxt.fill();
	
	
}

function rdmGhostLoc(){
	if((timeCounter>60)&&(timeCounter<190)){				
		ghost_y=ghost_y-1;
	}
	else if(timeCounter>=190){
		if((ghost_y/cellSize%1==0)&&(ghost_x/cellSize%1==0)){
			if(crossRoad[ghost_y/cellSize][ghost_x/cellSize]==1)
				direction=Math.floor(Math.random()*4);
		}
			
		var counter=0;
		while(counter<4){
			switch(direction){
				case 0:	
					if((ghost_y>cellSize)&&(!mapArr[Math.floor((ghost_y-cellSize)/cellSize)][Math.floor(ghost_x/cellSize)]==1)){
						ghost_y=ghost_y-1;
						return;
					}else{
						counter++;
						direction=1+direction%4;
						break;
						}
						
				case 1:
					if((ghost_x>cellSize)&&(!mapArr[Math.floor(ghost_y/cellSize)][Math.floor((ghost_x-cellSize)/cellSize)]==1)){
						ghost_x=ghost_x-1;
						return;
					}else{
						counter++;
						direction=1+direction%4;
						break;	
					}
				case 2:
					if((ghost_x<(mapsize-1)*cellSize)&&(!mapArr[Math.floor(ghost_y/cellSize)][Math.ceil((ghost_x+cellSize)/cellSize)]==1)){
						ghost_x=ghost_x+1;
						return;
					}else{
						counter++;
						direction=1+direction%4;
						break;	
					}					
				case 3:
					if((ghost_y<(mapsize-1)*cellSize)&&(!mapArr[Math.ceil((ghost_y+cellSize)/cellSize)][Math.floor(ghost_x/cellSize)]==1)){
						ghost_y=ghost_y+1;
						return;	
					}else{
						counter++;
						direction=1+direction%4;
						break;	
					}
			}
			break;
			
		}
					
	}else
		return;
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