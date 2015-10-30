/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_|
*    @author lo.th / http://lo-th.github.io/labs/
*/

// MATH TOOL

Math.lerp = function (a, b, percent) { return a + (b - a) * percent; }
Math.rand = function (a, b) { return Math.lerp(a, b, Math.random()); }
Math.randInt = function (a, b, n) { return Math.lerp(a, b, Math.random()).toFixed(n || 0)*1;}
Math.degtorad = 0.0174532925199432957;
Math.radtodeg = 57.295779513082320876;
Math.PI90 = Math.PI*0.5;
Math.PI270 = Math.PI+Math.PI90;
Math.TwoPI = 2.0 * Math.PI;

Math.distance = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Math.angleBetween = function (v1, v2) {
    return Math.atan2(v2.y - v1.y, v2.x - v1.x);
};

Math.clamp = function (num, min, max) {
    return Math.min(Math.max(num, min), max);
}

Math.normalizeAngle = function (angle) {
    while (angle >  Math.PI) angle -= Math.PI*2;
    while (angle < -Math.PI) angle += Math.PI*2;
    return angle;
}

// VECTOR TOOL

b2Vec2.orbite = function(angle, radius, pos){
    var v = new b2Vec2();
    pos = pos ||  new b2Vec2()
    v.x = pos.x + radius * Math.cos(angle);
    v.y = pos.y + radius * Math.sin(angle);
    return v;
};


// BODY CREATOR
/*
b2World.prototype.add = function(obj){
    obj = obj || {};   
    var body = this.CreateBody( this.addBodyDef(obj) );
    if(obj.shapes !== undefined){ // Compound
        var i = obj.shapes.length;
        while(i--){
            if(obj.mx) obj.shapes[i].mx = obj.mx;
            if(obj.my) obj.shapes[i].my = obj.my;
            body.CreateFixtureFromDef( this.addFixture(obj.shapes[i]) );
            //body.CreateFixtureFromShape( this.addShape(obj.shapes[i]) , obj.shapes[i].density);
        }
    } else {
        body.CreateFixtureFromDef( this.addFixture(obj) );
    }
    return body;
}

b2World.prototype.addFixture = function(obj){
    var fd = new b2FixtureDef();
    fd.density = obj.density || 0;
    fd.friction = obj.friction || 0.2;
    fd.restitution = obj.restitution || 0.1;
    fd.isSensor = obj.isSensor || false;

    if(obj.groupIndex !== undefined ) fd.filter.groupIndex = obj.groupIndex;
    if(obj.categoryBits !== undefined ) fd.filter.categoryBits = obj.categoryBits;
    if(obj.maskBits !== undefined ) fd.filter.maskBits = obj.maskBits;

    // init shape
    fd.shape = this.addShape(obj);
    return fd;
}

b2World.prototype.addBodyDef = function(obj){
    var bd = new b2BodyDef();
    var type = obj.type || 'dynamic';
    bd.position.Set(obj.x || 0, obj.y || 0);
    bd.angle = obj.angle || 0;
    bd.allowSleep = true; if(obj.allowSleep !== undefined ) bd.allowSleep = obj.allowSleep;
    bd.awake = true; if(obj.awake !== undefined ) bd.awake = obj.awake;
    bd.bullet = obj.bullet || false;
    bd.fixedRotation = obj.fixedRotation || false;
    if(obj.userData !== undefined ) bd.userData = obj.userData;
  
    switch(type){
        case 'dynamic': bd.type = b2_dynamicBody; break;
        case 'static': bd.type = b2_staticBody; break;
        case 'kinematic': bd.type = b2_kinematicBody; break;
    }
    return bd;
}

b2World.prototype.addShape = function(obj){
    var shapeName = obj.shape || 'box';
    var shape;
    switch(shapeName){
        case 'polygon': 
            shape = new b2PolygonShape; 
            var len = obj.vertices.length;
            var dx = obj.mx || 0;
            var dy = obj.my || 0;
            for(var i=0; i<len; i+=2){ shape.vertices.push( new b2Vec2( obj.vertices[i]+dx, obj.vertices[i+1]+dy )); } 
        break;
        case 'box': 
            shape = new b2PolygonShape; 
            shape.SetAsBoxXY((obj.w || 1)*0.5, (obj.h || 1)*0.5);
            //shape.SetAsBoxXYCenterAngle(0.5, 0.5, new b2Vec2(-0.5, 0), 0);
        break;
        case 'circle': shape = new b2CircleShape; shape.radius = obj.radius || 1; break;
        case 'edge': shape = new b2EdgeShape; shape.Set(obj.p1, obj.p2); break;
    }
    if(obj.shapePos) shape.position.Set(obj.shapePos.x, obj.shapePos.y);
    if(obj.shapeAngle) shape.angle = obj.shapeAngle;
    if(obj.close) shape.CreateLoop();
    return shape;
}


// JOINT CREATOR

b2World.prototype.addJoint = function(obj){
    obj = obj || {};

    var type = obj.type || 'wheel';
    var jd;
    switch(type){
        case 'mouse': jd = new b2MouseJointDef; break;
        case 'wheel': jd = new b2WheelJointDef; break;
        case 'prismatic': jd = new b2PrismaticJointDef; break;
        case 'rope': jd = new b2RopeJointDef; break;
        case 'revolute': jd = new b2RevoluteJointDef; break;
        case 'distance': jd = new b2DistanceJointDef; break;
    }

   // jd.collideConnected = obj.collideConnected || false;
    if(obj.collideConnected !== undefined ) jd.collideConnected = obj.collideConnected;

    var bodyA = obj.bodyA || null;
    var bodyB = obj.bodyB || null;

    if(obj.localAnchorA !== undefined ) jd.localAnchorA = obj.localAnchorA;
    if(obj.localAnchorB !== undefined ) jd.localAnchorB = obj.localAnchorB;

    if(obj.enableMotor !== undefined ) jd.enableMotor = obj.enableMotor;
    if(obj.motorSpeed !== undefined ) jd.motorSpeed = obj.motorSpeed;
    if(obj.maxMotorTorque !== undefined ) jd.maxMotorTorque = obj.maxMotorTorque;
    if(obj.maxMotorForce !== undefined ) jd.maxMotorForce = obj.maxMotorForce;
    if(obj.dampingRatio !== undefined ) jd.dampingRatio = obj.dampingRatio;
    if(obj.frequencyHz !== undefined ) jd.frequencyHz = obj.frequencyHz;

    if(obj.enableLimit !== undefined ) jd.enableLimit = obj.enableLimit;

    if(obj.lowerAngle !== undefined ) jd.lowerAngle = obj.lowerAngle;
    if(obj.upperAngle !== undefined ) jd.upperAngle = obj.upperAngle;

    if(obj.lowerTranslation !== undefined ) jd.lowerTranslation = obj.lowerTranslation;
    if(obj.upperTranslation !== undefined ) jd.upperTranslation = obj.upperTranslation;

    if(obj.length !== undefined ) jd.length = obj.length;

    if(obj.maxLength !== undefined ) jd.maxLength = obj.maxLength;

    var joint;
    switch(type){
        case 'wheel': joint = jd.InitializeAndCreate( bodyA, bodyB, obj.axis || new b2Vec2(), obj.angle || new b2Vec2()); break;
        case 'revolute': joint = jd.InitializeAndCreate( bodyA, bodyB,  obj.axis || new b2Vec2()); break;
        case 'prismatic': joint = jd.InitializeAndCreate( bodyA, bodyB, obj.axis || new b2Vec2(),  obj.angle || new b2Vec2()); break;
        case 'distance': jd.bodyA = bodyA; jd.bodyB = bodyB; joint = world.CreateJoint(jd); break;
        case 'rope': jd.bodyA = bodyA; jd.bodyB = bodyB; joint = world.CreateJoint(jd); break;
        case 'mouse': jd.bodyA = bodyA; jd.bodyB = bodyB; jd.target = obj.target || bodyB.GetPosition(); jd.maxForce = obj.maxForce || 1000; joint = world.CreateJoint(jd); break;
    }

    if(obj.visible){
        switch(type){
            case 'wheel': joint.def = jd; break;
            case 'prismatic': joint.def = jd; joint.axis = obj.axis; joint.angle = obj.angle; break;
            //case 'revolute': joint = jd.InitializeAndCreate( bodyA, bodyB,  obj.axis || new b2Vec2()); break;
            case 'mouse': joint.bodyB = jd.bodyB; joint.target = jd.target; joint.decal = jd.bodyB.GetLocalPoint(jd.target); break;
        }
    }

    return joint;
}


// render joint

b2MouseJoint.prototype.type = 'mouse';
b2MouseJoint.prototype.target = null;
b2MouseJoint.prototype.decal = null;
b2MouseJoint.prototype.bodyB = null;

b2WheelJoint.prototype.type = 'wheel';
b2WheelJoint.prototype.def = null;

b2PrismaticJoint.prototype.type = 'prismatic';
b2PrismaticJoint.prototype.def = null;
b2PrismaticJoint.prototype.angle = null;
b2PrismaticJoint.prototype.axis = null;*/