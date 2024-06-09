$(document).ready(function() {
	//$table = $("table.papaer_table");
	//$trList = $table.find("tr");
	var App = {
		row: 1,
		col: -1,
		tooltip: "<span name=\"tooltip\" class=\"ui-tooltip\"><span class=\"ui-tooltip-inner1\">$1</span><span class=\"ui-tooltip-inner2\">$2</span></span>",
		bindEvents: function() {
			var self = this;
			self.readWork();
			var $table = $("table.paper_table");
		    var $trList = $table.find("tr");
			for(var y=1; y<self.row; y++) {
				var $tr = $trList.eq(y);
				$tr.find("td.block").addClass("td_done");
			}
			var $tdList = $trList.eq(self.row).find("td.block");
			for(var x=0; x<self.col+1; x++) {
				$tdList.eq(x).addClass("td_done");
			}
			$("button[name=page]").on("click", function() {
				var page = $(this).attr("_page");
				window.location.href = page;
			});
			$("button[name=step]").on("click", function() {
				self.selectNextBlock($trList);
			})
			$(document).keydown(function(e) {
				if(e.keyCode == 13) {
					self.selectNextBlock($trList);
				}
			})
		},
		selectNextBlock: function($trList) {
			var self = this;
			self.saveWork();		
			$trList.find("td.td_light").addClass("td_done").removeClass("td_light");
			$trList.find("span[name=tooltip]").remove();
			var $tr = $trList.eq(self.row);
			var $tdList = $tr.find("td.block");
			if(self.col == $tdList.length - 1) {
				self.row++;
				self.col = -1;
			}
			$tr = $trList.eq(self.row);
			$tdList = $tr.find("td.block");
			var $firstTd = $tdList.eq(self.col+1);
			var colorName = $firstTd.attr("class");
			colorName = colorName.replace("block","").replace("td_done","").replace("td_light","").replace(" ","");
			var num = 0;
			for(var x=self.col+1; x<$tdList.length; x++) {
				var $td = $tdList.eq(x);
				if($td.hasClass(colorName)) {
					$td.addClass("td_light");
					self.col++;
					num++;
					if(x == $tdList.length-1) {
						var colorCode = colorName.replace("color_","");
						var partsBox = partsBoxMap[colorCode];
						$firstTd.html(self.tooltip.replace("$1", colorCode + " x " + num).replace("$2", partsBox));
					}
				}
				else {
					var colorCode = colorName.replace("color_","");
					var partsBox = partsBoxMap[colorCode];
					$firstTd.html(self.tooltip.replace("$1", colorCode + " x " + num).replace("$2", partsBox));
					break;
				}
			}
			
		},
		readWork: function() {
			var self = this;
			var key = window.location.href;
			var work = window.localStorage.getItem(key);
			if(work) {
				var workJson = JSON.parse(work);
				self.col = workJson.col;
				self.row = workJson.row;
			}
		},
		saveWork: function() {
			var self = this;
			var key = window.location.href;
			var work = {
				col: self.col,
				row: self.row
			}
			window.localStorage.setItem(key, JSON.stringify(work));
		},
		checkMobie: function() {
			var userAgent = window.navigator.userAgent;
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		}

	}
	App.bindEvents();
});