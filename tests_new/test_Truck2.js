function Test_Truck() {
    camera.position.set(0,0,300);
    world.SetGravity(new b2Vec2(0, -10));

    tell('Use arrow keys or WS to move.');

    this.ground = new Hill();

    /*this.ground = world.add({ 
        shape: 'chaine',
        mx:-100,
        vertices:new Hill(),//[-100, -5, 100, -5],
        density: 0, friction: 0.8, restitution:0,
        groupIndex : 0,
        type: 'static'
    });*/

    this.input = {up:false, down:false, left:false, right:false};

    this.truck = new Truck(new b2Vec2(0, 2));
}

Test_Truck.prototype.Keyboard = function(char, code) {
    switch (code) {
        case 90:case 87:case 38: this.input.up = true; break;
        case 83:case 40: this.input.down = true; break;
        case 81:case 65:case 37: this.input.left = true;  break;
        case 68:case 39: this.input.right = true;this.ground.move(1); break;
    }
};

Test_Truck.prototype.KeyboardUp = function(char, code) {
    switch (code) {
        case 90:case 87:case 38: this.input.up = false; break;
        case 83:case 40: this.input.down = false; break;
        case 81:case 65:case 37: this.input.left = false; break;
        case 68:case 39: this.input.right = false; break;
    }
};

Test_Truck.prototype.Step = function() {

    this.truck.update(this.input);
    this.ground.update(this.truck.position.x);
    follow(this.truck.position);
    world.Step(1/60, 8, 3);

}

function Truck(pos){
    this.position = null;
    this.chassis = world.add({
        x:pos.x, y:pos.y,
        mx:-0.7, my:-0.,
        shapes:[
            {shape:'polygon', density:1, groupIndex:-1,  vertices:[-1.37, -0.5, 2.6, -0.6, 2.33, -0.88, 1.94, -1.03, -0.75, -0.84]},//bottom
            {shape:'polygon', density:1, groupIndex:-1, vertices:[-4.47, 0.99, -0.23, 0.89, -0.23, -0.49, -4.31, -0.32, -4.53, 0.25]},//back
            {shape:'polygon', density:2, groupIndex:-1, vertices:[-0.19, 0.88, 3.51, 0.8, 4.75, 0.48, 4.83, -0.08, 4.77, -0.47, 4.45, -0.66, -0.2, -0.49]},//front
            {shape:'polygon', density:1, groupIndex:0, vertices:[-0.06, 1.91, 1.31, 1.86, 1.84, 1.42, 2.51, 0.83, 1.57, 0.85, -0.17, 0.88]},//top
            {shape:'polygon', density:1, groupIndex:0, vertices:[ -0.47, 1.9, -0.25, 1.89, -0.28, 0.89, -0.51, 0.9 ]},//b1
            {shape:'polygon', density:1, groupIndex:0, vertices:[ -0.76, 1.9, -0.53, 1.9, -0.57, 0.9, -0.79, 0.9 ]},//b2
            {shape:'polygon', density:1, groupIndex:0, vertices:[ -0.76, 1.89, -0.77, 1.7, -3.03, 0.96, -3.54, 0.96]},//b3
        ],
    });

    this.wheelF = new Wheel(new b2Vec2(pos.x+2.8, pos.y-2));
    this.wheelB = new Wheel(new b2Vec2(pos.x-2.8, pos.y-2));

    this.jointB = world.addJoint({
        type:'wheel', visible: false,
        bodyA: this.chassis, bodyB: this.wheelB.body,
        frequencyHz: 2, dampingRatio: 0.9,
        enableMotor:true, maxMotorTorque:180,
        axis : this.wheelB.body.GetPosition(),
        angle: new b2Vec2(0, 1)
    });

    this.jointF = world.addJoint({
        type:'wheel', visible: false,
        bodyA: this.chassis, bodyB: this.wheelF.body,
        frequencyHz: 2, dampingRatio: 0.9,
        enableMotor:true, maxMotorTorque:180,
        axis : this.wheelF.body.GetPosition(),
        angle: new b2Vec2(0, 1)
    });

    console.log(this.chassis)
}

Truck.prototype = {
    constructor: Truck,
    update : function(input){
        this.jointB.SetMotorSpeed(3*Math.PI * (input.down ? 1 : input.up ? -1 : 0));
        this.jointF.SetMotorSpeed(3*Math.PI * (input.down ? 1 : input.up ? -1 : 0));

        this.position = this.chassis.GetPosition();

        

    }

}

function Wheel(pos){

    this.body = world.add({
        shape:'circle', radius:0.5, x:pos.x, y:pos.y, 
        density:4, restitution:0.1, friction:0.2, 
        groupIndex : 0 
    });

    this.part = [];
    var n = 18;
    var distance = 1.2;
    var rad1 = Math.TwoPI/n;
    var rad2 = rad1*0.5;

    for(var i=0; i<n; i++){

        var r = rad1*i;
        var angle = b2Vec2.orbite(r, distance);
        var axis = b2Vec2.orbite(r-rad2, distance, pos);
        var axisend = b2Vec2.orbite((r+rad1)-rad2, distance, pos);
        
        this.part[i] = world.add({
            shape:'box', 
            x:angle.x+pos.x, y:angle.y+pos.y,
            w:0.06, h:0.36, angle:r, 
            density:3.5, restitution:0, friction:0.95, 
            groupIndex : -1 
        });

        var joint = world.addJoint({
            type:'wheel', visible: false,
            bodyA: this.body, bodyB: this.part[i],
            frequencyHz: 25, dampingRatio: 0.7,
            axis : this.part[i].GetPosition(),
            angle: angle,
        });

        if (i>0) {
            var j1 = world.addJoint({
                type:'revolute', visible: false,
                bodyA: this.part[i-1], bodyB: this.part[i],
                axis: axis,
            });
        }
        if (i==n-1) {
            var j1 = world.addJoint({
                type:'revolute', visible: false,
                bodyA: this.part[i], bodyB: this.part[0],
                axis: axisend,
            });
        }
    }
}