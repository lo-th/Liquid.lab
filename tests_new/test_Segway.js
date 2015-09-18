function Test_Segway() {

    camera.position.set(0,2,20);

    world.SetGravity(new b2Vec2(0, -30));

    this.ground = world.add({ 
        shape: 'edge',
        p1: new b2Vec2(-100, 0), p2: new b2Vec2(100, 0),
        density: 1, friction: 1, type: 'static', userData: 1
    });

    // move bodys

    this.carBody = world.add({
        shape:'box', w:1, h:1, x:0, y:2,
        density:1, friction:1, fixedRotation:true,
        allowSleep:false
    });

    this.wheelBody = world.add({ 
        shape: 'circle', radius: 1, x: 0, y: 2,
        density: 2, friction: 1, groupIndex: -1,
        allowSleep:false, userData:11
    });

    this.pendulumBody = world.add({ 
        shape: 'box', w: 1, h: 10, x: 0, y: 2 + 0.5 * 10,
        density: 1, friction: 1, groupIndex: -1,
        allowSleep:false
    });

    // joints

    this.wheelJoint = world.addJoint({
        type:'wheel', visible: true,
        bodyA: this.carBody, bodyB: this.wheelBody,
        axis: this.wheelBody.GetPosition(), angle: new b2Vec2(0,1),
        frequencyHz: 20, dampingRatio: 1, maxMotorTorque: 500,
        enableMotor: true
    });

    this.pendulumJoint = world.addJoint({ 
        type:'revolute', visible: false,
        bodyA: this.carBody, bodyB: this.pendulumBody,
        axis: new b2Vec2(0,2), localAnchorB: new b2Vec2(0, -0.5 * 10),
        enableMotor: true
    });

    // simulation

    this.posAvg = 0;
    this.targetPosition = 0;
    this.lastTimeStep = 1/60;
    this.angleController = new PIDController(1000, 0, 250);
    this.positionController = new PIDController(0.5, 0, 1.5);

    // cahnge position

    var _this = this;
    setInterval(function(){_this.changeTargetPos()}, 4000);

    // active contact

    world.SetContactListener(this);

}

Test_Segway.prototype.changeTargetPos = function() {  
    this.targetPosition = this.targetPosition===0 ? 10 : 0;
}

Test_Segway.prototype.PreSolve = function(contact, oldManifold) {
    var a = contact.GetFixtureA().body.GetUserData();
    var b = contact.GetFixtureB().body.GetUserData()

    var groundContact = false;
    if(a===1 && b===11) groundContact = true;
    if(a===11 && b===1) groundContact = true;

    var targetAngle = 0;
    if ( groundContact ) {
        this.posAvg = 0.95 * this.posAvg + 0.05 * this.pendulumBody.GetPosition().x;
        this.positionController.currentError = this.targetPosition - this.posAvg;
        this.positionController.step(this.lastTimeStep);
        var targetLinAccel = this.positionController.output;
        targetLinAccel = Math.clamp(targetLinAccel, -10.0, 10.0);

        targetAngle = targetLinAccel / -30;//world.gravity.y;
        targetAngle = Math.clamp(targetAngle, -15 * Math.degtorad, 15 * Math.degtorad);
    }

    var currentAngle = this.pendulumBody.GetAngle();
    currentAngle = Math.normalizeAngle(currentAngle);
    this.angleController.currentError = ( targetAngle - currentAngle );
    this.angleController.step(this.lastTimeStep);
    var targetSpeed = this.angleController.output;

    // give up if speed required is really high
    if ( Math.abs(targetSpeed) > 1000 ) targetSpeed = 0;

    // this is the only output
    var targetAngularVelocity = -targetSpeed / (2 * Math.PI * 1);// wheel circumference = 2*pi*r
    this.wheelJoint.SetMotorSpeed(targetAngularVelocity);
}

function PIDController(p,i,d){
    this.gainP = p;
    this.gainI = i;
    this.gainD = d;

    this.currentError = 0;
    this.previousError = 0;
    this.integral = 0;
    this.output = 0;
}

PIDController.prototype.step = function(dt) {
    this.integral = dt * (this.integral + this.currentError);
    var derivative = (1 / dt) * (this.currentError - this.previousError);
    this.output = this.gainP * this.currentError + this.gainI * this.integral + this.gainD * derivative;
    this.previousError = this.currentError;
};       