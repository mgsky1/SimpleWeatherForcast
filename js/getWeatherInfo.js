	//获取用户当前位置 并获取实时天气JSON字符串 解析 返回我们所需要的各种天气信息
	//Design By 小远
	//Update Time 2016-07-14
	var cityCurrent = '';
	var cityWeather = '';
	var resultSet = '';
	var num = '';
	var life = '';

	function judgePlatform() {
		var system = {

			win: false,

			mac: false,

			xll: false

		};

		//检测平台

		var p = navigator.platform;//浏览器使用哪个平台编译？ Win32？ MacPPC？ Linuxi586？

		system.win = p.indexOf("Win") == 0;

		system.mac = p.indexOf("Mac") == 0;

		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

		//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面

		if(system.win || system.mac || system.xll) {
			
             window.location.href = '../PC/index.html';
		} else {

			window.location.href = "../mobile/index.html";

		}
	}

	function getWeatherInfo() {
		// 百度地图API功能
		var map = new BMap.Map("");
		var point = new BMap.Point(116.331398, 39.897445);
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r) {
			if(this.getStatus() == BMAP_STATUS_SUCCESS) {
				cityCurrent = r.address.city;
				$.cookie('cityCurrent', cityCurrent);
                judgePlatform();
			} else {
				alert('failed' + this.getStatus());
			}
		}, {
			enableHighAccuracy: true
		})
	}

	function getWeatherJSON(cityUser) {

		//使用jQuery Ajax技术 后台PHP动态获取数据
		$.ajax({
			type: "GET",
			url: "../weather_json.php?city=" + cityUser,
			async: false,
			success: function(json) {
				cityWeather = jQuery.parseJSON(json);
				if(cityWeather.error != 0)
				{
					alert('地点不存在');
					return;
				}
				resultSet = cityWeather.results[0];
				cityCurrent = cityUser;

				str = '';
				//						for (var i = 0; i < json.length; i++) {
				//							for (var key in json[i]) {
				//								str += json[i][key];
				//							}
				//						}
				//						$('#weather').html(str);
			}
		});
		return resultSet;
	}
	
    function updateLifeTips()//动态获取生活小贴士
    {
    	num = Math.floor(Math.random()*10);
    	$.ajax({
    		type:"GET",
    		url:"../getKonw.php?id="+num,
    		async:false,
    		success:function(json){
    			var data = jQuery.parseJSON(json);
    			if(data.status == "OK")
    			{
    				life = data.content;
    			}
    			else
    			{
    				alert('error');
    				life = '';
    			}
    		}
    	});
    	
    	return life;
    }
    
	function isGetWeatherObj() //判断是否获取到天气对象
	{
		if(cityWeather != '') {
			return 0;
		} else {

			return 1;
		}
	}

	function getDate() //返回时间
	{
		var t = new Date();
		var obj = getTodyWeather();
		var week = obj.date.substring(1, 2);
		var str = t.getFullYear() + '年' + t.getMonth() + '月' + t.getDate() + '日 星期' + week;
		return str;
	}

	function getPM25() //得到今日PM2.5
	{
		if(isGetWeatherObj() == 1) {
			alert('error');
			return;
		}
		var PM25 = resultSet.pm25;
		return PM25;
	}

	function getTodyWeather() //返回用户实时天气集合
	{
		if(isGetWeatherObj() == 1) {
			alert('error');
			return;
		}
		var today = resultSet.weather_data[0];
		return today;
	}

	function getThreeWeather() //返回未来三日天气集合
	{
		if(isGetWeatherObj() == 1) {
			alert('error');
			return;
		}
		var threeDays = [];
		for(var i = 1; i < 4; i++) {
			var day = resultSet.weather_data[i];
			threeDays.push(day);
		}
		return threeDays;
	}

	function getTips() //返回今日贴士集合
	{
		if(isGetWeatherObj() == 1) {
			alert('error');
			return;
		}

		var tips = [];
		for(var i = 0; i < 6; i++) {
			var tip = resultSet.index[i];
			tips.push(tip);
		}

		return tips;
	}

	function anaPicURL(picUrl, option) //返回天气图片URL 为自定义图片做准备
	{
		var index = picUrl.lastIndexOf('weather');
		if(option == 1) //获取带day/night 用于更换图标
		{
			var str = picUrl.substring(index + 8, picUrl.length);
		} else if(option == 2) //获取图片名 用于更换背景图片
		{
			var str = picUrl.substring(index + 12, picUrl.length - 4);
		}
		return str;
	}

	function getTepArray(option) //返回气温数组 为绘制图表做准备
	{
		var tempArray = [];
		var today = getTodyWeather();
		var threeDays = getThreeWeather();
		if(option == 1) //获取最高气温数组
		{
			var high = '';
			high = today.temperature.substring(0, 2);
			tempArray.push(parseInt(high));
			for(var i = 0; i < 3; i++) {
				high = threeDays[i].temperature.substring(0, 2);
				tempArray.push(parseInt(high));
			}
		} else if(option == 2) {
			var low = '';
			low = today.temperature.substring(5, 7);
			tempArray.push(parseInt(low));
			for(var i = 0; i < 3; i++) {
				low = threeDays[i].temperature.substring(5, 7);
				tempArray.push(parseInt(low));
			}
		}

		return tempArray;
	}

	function getDates() //返回日期数组 为绘制图表做准备
	{
		var dates = [];
		dates.push('今天');
		var threeDays = getThreeWeather();
		for(var i = 0; i < 3; i++) {
			var myDate = threeDays[i].date;
			dates.push(myDate);
		}

		return dates;
	}

	function anaPM25() //分析今日PM2.5指数
	{
		var data = getPM25();
		if(0 <= data && data <= 35) {
			return '优';
		} else if(35 < data && data <= 75) {
			return '良';
		} else if(75 < data && data <= 115) {
			return '轻度污染';
		} else if(115 < data && data <= 150) {
			return '中毒污染';
		} else if(150 < data && data <= 250) {
			return '重度污染';
		} else {
			return '严重污染';
		}
	}

	function getCurrentTemp() //获取实时温度
	{
		var today = getTodyWeather();
		var nowTemp = today.date;
		nowTemp = nowTemp.substring(nowTemp.indexOf('(') + 1, nowTemp.length - 1);
		return nowTemp;
	}

	function getTemp(obj) //获取温度
	{
		return obj.temperature;
	}

	function getWind(obj) //获取风速
	{
		return obj.wind;
	}