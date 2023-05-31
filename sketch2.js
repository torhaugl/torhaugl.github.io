delta_time = 2.5
noise_scale = 0.005
flowField = []
n_particles = 2000

class Particle{
    constructor(pos, vel){
        this.lastpos = pos.copy()
        this.pos = pos.copy()
        this.vel = vel
        this.color = color(255, 0, 0, 30)
    }
    update() {
        this.lastpos = this.pos.copy()
        this.pos.add(this.vel.copy().mult(delta_time))
    }
    draw(){
        stroke(this.color)
        strokeWeight(2)
        line(this.lastpos.x, this.lastpos.y, this.pos.x, this.pos.y)
        //circle(this.pos.x, this.pos.y, 5)
    }
}

function setFlowField(flowField, rows, cols){
    console.log(rows)
    size = rows*cols
    for (y = 0; y <= rows; y++) {
        for (x = 0; x < cols; x++) {
            index = x + y * cols
            a = noise(x * noise_scale, y * noise_scale)
            flowField[index] = map(a, 0, 1, 0, 2*Math.PI)
        }
    }
}

function setup(){
    var cnv = createCanvas(windowWidth, windowHeight)
    //var cnv = createCanvas(400, 400)
    cnv.style('display', 'block')
    background(0)

    particles = [];
    for (var i = 0; i < n_particles; i++){
        pos = createVector(random(width), random(height))
        vel = createVector(0,0)
        particles[i] = new Particle(pos, vel)
    }
    setFlowField(flowField, width, height)
}

function draw() {
    for (particle of particles){
        particle.vel = getFlowFieldVelocity(flowField, particle)
        particle.update()
        particle.draw()
    }
}

function getFlowFieldVelocity(flowField, particle){
    index = floor(particle.pos.y) + floor(particle.pos.x) * windowHeight
    if (index < 0 || index >= width*height) {
        particle.color = color(0,0)
        return createVector(0,0)
    }
       
    index = constrain(index, 0, width*height-1)
    angle = flowField[index]
    x = cos(angle)
    y = sin(angle)
    return createVector(x, y)
}

function keyPressed() {
   // this will download the first x seconds of the animation!
   if (key === 's') {
     saveGif('flowfield', 10);
   }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
    background(0)

    particles = [];
    for (var i = 0; i < n_particles; i++){
        pos = createVector(random(width), random(height))
        vel = createVector(0,0)
        particles[i] = new Particle(pos, vel)
    }
    setFlowField(flowField, width, height)

}
