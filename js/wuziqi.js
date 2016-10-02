$(function(){
    $('body').on('mousuedown',false)
    var canvas=$('#canvas').get(0);
    //console.log(canvas)
    var ctx=canvas.getContext('2d');
    var ROW=15;
    var width=canvas.width;
    var off=width/ROW;
    var flag=true;
    var blocks={};
    var ai=false;
    var blank={};
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }
    function v2k(position){
    	return position.x+"_"+position.y;
    }
    function p2k(x,y){
    	return x+'_'+y;
    }
    function makeCircle(x,y){
    	ctx.beginPath();
    	ctx.arc(x*off,y*off,3,0,Math.PI*2);
    	ctx.fill();
    	ctx.closePath();
    }
    function draw(){
        //横线
        ctx.beginPath();
        for (var i = 0; i < ROW; i++) {
            ctx.moveTo(off/2+0.5,off/2+0.5+i*off);
            ctx.lineTo((ROW-0.5)*off+0.5,off/2+0.5+i*off);
        };
        
        ctx.stroke();
        ctx.closePath();
        //竖线
        ctx.beginPath();
        for (var i = 0; i < ROW; i++) {
            ctx.moveTo(off/2+0.5+i*off,off/2+0.5);
            ctx.lineTo(off/2+0.5+i*off,(ROW-0.5)*off+0.5);
        };
        
        ctx.stroke();
        ctx.closePath();
        makeCircle(3.5,3.5);
        makeCircle(11.5,3.5);
        makeCircle(7.5,7.5);
        makeCircle(3.5,11.5);
        makeCircle(11.5,11.5);
    } 
    function k2o(key){
    	var arr=key.split('_');
    	return {x:parseInt(arr[0]),
    	        y:parseInt(arr[1])
    	       }
    }
    function drawText(pos,text,color){
    	ctx.save();
        ctx.beginPath();
    	ctx.font='15px 黑体';
    	ctx.textAlign="center";
    	ctx.textBaseline='middle';
    	        
        if(color==='black'){
        	ctx.fillStyle='white';
            //console.log(ctx.fillStyle)
        }else if(color==='bai'){
        	ctx.fillStyle="black";
        }
        ctx.fillText(text,(pos.x+0.5)*off,(pos.y+0.5)*off);
        ctx.closePath();
        ctx.restore();
    }
    function review(){
    	i=0;
    	for(var pos in blocks){
          	i++;	
    		drawText(k2o(pos),i,blocks[pos]);    		
    	}
        
    }
     
    draw();
    //落子
    function drawChess(position,color){
        ctx.save();
    	ctx.beginPath();
    	ctx.translate((position.x+0.5)*off,(position.y+0.5)*off);
    	if(color==='black'){    		
             var radgrad = ctx.createRadialGradient(-4,-4,1,0,0,15);
			 radgrad.addColorStop(0, '#f6e8e8');
			 radgrad.addColorStop(0.5, '#000');
			 ctx.fillStyle=radgrad;
    	}else if(color==='bai'){
    		ctx.shadowColor='black';
			 ctx.shadowBlur=5;
			 ctx.shadowOffsetX=1;
             ctx.shadowOffsetY=1;
			 ctx.fillStyle='#fff';
    	}
    	
    	ctx.arc(0,0,15,0,Math.PI*2);
    	ctx.fill();
    	ctx.closePath();
    	ctx.restore();
    	blocks[v2k(position)]=color;
        delete blank[v2k(position)];
    }
    function check(pos,color){
    	var table={};
    	//横向
    	var num=1;
    	for(var i in blocks){
    		if(blocks[i]===color){
    			table[i]=true;
    		}
    	}
    	var tx=pos.x;
    	var ty=pos.y;
    	while(table[p2k(tx+1,ty)]){num++;tx++};
    	tx=pos.x;ty=pos.y;
    	while(table[p2k(tx-1,ty)]){num++;tx--};
    	 // if(num>=5){
    	 // 	return true;
    	 // };
    	//竖着走
    	//alert(1)
    	var num1=1;
    	var rx=pos.x;
    	var ry=pos.y;
    	while(table[p2k(rx,ry+1)]){num1++;ry++};
    	rx=pos.x;ry=pos.y;
    	while(table[p2k(rx,ry-1)]){num1++;ry--};
    	// if(num1>=5){
    	// 	return true;
    	// }
    	//左斜
    	var leftNum=1; 
    	var lx=pos.x;
    	var ly=pos.y;
    	while(table[p2k(lx-1,ly-1)]){leftNum++;ly--;lx--};
    	lx=pos.x;ly=pos.y;
    	while(table[p2k(lx+1,ly+1)]){leftNum++;lx++;ly++};
    	// if(leftNum>=5){
    	// 	return true;
    	// } 
    	//右斜
    	var rightNum=1; 
    	var rix=pos.x;
    	var riy=pos.y;
    	while(table[p2k(rix+1,riy-1)]){rightNum++;riy--;rix++};
    	rix=pos.x;riy=pos.y;
    	while(table[p2k(rix-1,riy+1)]){rightNum++;rix--;riy++};
    	// if(rightNum>=5){
    	// 	return true;
    	// } 
        var max=Math.max(num,num1,leftNum,rightNum);
        return max;    	 
    }
    function restart(){
        ctx.clearRect(0,0,width,width);
        draw();
        blocks={};
        flag=true;
        $('canvas').off('click');
        $('canvas').on('click',handleClick);
    }
    function handleClick(e){
        var position={
            x:Math.round((e.offsetX-off/2)/off),
            y:Math.round((e.offsetY-off/2)/off)
        }
        if(blocks[v2k(position)]){
            return;
        }
         if(ai){
          drawChess(position,'black');
          drawChess(AI(),'bai');
          if(check(position,'black')>=5){
              alert('黑棋赢');
              // hei.show();
              $(canvas).off('click');
              if(confirm('是否生成棋谱')){
                  review();
              }
              return;
          }
          if(check(AI(),'bai')>5){
              alert('白棋赢');
              // bai.show();
              $(canvas).off('click');
              if(confirm('是否生成棋谱')){
                  review();
              }
              return;
          }
          return;
      }
        if(flag){
            drawChess(position,'black');
            if(check(position,'black')>=5){
                alert('黑棋赢');
                $('canvas').off('click');
                if(confirm('是否生成棋谱')){
                    review();
                }
                return;
            }
                        
        }else{
            drawChess(position,'bai');
            if(check(position,'bai')>=5){
                alert('白棋赢');
                $('canvas').off('click');
                if(confirm('是否生成棋谱')){
                    review();
                }
                return;
            }
        }
        flag=!flag;
    }
    var flag2=true;
    var index=0;
    console.log(dushu);
    $(canvas).on('click',handleClick);
    // $(canvas).on('click',function(){
    //     index++;

    // })
    $('.restart').on('click',function(){
        restart();
       // $('.renji').off('click');
    });
    $('.renji').on('click',function(){
        ai=!ai;        
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $(this).text('取消人机')
        }else{
            $(this).text('人机大战')
        }

    })
    function AI(){
        var max1=-Infinity;
        var pos1;
        var max2=-Infinity;
        var pos2;
        for(var i in blank){
           var score1= check(k2o(i),'black');
            if(score1>max1){
                max1=score1;
                pos1=k2o(i);
            }
        }
        for(var i in blank){
            var score2= check(k2o(i),'bai');
            if(score2>max2){
                max2=score2;
                pos2=k2o(i);
            }
        }
        if(max2>=max1){
            return pos2;
        }else{
            return pos1;
        }
    }

    //计时器
    var canvas2=$('#jishileft').get(0);
    var ctx2=canvas2.getContext('2d');
    var dushu=0;
    function biaopan(){
    ctx2.clearRect(0,0,100,100); 
    ctx2.save();
    ctx2.translate(50,50);
    ctx2.beginPath();
    
    ctx2.rotate(dushu);
    dushu+=2*Math.PI/12;
    ctx2.moveTo(0,15);
    ctx2.lineTo(0,5);
    ctx2.moveTo(5,0);
    ctx2.arc(0,0,5,0,2*Math.PI);
    ctx2.moveTo(0,-5);
    ctx2.lineTo(0,-26);
    ctx2.lineWidth=3;
    ctx2.lineCap='round';
    ctx2.stroke();
    ctx2.closePath();
    ctx2.restore(); 
   }
   //biaopan();
   
   var canvas3=$('#jishiright').get(0);
    var ctx3=canvas3.getContext('2d');
    var dushu2=0;
    function biaopan2(){
    ctx3.clearRect(0,0,100,100); 
    ctx3.save();
    ctx3.translate(50,50);
    ctx3.beginPath();
    
    ctx3.rotate(dushu2);
    dushu2+=2*Math.PI/12;
    ctx3.moveTo(0,15);
    ctx3.lineTo(0,5);
    ctx3.moveTo(5,0);
    ctx3.arc(0,0,5,0,2*Math.PI);
    ctx3.moveTo(0,-5);
    ctx3.lineTo(0,-26);
    ctx3.lineWidth=3;
    ctx3.lineCap='round';
    ctx3.stroke();
    ctx3.closePath();
    ctx3.restore(); 
   }















    //开始游戏
    $('.start').click(function(){
        $('.left').animate({left:0},500);
        $('.right').animate({right:0},500);
        $('#canvas').addClass('qipa');
        $(this).delay(800).fadeOut().queue(function(){
            $('.renji ,.restart').addClass('renji2').dequeue();
        })
        

    })









    })