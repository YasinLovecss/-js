var chessmen = [];
var chess = document.getElementById('chess');
var restartbtn = document.getElementById('restart');

var context = chess.getContext('2d');
var me = true;
var over = false;

// 储存所有赢法的数组
var wins = [];
// 赢法统计数组
var meWin = [];
var computerWin = [];



for (var i = 0; i < 15; i++) {
	chessmen[i] = [];
	for (var j = 0; j < 15; j++) {
		chessmen[i][j] = 0; //0表示没有落子，该点为空
	}
}

//初始化三维数组wins
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}

var count = 0;
//所有横线赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
//所有竖线赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
//所有斜线赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//所有反斜线赢法
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

for (var i = 0; i < count; i++) {
	meWin[i] = 0;
	computerWin[i] = 0;
}

context.strokeStyle = "#bfbfbf";

var logo = new Image();
logo.src = "img/logo.png";
logo.onload = function() {
	context.drawImage(logo, 0, 0, 450, 450);
	drawChessBoard();

}


var drawChessBoard = function() {
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 30, 15);
		context.lineTo(15 + i * 30, 435)
		context.stroke();
		context.moveTo(15, 15 + i * 30);
		context.lineTo(435, 15 + i * 30)
		context.stroke();
	}
}

var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if (me) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#D1D1D1");
		gradient.addColorStop(1, "#F9F9F9");
	}

	context.fillStyle = gradient;
	context.fill();
}
chess.onclick = function(e) {
	if (over) {
		return;
	}
	if (!me) {
		return;
	}

	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if (chessmen[i][j] === 0) {
		oneStep(i, j, me);
		chessmen[i][j] = 1; //1表示黑子
		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
				meWin[k]++;
				computerWin[k] = 6;
				if (meWin[k] === 5) {
					window.alert("你赢了");
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAI();
		}
	}


}

var computerAI = function() {
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u = 0;
	var v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chessmen[i][j] === 0) {
				for (var k = 0; k < count; k++) {
					if (wins[i][j][k]) {
						if (meWin[k] === 1) {
							myScore[i][j] += 200;
						} else if (meWin[k] === 2) {
							myScore[i][j] += 400;
						} else if (meWin[k] === 3) {
							myScore[i][j] += 2000;
						} else if (meWin[k] === 4) {
							myScore[i][j] += 10000;
						}
						if (computerWin[k] === 1) {
							computerScore[i][j] += 220;
						} else if (computerWin[k] === 2) {
							computerScore[i][j] += 420;
						} else if (computerWin[k] === 3) {
							computerScore[i][j] += 2200;
						} else if (computerWin[k] === 4) {
							computerScore[i][j] += 20000;
						}
					}
				}
				if (myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] === max) {
					if (computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if (computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] === max) {
					if (myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessmen[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {
			computerWin[k]++;
			meWin[k] = 6;
			if (computerWin[k] === 5) {
				window.alert("你输了,你个菜鸟");
				over = true;
			}
		}
	}
	if (!over) {
		me = !me;
	}
}
