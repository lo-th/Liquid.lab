function Test_Planet() {
    camera.position.y = 0;
    camera.position.z = 15;

    world.SetGravity(new b2Vec2(0, 0));

    tell('Click on view to add box');

    this.forceReducer = 0.005;
    this.orbite = 0;

    this.planets = [];
    this.boxs = [];

    this.planets.push(new Planet(0, 0, 4.00, 250));
    this.planets.push(new Planet(0, -4, 2.50, 250, 'kinematic'));


    this.boxs.push(new Crate(0,-3));
    this.boxs.push(new Crate(3,0));
    this.boxs.push(new Crate(-3,0));
}

Test_Planet.prototype.MouseDown = function(p) {
    this.boxs.push(new Crate(p.x,p.y));
};

Test_Planet.prototype.Step = function() {
    var i = this.boxs.length;
    var j, b, p;
    var bpos, ppos, distance, angle, radius;

    j = this.planets.length;
    while(j--){
        p = this.planets[j]
        ppos = p.body.GetWorldCenter();
        
        i = this.boxs.length;
        while(i--){
            b = this.boxs[i];
            bpos = b.GetWorldCenter();
            // distance between the planet and the crate
            distance = Math.distance(bpos, ppos);
            // checking if the distance is less than gravity radius
            if(distance<p.gRadius){
                // angle between the planet and the crate
                angle = Math.angleBetween(bpos, ppos);
                radius = p.gravity*this.forceReducer;
                // add gravity force to the crate in the direction of planet center
                b.ApplyForce( b2Vec2.orbite(angle, radius), bpos);
            }
        }
        p.renderGravity();
    }

    // moon orbite
    this.orbite += 0.02;
    //this.planets[1].body.SetAngularVelocity(0);
    this.planets[1].body.SetAngularVelocity(this.orbite-this.planets[1].body.GetAngle());
    this.planets[1].body.SetLinearVelocity(b2Vec2.orbite(this.orbite, 4, new b2Vec2()))

    Step();
}

function Crate(x, y){
    var size = Math.rand(0.2, 0.4)
    return world.add({shape:'box', w:size, h:size, x:x, y:y, density:size*10 });
}

function Planet(x, y, gravityRadius, gravity, type){
    this.gRadius = gravityRadius;
    this.gravity = gravity;
    if(type==='kinematic') angle = Math.angleBetween(new b2Vec2(x, y), new b2Vec2()) + Math.PI;
    else angle = Math.PI90;
    this.body = world.add({shape:'circle', radius:gravityRadius/4, x:x, y:y, angle:angle, density:10, type:type || 'static' });
    return this;
}

Planet.prototype = {
    constructor: Planet,
    renderGravity : function(){
        var t = this.body.GetTransform();
        liquidRender.insertCircleVertices(t, this.gRadius, 0, 0, 0, 0.4, 0.4, true);
    }
}