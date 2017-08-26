var city = $.cookie('cityCurrent');
			var obj = '';
			var day = '';
			console.log(city);
			initial(city);

			function search() {
				city = $.trim(document.getElementById('inputCity').value);
				console.log(city);
				if(city == '') {
					alert('请输入城市');
					return;
				}
				initial(city);
			}

			function initial(city) {
				obj = getWeatherJSON(city);
				day = getTodyWeather();
				updateToday()
                getLifeTips();
				console.log(obj);
			}

			function getLifeTips() {
				var life = updateLifeTips();
				$('#know').html(life.content);
				var picurl = 'image/' + life.pic + '.jpg';
				$('#img').attr('src', picurl);

			}

			function updateToday() {
				$('#ci').html('当前城市: ' + city);
				$('#h1').html(getCurrentTemp().substring(3, getCurrentTemp().length));
				$('#todayw').html(day.weather);
				$('#wind').html(getWind(day));
				$('#todayTemp').html(getTemp(day));
				$('#week').html(getDate());
				$('#todatPM25').html('PM2.5：' + anaPM25() + ' ' + getPM25());
				var picbg = anaPicURL(day.dayPictureUrl, 2) + '.jpg';
				console.log(picbg);
				$('#head').css('background-image', 'url(image/' + picbg + ')');
				updateFeature();
				draw();
				var tips = getTips();
				updateTips(tips);
			}

			function updateFeature() {
				day = getTodyWeather();
				$('#day0').html('今天&nbsp;&nbsp;&nbsp;&nbsp;' + day.weather + ' ' + getWind(day) + ' ' + getTemp(day));
				var pic = anaPicURL(day.dayPictureUrl, 1);
				$('#tu0').attr('src', pic);
				var threeDays = getThreeWeather();
				var count = 1;
				for(var i = 0; i < 3; i++) {
					var day = threeDays[i];
					$('#day' + count).html(day.date + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + day.weather + ' ' + getWind(day) + ' ' + getTemp(day));
					console.log(day);
					var pic = anaPicURL(day.dayPictureUrl, 1);
					$('#tu' + count).attr('src', pic);
					count++;
				}

			}

			function setStateIni() {

			}

			function updateTips(data) //更新贴士
			{
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