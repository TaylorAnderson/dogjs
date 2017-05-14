var font;
var dogs = [];
function preload()
{
	font = loadFont('Lato-Light.ttf')
}
function setup()
{
	createCanvas(800, 400);
	background(51);
	for (var i = 0; i < 100; i++)
	{
		var v = new Dog(dogs);
		dogs.push(v);
	}
}

function draw()
{
	background(51);
	dogs.sort(sortY);
	for (var i=0; i < dogs.length; i++) {
		var v = dogs[i];
		v.update();
		v.show();
		v.behaviors();
	}
}
function sortY(a, b) {
	if (a.pos.y > b.pos.y) return 1;
	if (a.pos.y == b.pos.y) return 0;
	return -1;
}
