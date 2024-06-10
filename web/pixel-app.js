$(document).ready(function() {
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
			$("button[name=stepPre]").on("click", function() {
				self.selectPreBlock($trList);
			})
			$("button[name=stepNext]").on("click", function() {
				self.selectNextBlock($trList);
			})
			$(document).keydown(function(e) {
				if(e.keyCode == 13) {
					self.selectNextBlock($trList);
				}
			})
		},
		selectPreBlock: function($trList) {
			var self = this;
			$trList.find("td.td_light").removeClass("td_light");
			$trList.find("span[name=tooltip]").remove();
			var $tr = $trList.eq(self.row);
			var $tdList = $tr.find("td.td_done");
			if($tdList.length == 0  && self.row > 1) {
				self.row--;
				$tr = $trList.eq(self.row);
				$tdList = $tr.find("td.td_done");
			}
			self.col = $tdList.length > 0 ? $tdList.length - 1 : 0;
			var $firstTd = $tdList.last();
			var colorName = $firstTd.attr("class").replace("block","").replace("td_done","").replace("td_light","").replaceAll(" ","");
			var num = 0;
			for(var x=self.col; x>=0; x--) {
				var $td = $tdList.eq(x);
				if($td.hasClass(colorName)) {
					$td.removeClass("td_done").addClass("td_light");
					self.col--;
					num++;
					if(x == $tdList.length-1) {
						var colorCode = colorName.replace("color_","");
						var partsBox = partsBoxMap[colorCode];
						$firstTd.html(self.tooltip.replace("$1", num + " x " + colorCode).replace("$2", partsBox));
					}
				}
				else {
					var colorCode = colorName.replace("color_","");
					var partsBox = partsBoxMap[colorCode];
					$firstTd.html(self.tooltip.replace("$1", num + " x " + colorCode).replace("$2", partsBox));
					break;
				}
			}
			self.col = self.col < 0 ? 0 : self.col;
			self.saveWork();
		},
		selectNextBlock: function($trList) {
			var self = this;
			alert("row=" + self.row + ",col=" + self.col);
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
			var colorName = $firstTd.attr("class").replace("block","").replace("td_done","").replace("td_light","").replaceAll(" ","");
			//XXX
			alert("colorName=" + colorName);
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
						$firstTd.html(self.tooltip.replace("$1", num + " x " + colorCode).replace("$2", partsBox));
					}
				}
				else {
					var colorCode = colorName.replace("color_","");
					var partsBox = partsBoxMap[colorCode];
					$firstTd.html(self.tooltip.replace("$1", num + " x " + colorCode).replace("$2", partsBox));
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
			//XXX
			alert("save1");
			window.localStorage.setItem(key, JSON.stringify(work));
			alert("save2");
		},
		checkMobie: function() {
			var userAgent = window.navigator.userAgent;
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		}

	}
	alert("222222");
	App.bindEvents();
});
