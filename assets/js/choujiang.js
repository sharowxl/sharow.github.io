// JavaScript Document

var turnplate={
		restaraunts:[],				//大转盘奖品名称
		colors:[],	                //大转盘奖品区块对应背景颜色
		//fontcolors:[],				//大转盘奖品区块对应文字颜色
		outsideRadius:222,			//大转盘外圆的半径
		textRadius:165,				//大转盘奖品位置距离圆心的距离
		insideRadius:1,			//大转盘内圆的半径
		startAngle:0,				//开始角度
		bRotate:false				//false:停止;ture:旋转
	};

	$(document).ready(function(){

	//动态添加大转盘的奖品与奖品区域背景颜色
	turnplate.restaraunts = [ "谢谢参与", "谢谢参与", "谢谢参与", "谢谢参与", "五等奖", "六等奖"];
	turnplate.colors = ["#FF8584", "#FFEE7B", "#FF8584", "#FFEE7B","#FF8584", "#FFEE7B"];
	//turnplate.fontcolors = ["#CB0030", "#FFFFFF", "#CB0030", "#FFFFFF","#CB0030", "#FFFFFF"];



	//旋转转盘 item:奖品位置; txt：提示语;
	var rotateFn = function (item, txt){
		var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
		if(angles<270){
			angles = 270 - angles;
		}else{
			angles = 360 - angles + 270;
		}
		$('#wheelcanvas').stopRotate();
		$('#wheelcanvas').rotate({
			angle:0,
			animateTo:angles+1800,
			duration:6000,
			callback:function (){
				var h1="好遗憾呢",h2="下次一定中奖哦",btn="再来一次",state='again';
				if(txt.indexOf("谢谢参与")<0){
					h1="中奖啦";
					var jiangpin=txt.replace(/[\r\n]/g,"");
					h2='您获得了'+jiangpin;
					btn="我要领奖";
					state="go";
				}
				turnplate.bRotate = !turnplate.bRotate;
				$.confirm('<div class="tit orange">'+h1+'</div>'+
					'<div class="con">'+h2+'</div>'+
					'<div class="btn '+state+'">'+btn+'</div>',[],null,{className:'ui-qiandao ui-choujiang showClose ui-alert',width:'270px',beforeShow:function(e){
						var _this=this;
						e.find('.again').click(function(){
							_this.hide();$('#tupBtn').click();
						})
						e.find('.go').click(function(){
							_this.hide();$.alert('请稍等')
						})
					}});

			}
		});
	};

	/********抽奖开始**********/
	$('#tupBtn').click(function (){
		if(turnplate.bRotate)return;
		turnplate.bRotate = !turnplate.bRotate;
		//获取随机数(奖品个数范围内)
		var item = rnd(1,turnplate.restaraunts.length);

		//奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
		rotateFn(item, turnplate.restaraunts[item-1]);
		/* switch (item) {
			case 1:
				rotateFn(252, turnplate.restaraunts[0]);
				break;
			case 2:
				rotateFn(216, turnplate.restaraunts[1]);
				break;
			case 3:
				rotateFn(180, turnplate.restaraunts[2]);
				break;
			case 4:
				rotateFn(144, turnplate.restaraunts[3]);
				break;
			case 5:
				rotateFn(108, turnplate.restaraunts[4]);
				break;
			case 6:
				rotateFn(72, turnplate.restaraunts[5]);
				break;
			case 7:
				rotateFn(36, turnplate.restaraunts[6]);
				break;
			case 8:
				rotateFn(360, turnplate.restaraunts[7]);
				break;
			case 9:
				rotateFn(324, turnplate.restaraunts[8]);
				break;
			case 10:
				rotateFn(288, turnplate.restaraunts[9]);
				break;
			} */
			console.log(item);
		})

});

function rnd(n, m){
	var random = Math.floor(Math.random()*(m-n+1)+n);
	return random;

}


//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
$(function(){
	!function () {
	var canvas = document.getElementById("wheelcanvas");

	  //根据奖品个数计算圆周角度
	  var arc = Math.PI / (turnplate.restaraunts.length/2);
	  var ctx = canvas.getContext("2d");
	  //在给定矩形内清空一个矩形
	  ctx.clearRect(0,0,516,516);
	  //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
	  ctx.strokeStyle = "#FFBE04";
	  //font 属性设置或返回画布上文本内容的当前字体属性
	  ctx.font = 'bold 22px Microsoft YaHei';
	  for(var i = 0; i < turnplate.restaraunts.length; i++) {
	  	var angle = turnplate.startAngle + i * arc;
	  	ctx.fillStyle = turnplate.colors[i];
	  	ctx.beginPath();
		  //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
		  ctx.arc(258, 258, turnplate.outsideRadius, angle, angle + arc, false);
		  ctx.arc(258, 258, turnplate.insideRadius, angle + arc, angle, true);
		  ctx.fill();
		  ctx.stroke();
		  ctx.closePath()
		  //锁画布(为了保存之前的画布状态)
		  ctx.save();

		  //----绘制奖品开始----
		  ctx.fillStyle = "#CB0030";
		  //ctx.fillStyle = turnplate.fontcolors[i];
		  var text = turnplate.restaraunts[i];
		  var line_height = 30;
		  //translate方法重新映射画布上的 (0,0) 位置
		  ctx.translate(258 + Math.cos(angle + arc / 2) * turnplate.textRadius, 258 + Math.sin(angle + arc / 2) * turnplate.textRadius);

		  //rotate方法旋转当前的绘图
		  ctx.rotate(angle + arc / 2 + Math.PI / 2);

		  /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
		  if(text.indexOf("\n")>0){//换行
		  	var texts = text.split("\n");
		  	for(var j = 0; j<texts.length; j++){
		  		ctx.font = j == 0?'bold 22px Microsoft YaHei':'bold 22px Microsoft YaHei';
				  //ctx.fillStyle = j == 0?'#FFFFFF':'#FFFFFF';
				  if(j == 0){
					  //ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
					  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
					}else{
						ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
					}
				}
		  }else if(text.indexOf("\n") == -1 && text.length>6){//奖品名称长度超过一定范围
		  	text = text.substring(0,6)+"||"+text.substring(6);
		  	var texts = text.split("||");
		  	for(var j = 0; j<texts.length; j++){
		  		ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
		  	}
		  }else{
			  //在画布上绘制填色的文本。文本的默认颜色是黑色
			  //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
			  ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
			}

		  //把当前画布返回（调整）到上一个save()状态之前
		  ctx.restore();
		  //----绘制奖品结束----
		}
	}()
});


