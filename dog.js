
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

Dog.prototype.update = function () {

	this.vel.add(this.acc);
	this.pos.add(this.vel);
	
	this.acc.mult(0);
}

Dog.prototype.behaviors = function () {
	var boundaries = this.boundaries();
	var separation = this.separation(dogs);
	var seek = this.seek(createVector(mouseX, mouseY));
	separation.mult(0.1);
	boundaries.mult(2);
	this.applyForce(separation);
	this.applyForce(boundaries);
	this.applyForce(seek);
}
Dog.prototype.applyForce = function (f) {
	this.acc.add(f);
}
Dog.prototype.align = function (dogs) {
	var desired = createVector();
	var count = 0;
	for (var i = 0; i < dogs.length; i++) {
		var v = dogs[i]
		if (v !== this) {
			var d = dist(this.pos.x, this.pos.y, v.pos.x, v.pos.y);
			if (d < 15)
			{
				count++;
				desired.add(v.vel.div(d));
			}
		}
	}

	if (count > 0) 
	{
		desired.div(count);
		desired.normalize();
		desired.mult(this.maxSpeed);
		var steer = desired
		steer.setMag(this.maxSpeed);
		steer.limit(this.maxForce);
		return steer;
	}
	else return createVector(0, 0);
	
}
Dog.prototype.flee = function (t) {
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
Dog.prototype.seek = function (t) {
	var desired = p5.Vector.sub(t, this.pos);
	var d = desired.mag();
	desired.setMag(this.maxSpeed);
	var steer = p5.Vector.sub(desired, this.vel);
	steer.setMag(this.maxSpeed);
	steer.limit(this.maxForce);

	if (d < 150) return steer;
	else return createVector(0, 0);
}
// Separation
// Method checks for nearby dogs and steers away
Dog.prototype.separation = function (dogs) {
	var desiredSeparation = 50;
	var sum = createVector();
	var count = 0;
	// For every boid in the system, check if it's too close
	for (var i = 0; i < dogs.length; i++) {
		var d =dist(this.pos.x, this.pos.y, dogs[i].pos.x, dogs[i].pos.y);
		// If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
		if ((d > 0) && (d < desiredSeparation)) {
			// Calculate vector pointing away from neighbor
			var diff = p5.Vector.sub(this.pos, dogs[i].pos);
			diff.normalize();
			diff.div(d);        // Weight by distance
			sum.add(diff);
			count++;            // Keep track of how many
		}
	}
	// Average -- divide by how many
	if (count > 0) {
		sum.div(count);
		// Our desired vector is the average scaled to maximum speed
		sum.normalize();
		sum.setMag(this.maxSpeed);
		// Implement Reynolds: Steering = Desired - Velocity
		var steer = p5.Vector.sub(sum, this.velocity);
		steer.limit(this.maxforce);
		return steer;
	}
	else return createVector(0, 0);
};
Dog.prototype.arrive = function (t) {
	var desired = p5.Vector.sub(t, this.pos);
	var d = desired.mag();
	var speed = this.maxSpeed;
	if (d < 100) speed = map(d, 0, 100, 0, this.maxSpeed);
	desired.setMag(speed)
	var steer = p5.Vector.sub(desired, this.vel);
	steer.limit(this.maxForce);
	return steer;

}
Dog.prototype.show = function () {
	push()

	var theta = this.vel.heading() + PI / 2

	for (var i = 0; i < this.layers.length; i++) {
		push();
		translate(this.pos.x, this.pos.y - i);
		if (this.vel.mag() > 0.01) rotate(theta);
		var layer = this.layers[i];
		image(layer, -layer.width / 2, -layer.height / 2);
		pop();
	}

	pop();
}
Dog.prototype.boundaries = function () {

	var desired = null;

	if (this.pos.x < 0) {
		desired = createVector(this.maxSpeed, this.vel.y);
	}
	else if (this.pos.x > width) {
		desired = createVector(-this.maxSpeed, this.vel.y);
	}

	if (this.pos.y < 0) {
		desired = createVector(this.vel.x, this.maxSpeed);
	}
	else if (this.pos.y > height) {
		desired = createVector(this.vel.x, -this.maxSpeed);
	}

	if (desired !== null) {
		desired.normalize();
		desired.mult(this.maxSpeed);
		var steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);
		return steer;
	}
	return createVector(0, 0);

};
