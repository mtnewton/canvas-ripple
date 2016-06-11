var canvas, ctx, img;
var toDraw = []
var leave = 2;

var settings = {
	baseColor: {r:255, g:255, b:255},
	rate: 5,
	offset: {x:0.5, y:0.5},
	life: 10,
	ease: Power1.easeOut,
	border: 1
}

function init() {
	canvas = document.getElementById("canvas");
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	ctx = canvas.getContext("2d");
	ctx.width = canvas.offsetWidth;
	ctx.height = canvas.offsetHeight;
	ctx.max = (canvas.width>canvas.height ? canvas.width : canvas.height);
	
	TweenLite.ticker.addEventListener('tick', loop);
	
	TweenMax.from({}, 1/settings.rate, {repeat:-1, onRepeat:function(){
		var offset = randomOffset();
		var circle = {x:offset.x, y:offset.y, radius:-settings.border, color:randomPastel()}
		TweenMax.to(circle, settings.life, {radius:ctx.max, onComplete:function(tween){
			if(!leave){
				toDraw.shift();
			}else{
				leave--
			}						
		}, onCompleteParams:["{self}"], ease:settings.ease})
		toDraw.push(circle);

	}});
}

function randomOffset() {
	var w = ctx.width * settings.offset.x;
	var h = ctx.height * settings.offset.y;
	var x = Math.round(Math.random()*w) - (w/2);
	var y = Math.round(Math.random()*h) - (h/2);
	return {x:x, y:y};
}

function randomPastel(){
	var r = Math.floor((Math.round(Math.random()*255) + settings.baseColor.r)/2);
	var g = Math.floor((Math.round(Math.random()*255) + settings.baseColor.g)/2);
	var b = Math.floor((Math.round(Math.random()*255) + settings.baseColor.b)/2);
	return rgbToHex(r, g, b);
}

//function from http://stackoverflow.com/a/5624139
function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
			
//function from http://stackoverflow.com/a/5624139
function hexToRgb(hex) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function screenshot() {
	var image = canvas.toDataURL("image/png")//.replace("image/png", "image/octet-stream");
	window.open(image, "_blank")
}

function menu(){
	var options = document.getElementById("options");
	if (options.style.display = "" || options.style.display == 'block' ) {
		options.style.display = 'none';
	} else {
		options.style.display = 'block';
	}
}

function apply() {
	var rate = parseFloat(document.getElementById('spawnRate').value);
	var offsetX = parseFloat(document.getElementById('offsetX').value);
	var offsetY = parseFloat(document.getElementById('offsetY').value);
	var life = parseFloat(document.getElementById('lifetime').value);
	var border = parseFloat(document.getElementById('border').value);
	var rgb = hexToRgb(document.getElementById('baseColor').value);
	
	settings.rate = rate;baseColor
	settings.offset = {x:offsetX, y:offsetY};
	settings.life = life;
	settings.border = border;
	settings.baseColor = rgb;
	
	TweenMax.killAll();
	toDraw = [];
	
	init();
	
}

function loop() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	
	ctx.save()
	ctx.translate(ctx.width/2, ctx.height/2);
	for(c in toDraw){
		ctx.save();
		if(settings.border){
			ctx.beginPath();
			ctx.fillStyle = "#000";
			ctx.arc(toDraw[c].x, toDraw[c].y, Math.max(toDraw[c].radius+settings.border, 0), 0, 2 * Math.PI);
			ctx.fill();
		}
		ctx.beginPath();
		ctx.fillStyle = toDraw[c].color;
		ctx.arc(toDraw[c].x, toDraw[c].y, Math.max(toDraw[c].radius, 0), 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}
	ctx.restore();
}