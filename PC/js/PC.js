var city = $.cookie('cityCurrent');
var obj = '';
var day = '';
initial(city);

function initial(city) {
	obj = getWeatherJSON(city);
	day = getTodyWeather();
	$('#week').html(getDate() + '<br> &nbsp;&nbsp;当前天气实况');
	updateCity();
	updateToday();
	updateThreeDays();
	draw();
	var tips = getTips();
	updateTips(tips);
	getLifeTips();
	

}

function updateCity() {
	$('#currentCity').html(city);
}

function changeCity(cityChange) {
	changeStates();
	city = cityChange;
	initial(cityChange);
}

function changeStates() {
	$('#currentCity').html('获取中');
	$('#todayTemp').html('今 天 天 气 : 获取中');
	$('#todatPM25').html('PM2.5 : 获取中');
	$('#AQI').html('空 气 质 量 : 获取中');
	$('#todayw').html('获取中');
	$('#nowt').html('获取中');
	$('#wind').html('获取中');
	$('#day0').attr('alt', '获取中');
	$('#day0').attr('src', 'days/duoyun.png');
	var count = 1;
	for(var i = 0; i < 4; i++) {
		$('#day' + count + ' .one').html('获取中');
		$('#day' + count + ' .two>img').attr('alt', '获取中');
		$('#day' + count + ' .three').html('获取中');
		$('#day' + count + ' .four').html('获取中');
		$('#day' + count + ' .five').html('获取中');
		count++;
	}
}

function updateToday() {
	$('#todayTemp').html('今 天 天 气 : ' + getTemp(day));
	$('#todatPM25').html('PM2.5 : ' + getPM25());
	$('#AQI').html('空 气 质 量 : ' + anaPM25());
	$('#todayw').html(day.weather);
	$('#nowt').html(getCurrentTemp());
	$('#wind').html(getWind(day));
	var picbg = anaPicURL(day.dayPictureUrl, 2) + '.jpg';
	var pic = anaPicURL(day.dayPictureUrl, 1);
	$('#bg').addClass('animated fadeIn');
	setTimeout(function() {
		$('#bg').removeClass('fadeIn');
	}, 1000);
	$('#bg').attr('src', 'days/' + picbg);
	$('#day0').attr('src', pic);
}

function updateThreeDays() {
	var threeDays = getThreeWeather();
	var count = 1;
	for(var i = 0; i < 3; i++) {
		var day = threeDays[i];
		$('#day' + count + ' .one').html(day.date);
		var pic = anaPicURL(day.dayPictureUrl, 1);
		$('#day' + count + ' .two>img').attr('src', pic);
		$('#day' + count + ' .three').html(day.weather);
		$('#day' + count + ' .four').html(getWind(day));
		$('#day' + count + ' .five').html(getTemp(day));
		count++;
	}
}

function search() {
	var searchCity = $.trim($('#searchCity').val());
    if(searchCity == '')
    {
        alert('请输入城市');
        return;
    }
    else
    {
        city = searchCity;
	    initial(city);
    }
	
}

function updateTips(data) //更新贴士
{
	console.log(data);
	var count = 1;
	for(var i = 0; i < data.length; i++) {
		var id = '#zs' + count + ' p';
		var p = $(id)[0];
		var obj = data[i];

		p.innerText = obj.tipt + ':' + obj.zs;
		var p = $(id)[1];
		p.innerText = obj.des;
		count++;

	}

}

function getLifeTips()
{
 	var life = updateLifeTips();
 	$('#know').html(life.content);
 	var picurl = 'image/'+life.pic+'.jpg';
 	$('#img').attr('src',picurl);
 	
}

function draw() {
	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.

	var data = {
		labels: getDates(),
		datasets: [{
			fillColor: "rgba(220,220,220,0.5)",
			strokeColor: "rgba(220,220,220,1)",
			pointColor: "rgba(220,220,220,1)",
			pointStrokeColor: "#fff",
			data: getTepArray(1)
		}, {
			fillColor: "rgba(151,187,205,0.5)",
			strokeColor: "rgba(151,187,205,1)",
			pointColor: "rgba(151,187,205,1)",
			pointStrokeColor: "#fff",
			data: getTepArray(2)
		}]
	}

	Chart.defaults.global.responsive = true; //设置图表全局响应式
	var options = {

		//Boolean - If we show the scale above the chart data			
		scaleOverlay: true,

		//Boolean - If we want to override with a hard coded scale
		scaleOverride: false,

		//** Required if scaleOverride is true **
		//Number - The number of steps in a hard coded scale
		scaleSteps: null,
		//Number - The value jump in the hard coded scale
		scaleStepWidth: null,
		//Number - The scale starting value Y轴的起始值
		scaleStartValue: null,

		//String - Colour of the scale line	Y/X轴的颜色
		scaleLineColor: "rgba(0,0,0,.1)",

		//Number - Pixel width of the scale line	X,Y轴的宽度
		scaleLineWidth: 1,

		//Boolean - Whether to show labels on the scale	Y轴上是否显示文字
		scaleShowLabels: true,

		//Interpolated JS string - can access value  Y轴刻度文字
		scaleLabel: "<%=value%>℃",
		//String - Scale label font declaration for the scale label 字体
		scaleFontFamily: "'Arial'",

		//Number - Scale label font size in pixels	文字大小
		scaleFontSize: 12,

		//String - Scale label font weight style	文字样式
		scaleFontStyle: "normal",

		//String - Scale label font colour	文字颜色
		scaleFontColor: "#666",

		///Boolean - Whether grid lines are shown across the chart 是否显示网格
		scaleShowGridLines: false,

		//String - Colour of the grid lines 网格颜色
		scaleGridLineColor: "rgba(0,0,0,.05)",

		//Number - Width of the grid lines 网格刻度
		scaleGridLineWidth: 1,

		//Boolean - Whether the line is curved between points 是否使用贝塞尔曲线
		bezierCurve: true,

		//Boolean - Whether to show a dot for each point 是否显示点数
		pointDot: true,

		//Number - Radius of each point dot in pixels 圆点的大小
		pointDotRadius: 3,

		//Number - Pixel width of point dot stroke 圆点的笔触宽度
		pointDotStrokeWidth: 1,

		//Boolean - Whether to show a stroke for datasets 数据集行程
		datasetStroke: true,

		//Number - Pixel width of dataset stroke 线条的宽度(数据集)
		datasetStrokeWidth: 2,

		//Boolean - Whether to fill the dataset with a colour 是否填充数据集
		datasetFill: true,

		//Boolean - Whether to animate the chart 是否执行动画
		animation: true,

		//Number - Number of animation steps 动画时间
		animationSteps: 60,

		//String - Animation easing effect 动画特效
		animationEasing: "easeOutQuart",

		//Function - Fires when the animation is complete
		onAnimationComplete: null,
	}

	var graph = new Chart(ctx).Line(data, options);
}