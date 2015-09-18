function Test_Buoyancy() {
    world.SetGravity(new b2Vec2(0, -10));

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;

    //addWall(3.2,4.8,6.4,0.20);
    addWall(0,-2.3,5.8,0.20);
    addWall(-3,0, 0.2,4.8);
    addWall(3,0,0.2,4.8);

    addWater(0,-0.7,5.8,3);

    var i = 10;

    while(i--) addCrate(RandomFloat(-2, 2), RandomFloat(4, 6), i);

    this.buo = new Buoyancy();

    world.SetContactListener(this);
}

Test_Buoyancy.prototype.Step = function() {
    this.buo.update();
    world.Step(1/60, 10, 10);
}

Test_Buoyancy.prototype.BeginContactBody = function(contact) {
    var a = contact.GetFixtureA();//.body.GetUserData();
    var b = contact.GetFixtureB();//.body.GetUserData();

    if(a.isSensor && b.body.GetType() === b2_dynamicBody ) this.buo.add(b);
    if(b.isSensor && a.body.GetType() === b2_dynamicBody ) this.buo.add(a);


}

Test_Buoyancy.prototype.EndContactBody = function(contact) {
    var a = contact.GetFixtureA();//.body.GetUserData();
    var b = contact.GetFixtureB();//.body.GetUserData();

    if(a.isSensor && b.body.GetType() === b2_dynamicBody ) this.buo.remove(b);
    if(b.isSensor && a.body.GetType() === b2_dynamicBody ) this.buo.remove(a);
};




function Buoyancy(){
    this.pair = [];
};

Buoyancy.prototype = {
    constructor: Buoyancy,
    add : function(b){
        this.pair.push(b.body.GetUserData());
    },
    remove : function(b){
        this.pair.splice(this.pair.indexOf(b.body.GetUserData()), 1);
    },
    update:function(){
        var i = world.bodies.length, b;
        var j;
        while(i--){
            b = world.bodies[i];
            var j = this.pair.length;
            while(j--){
                if(this.pair[j] === b.GetUserData()){
                    var buoyancyForce = new b2Vec2(0,10);
                    buoyancyForce.y*= -b.GetPosition().y+3
                    var centre = b.GetWorldCenter()
                    //if(b.fixtures[0].shape.vertices) centre= findCentroid(b.fixtures[0].shape.vertices);

                    b.ApplyForce( buoyancyForce, centre );
                    b.ApplyTorque(-b.GetInertia()/b.GetMass()*b.GetAngularVelocity())
                }
            }
          //  
            //console.log(this.pair[i].b.body)
         //   return
            //.body.ApplyForce( buoyancyForce, this.pair.b.body.GetWorldCenter() )
        }
    }
 }


function getArea(vs) {
    var count = vs.length;
    var area=0.0;
    var p1X=0.0;
    var p1Y=0.0;
    var inv3=1.0/3.0;
    var p2, p3;
    for (var i = 0; i < count; ++i) {
        p2 = vs[i];
        p3 = ((i+1)<count) ? vs[i+1] : vs[0];
        var e1X=p2.x-p1X;
        var e1Y=p2.y-p1Y;
        var e2X=p3.x-p1X;
        var e2Y=p3.y-p1Y;
        var D = (e1X * e2Y - e1Y * e2X);
        var triangleArea=0.5*D;
        area+=triangleArea;
    }
    return area;
};

function findCentroid(vs) {
    var count = vs.length;
    var c = new b2Vec2();
    var area=0.0;
    var p1X=0.0;
    var p1Y=0.0;
    var inv3=1.0/3.0;
    var p2, p3;
    for (var i = 0; i < count; ++i) {
        p2 = vs[i];
        p3 = ((i+1)<count) ? vs[i+1] : vs[0];
        var e1X=p2.x-p1X;
        var e1Y=p2.y-p1Y;
        var e2X=p3.x-p1X;
        var e2Y=p3.y-p1Y;
        var D = (e1X * e2Y - e1Y * e2X);
        var triangleArea=0.5*D;
        area+=triangleArea;
        c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
        c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
    }
    c.x*=(1.0/area);
    c.y*=(1.0/area);
    return c;
};

function addWall(x,y,w,h) {
    var worldScale=1;
    var shape = new b2PolygonShape();
    shape.SetAsBoxXY(w/worldScale/2,h/worldScale/2);
    var fd = new b2FixtureDef();
    fd.density=0;
    fd.friction=1;
    fd.restitution=0.5;
    fd.shape=shape;
    //fd.filter.groupIndex = -2;
    var bodyDef = new b2BodyDef();
    bodyDef.position.Set(x/worldScale,y/worldScale);
    var wall = world.CreateBody(bodyDef);
    wall.CreateFixtureFromDef(fd);
}

function addWater(x,y,w,h) {
    var shape = new b2PolygonShape();
    shape.SetAsBoxXY(w/2,h/2);
    var fd = new b2FixtureDef();
    fd.density=0;
    fd.friction=1;
    fd.restitution=0.5;
    fd.shape=shape;
    fd.isSensor = true;
    var bd = new b2BodyDef();
    bd.position.Set(x,y);
    bd.isSensor = true;
    //bd.userData = 0;
    var wall = world.CreateBody(bd);
    wall.CreateFixtureFromDef(fd);
}

function addCrate(x, y, id){
    var a = 0.2;
    var shape = new b2PolygonShape;
    shape.SetAsBoxXY(a, a);
    var fd = new b2FixtureDef();
    fd.shape = shape;
    fd.isSensor = false;
    
    //fd.filter.groupIndex = -1;

    var bd = new b2BodyDef;
    bd.position.Set(x,y);
    bd.type = b2_dynamicBody;
    bd.userData = id;
    bd.allowSleep = false;

    var body = world.CreateBody(bd);
    body.CreateFixtureFromDef(fd);
    return body;
}