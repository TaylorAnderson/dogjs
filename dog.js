
function Dog() {
	this.pos = createVector(random(0, width), random(0, height));

	this.vel = createVector(random(-2, 2), random(-2, 2))
	this.acc = createVector();
	this.r = 8;
	this.maxSpeed = 3;
	this.maxForce = 0.3;
	
	this.layers = [
		loadImage("dog/dog1.png"),
		loadImage("dog/dog1.png"),
		loadImage("dog/dog1.png"),
		loadImage("dog/dog1.png"),
		loadImage("dog/dog2.png"),
		loadImage("dog/dog2.png"),
		loadImage("dog/dog2.png"),
		loadImage("dog/dog2.png"),
		loadImage("dog/dog3.png"),
		loadImage("dog/dog4.png"),
		loadImage("dog/dog5.png"),
		loadImage("dog/dog6.png"),
		loadImage("dog/dog7.png")
	]
	
}

Dog.prototype.update = function() {
	this.pos.add(this.vel);
	this.vel.add(this.acc);
	this.acc.mult(0);
}

Dog.prototype.behaviors = function() {
	var align = this.align(dogs);
	align.mult(0.5);
	this.applyForce(align);
}
Dog.prototype.applyForce = function(f) {
	this.acc.add(f);

}
Dog.prototype.align = function(dogs) {
	var neighbours = [];
	var desired = createVector();
	for (var i = 0; i < dogs.length; i++)
	{
		var v = dogs[i]
		if (v !== this)
		{
			var d = p5.Vector.sub(this.pos, v.pos)
			if (d.mag() < 15) neighbours.push(v);
		}
	}
	neighbours.forEach(function(v, i) {
		desired.add(v.vel);
	});
	
	if (neighbours.length > 0) desired.div(neighbours.length);
	else desired = this.vel;
	var steer = p5.Vector.sub(desired, this.vel);
	
	steer.setMag(this.maxSpeed);
	steer.limit(this.maxForce);
	return steer;
}
Dog.prototype.flee = function(t) {
	var desired = p5.Vector.sub(t, this.pos);
	var d = desired.mag();

	desired.setMag(this.maxSpeed);
	desired.mult(-1);
	var steer = p5.Vector.sub(desired, this.vel);
	steer.setMag(this.maxSpeed);
	steer.limit(this.maxForce);

	if (d < 70) return steer;
	else return createVector(0, 0);

}
Dog.prototype.arrive = function(t) {
	var desired = p5.Vector.sub(t, this.pos);
	var d = desired.mag();
	var speed = this.maxSpeed;
	if (d < 100) speed = map(d, 0, 100, 0, this.maxSpeed);
	desired.setMag(speed)
	var steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxForce);
	return steer;

}
Dog.prototype.show = function() {
	push()
	
	var theta = this.vel.heading() + PI/2
	
	for (var i = 0; i < this.layers.length; i++)
	{
		push();
		translate(this.pos.x, this.pos.y-i);
		if (this.vel.mag() > 0.01) rotate(theta);
		var layer = this.layers[i];
		image(layer,-layer.width/2, -layer.height/2);
		pop();
	}

	pop();
}
Dog.prototype.boundaries = function() {

    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    }
    else if (this.position.x > width -d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    }
    else if (this.position.y > height-d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
