//Queue Implimentation
class Queue
{
  constructor()
  {
    this.arr=[];
    this.size=0;
  }

  push(x)
  {
    this.arr.push(x);
    this.size++;
  }

  pop()
  {
    if(this.size===0)
    return;

    this.size--;

    return this.arr.shift();
  }

  front()
  {
    if(this.size===0)
    return;

    return this.arr[0];
  }

  rear()
  {
    if(this.size===0)
    return;

    return this.arr[this.size-1];
  }

  siz()
  {
    return this.size;
  }

  isEmpty()
  {
    return (this.size===0);
  }

  emptyQueue()
  {
    this.arr=[];
    this.size=0;
  }
}
//

//Node Structure
class Node
{
  constructor()
  {
    this.row=-1;
    this.col=-1;
    this.visited=false;
    this.blocked=false;
  }
}
//

//Creating Grid
for(var i=0;i<20;i++)
$(".grid").append('<div class="flex-row '+i+'"> </div>');

for(var i=0;i<50;i++)
$(".flex-row").append('<div class="cell"></div>');

var vis=[];
var temp=[];
for(var i=0;i<20;i++)
{
  temp=[];

  for(var j=0;j<50;j++)
  temp.push(new Node());

  vis.push(temp);
}

var grid=document.querySelectorAll(".cell");
for(var i=0;i<1000;i++)
grid[i].classList.add(i%50);
//

//Source and Destination Coordinates
var source={
  row: 10,
  col: 11
};

var destination={
  row: 10,
  col: 39
};


$(".flex-row."+source.row+" ."+source.col).append('<img class="SD" src="Images/source.png" width="24px">');
$(".flex-row."+destination.row+" ."+destination.col).append('<img class="SD" src="Images/destination.jpg" width="26px">');
//

//function to block Cells
$(".cell").click(function(){

  var curr=$(this);

  var row=curr.parent().attr("class");
  row=row.slice(row.length-2)-'0';

  var col=curr.attr("class");
  col=col.slice(col.length-2)-'0';

  if((row===source.row && col===source.col) || (row===destination.row && col===destination.col) || vis[row][col].blocked || vis[row][col].visited )
  return ;

  vis[row][col].blocked=true;

  curr.addClass("blockingAnimation");
});
//

//Speed
var speed="#";
document.querySelector("select").addEventListener("change",function(event){

      if(event.target.value!="#")
      speed=event.target.value-'0';
      else
      speed="#";
});

//BFS
queue=new Queue();

function AdjacentNode(row,col)
{
  this.row=row;
  this.col=col;
}

$(".start-button").click(function(){

  if(vis[destination.row][destination.col].visited!=true && speed!="#")
  {
      var dirRow=[0,0,1,-1];
      var dirCol=[1,-1,0,0];

      queue.push(new AdjacentNode(source.row,source.col));
      vis[source.row][source.col].visited=true;

      var BfsEvent=setInterval(function(){
        var siz=queue.siz();

        while(siz--)
        {
          var curr=queue.pop();

          var completed=false;

          for(var k=0;k<4;k++)
          {
            var i=curr.row+dirRow[k],j=curr.col+dirCol[k];

            if(i>=0 && i<20 && j>=0 && j<50 && !vis[i][j].blocked && !vis[i][j].visited)
            {
              var adjacents=new AdjacentNode(i,j);
              queue.push(adjacents);

              var processingNode=$(".flex-row."+i+" ."+j);
              processingNode.addClass("bfsAnimation");
              vis[i][j].visited=true;
              vis[i][j].row=curr.row;
              vis[i][j].col=curr.col;

              if(vis[destination.row][destination.col].visited==true)
              {
                completed=true;
                backtrack();
                break;
              }
            }
          }

          if(completed==true)
          break;
        }
        if(completed==true || queue.isEmpty())
        clearInterval(BfsEvent);
      },speed/1000);
  }

  if(speed==="#")
  alert("Please Select Speed");
});

function backtrack()
{
  var Row=vis[destination.row][destination.col].row;
  var Col=vis[destination.row][destination.col].col;

  var x=setInterval(function ()
  {
    var tempRow,tempCol;

    var processingNode=$(".flex-row."+Row+" ."+Col);

    $(processingNode).addClass("shortestPath");
    tempRow=vis[Row][Col].row;
    tempCol=vis[Row][Col].col;

    Row=tempRow;
    Col=tempCol;

    if(Row==-1 && Col==-1)
    clearInterval(x);

  },speed%1000);
}

$(".clear-grid").click(function(){

  queue.emptyQueue();

  for(var i=0;i<20;i++)
  {
    for(var j=0;j<50;j++)
    {
      var curr=$(".flex-row."+i+" ."+j);

      if(vis[i][j].blocked)
      {
        vis[i][j].blocked=false;
        curr.removeClass("blockingAnimation");
      }

      if(vis[i][j].visited)
      {
        vis[i][j].visited=false;
        curr.removeClass("bfsAnimation");

        if(curr.hasClass("shortestPath"))
        curr.removeClass("shortestPath");

        vis[i][j].row=-1;
        vis[i][j].col=-1;
      }

    }
  }

});


$(".random-maze").click(function(){

  var height=20;
  var width=50;
  buildMaze(0,0,width,height);
});

function orientation(width,height)
{
  if(height>width)
  return true;

  if(width>height)
  return false;

  return (Math.round(Math.random()))? true : false;
}

function random1(length)
{
  return (Math.floor(Math.random()*length)+1);
}

function random2(length)
{
  return (Math.floor(Math.random()*length));
}

function buildMaze(x,y,width,height)
{
  if(width<=2 || height<=2)
  return;

  var horizontal=orientation(width,height);

  //where wall will be drawn
  var wx=x+(horizontal ? 0 : random1(width-2));
  var wy=y+(horizontal ? random1(height-2) : 0);

  //where passage will be made
  px1=wx+(horizontal ? random2(width) : 0);
  py1=wy+(horizontal ? 0 : random2(height));
  px2=wx+(horizontal ? random2(width) : 0);
  py2=wy+(horizontal ? 0 : random2(height));

  //direction in which wall will be drawn
  var dx=(horizontal) ? 1 : 0;
  var dy=(horizontal) ? 0 : 1;

  //Length of wall
  var length=(horizontal) ? width : height;

  //direction of wall
  var tempwx=wx;
  var tempwy=wy;
  for(var i=1;i<=length;i++)
  {
    $(".flex-row."+tempwy+" ."+tempwx).addClass("blockingAnimation");
    vis[tempwy][tempwx].blocked=true;
    tempwx+=dx;
    tempwy+=dy;
  }

  $(".flex-row."+py1+" ."+px1).removeClass("blockingAnimation");
  vis[py1][px1].blocked=false;
  $(".flex-row."+py2+" ."+px2).removeClass("blockingAnimation");
  vis[py2][px2].blocked=false;

  if($(".flex-row."+source.row+" ."+source.col).hasClass("blockingAnimation"))
  {
    $(".flex-row."+source.row+" ."+source.col).removeClass("blockingAnimation");
    vis[source.row][source.col].blocked=false;
  }

  if($(".flex-row."+destination.row+" ."+destination.col).hasClass("blockingAnimation"))
  {
    $(".flex-row."+destination.row+" ."+destination.col).removeClass("blockingAnimation");
    vis[destination.row][destination.col].blocked=false;
  }

  var nx,ny;
  nx=x;
  ny=y;

  var w,h;
  w=(horizontal) ? width : wx-x;
  h=(horizontal) ? wy-y: height;

  buildMaze(nx,ny,w,h);

  nx=(horizontal) ? x : wx+1;
  ny=(horizontal) ? wy+1 : y;
  w=(horizontal) ? width : x+width-wx-1;
  h=(horizontal) ? y+height-wy-1: height;

  buildMaze(nx,ny,w,h);
}
