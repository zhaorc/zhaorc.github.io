$(document).ready(function() {
	var App = {
		row: 1,
		col: -1,
		partsTooltip: "<span name=\"tooltip\" class=\"ui-tooltip\"><span class=\"ui-tooltip-inner3\">$1</span></span>",
		tooltip1: "<span name=\"tooltip\" class=\"ui-tooltip\"><span class=\"ui-tooltip-inner1\">$1</span><span class=\"ui-tooltip-inner2\">$2</span></span>",
		tooltip2: "<span name=\"tooltip\" class=\"ui-tooltip\"><span class=\"ui-tooltip-inner1\">$1</span>",
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
			$("button[name=nextBox]").on("click", function() {
				self.selectNextPartsBox();
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
			var colorName = $firstTd.attr("class")
				.replace("block ","")
				.replace("td_done","")
				.replace("td_light","")
				.replace("block_td","")
				.replace("mark_td","")
				.replace(" ","").replace(" ","");
			var num = 0;
			for(var x=self.col; x>=0; x--) {
				var $td = $tdList.eq(x);
				if($td.hasClass(colorName)) {
					$td.removeClass("td_done").addClass("td_light");
					self.col--;
					num++;
					if(x == $tdList.length-1) {
						var colorCode = colorName.replace("color_","").replace("block_","").replace("mark_","");
						var partsBox = partsBoxMap[colorCode];
						if(partsBox) {
							$firstTd.html(self.tooltip1.replace("$1", num + " x " + colorCode).replace("$2", partsBox));	
						}
						else {
							$firstTd.html(self.tooltip2.replace("$1", num + " x " + colorCode));	
						}
					}
				}
				else {
					var colorCode = colorName.replace("color_","").replace("block_","").replace("mark_","");
					var partsBox = partsBoxMap[colorCode];
					if(partsBox) {
						$firstTd.html(self.tooltip1.replace("$1", num + " x " + colorCode).replace("$2", partsBox));	
					}
					else {
						$firstTd.html(self.tooltip2.replace("$1", num + " x " + colorCode));	
					}
					break;
				}
			}
			self.col = self.col < 0 ? 0 : self.col;
			self.saveWork();
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
			var colorName = $firstTd.attr("class")
				.replace("block ","")
				.replace("td_done","")
				.replace("td_light","")
				.replace("block_td","")
				.replace("mark_td","")
				.replace(" ","").replace(" ","");
			var num = 0;
			for(var x=self.col+1; x<$tdList.length; x++) {
				var $td = $tdList.eq(x);
				if($td.hasClass(colorName)) {
					$td.addClass("td_light");
					self.col++;
					num++;
					if(x == $tdList.length-1) {
						var colorCode = colorName.replace("color_","").replace("block_","").replace("mark_","");
						var partsBox = partsBoxMap[colorCode];
						if(partsBox) {
							$firstTd.html(self.tooltip1.replace("$1", num + " x " + colorCode).replace("$2", partsBox));	
						}
						else {
							$firstTd.html(self.tooltip2.replace("$1", num + " x " + colorCode));	
						}
					}
				}
				else {
					var colorCode = colorName.replace("color_","").replace("block_","").replace("mark_","");
					var partsBox = partsBoxMap[colorCode];
					if(partsBox) {
						$firstTd.html(self.tooltip1.replace("$1", num + " x " + colorCode).replace("$2", partsBox));	
					}
					else {
						$firstTd.html(self.tooltip2.replace("$1", num + " x " + colorCode));	
					}
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
		selectNextPartsBox: function() {
			var self = this;
			var $table = $("table.parts_table");
			$table.find("span[name=tooltip]").remove();
			var colorCodeTdList = $table.find("td.parts_col_td");
			var parsNumTdList = $table.find("td.parts_row_td");
			var num = $table.find("td.parts_col_td.parts_done").length;
			if(num == colorCodeTdList.length || !colorCodeTdList.eq(num).text()) {
				$table.find("td.parts_done").removeClass("parts_done");
				return;
			}
			var colorCode = colorCodeTdList.eq(num).text();
			var partsBox = partsBoxMap[colorCode];
			colorCodeTdList.eq(num).append(self.partsTooltip.replace("$1", partsBox||""));
			colorCodeTdList.eq(num).addClass("parts_done");
			parsNumTdList.eq(num).addClass("parts_done");
		}
	}
	App.bindEvents();
});
