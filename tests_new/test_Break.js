function Test_Break() {

    world.SetGravity(new b2Vec2(0, -1));

    tell('Click on view to break object');

    camera.position.x = 3.2;
    camera.position.y = 2.4;
    camera.position.z = 10;

    addWall(3.2,4.8,6.4,0.20);
    addWall(3.2,0,6.4,0.20);
    addWall(0,2.4,0.2,4.8);
    addWall(6.4,2.4,0.2,4.8);
    addWall(3.2,2.4,2,2);
    addWall(2.5,1.1,0.6,0.6);
    addWall(3.9,1.1,0.6,0.6);

    this.callback = new laserFired();
}

var explosionCenter = new b2Vec2();
var explodingBodies = [];
var affectedByLaser = [];
var entryPoint = [];

Test_Break.prototype.MouseDown = function(p, queryCallback) {
    var cutAngle;
    var decal = 2.0;

    explosionCenter.Set(p.x,p.y);
    explodingBodies = [];
    if (queryCallback.fixture) {
        console.log('bb')
        var body = queryCallback.fixture.body;
        explodingBodies.push(body);
        for (var i=0; i<5; i++) {
            cutAngle = Math.random()*(Math.PI*2);
            var p1 = new b2Vec2(explosionCenter.x+(i/100)-decal*Math.cos(cutAngle),explosionCenter.y-decal*Math.sin(cutAngle));
            var p2 = new b2Vec2(explosionCenter.x+decal*Math.cos(cutAngle),explosionCenter.y+decal*Math.sin(cutAngle));
            affectedByLaser = [];
            entryPoint = [];
            world.RayCast(this.callback,p1,p2);
            world.RayCast(this.callback,p2,p1);
        }

    }
};




function laserFired() {
    this.fixture = null;
};

laserFired.prototype.ReportFixture = function(fixture, point, normal, fraction) {
   // var entryPoint = test.entryPoint;
    this.fixture = fixture;
    this.point = point;
    this.normal = normal;

    var affectedBody=this.fixture.body;
    if (explodingBodies.indexOf(affectedBody)!=-1) {
        var affectedPolygon = fixture.shape;
        var fixtureIndex=affectedByLaser.indexOf(affectedBody);
        if (fixtureIndex==-1) {
            affectedByLaser.push(affectedBody);
            entryPoint.push(this.point);
        } else {
            var rayCenter=new b2Vec2((point.x+entryPoint[fixtureIndex].x)/2,(point.y+entryPoint[fixtureIndex].y)/2);
            var rayAngle=Math.atan2( entryPoint[fixtureIndex].y-point.y, entryPoint[fixtureIndex].x-point.x);
            var polyVertices = affectedPolygon.vertices;
            var newPolyVertices1 = [];
            var newPolyVertices2 = [];
            var currentPoly=0;
            var cutPlaced1=false;
            var cutPlaced2=false;
            for (var i=0; i<polyVertices.length; i++) {
                var worldPoint=affectedBody.GetWorldPoint(polyVertices[i]);
                var cutAngle=Math.atan2(worldPoint.y-rayCenter.y,worldPoint.x-rayCenter.x)-rayAngle;
                if (cutAngle<Math.PI*-1) {
                    cutAngle+=2*Math.PI;
                }
                if (cutAngle>0&&cutAngle<=Math.PI) {
                    if (currentPoly==2) {
                        cutPlaced1=true;
                        newPolyVertices1.push(point);
                        newPolyVertices1.push(entryPoint[fixtureIndex]);
                    }
                    newPolyVertices1.push(worldPoint);
                    currentPoly=1;
                }
                else {
                    if (currentPoly==1) {
                        cutPlaced2=true;
                        newPolyVertices2.push(entryPoint[fixtureIndex]);
                        newPolyVertices2.push(point);
                    }
                    newPolyVertices2.push(worldPoint);
                    currentPoly=2;
                }
            }
            if (! cutPlaced1) {
                newPolyVertices1.push(point);
                newPolyVertices1.push(entryPoint[fixtureIndex]);
            }
            if (! cutPlaced2) {
                newPolyVertices2.push(entryPoint[fixtureIndex]);
                newPolyVertices2.push(point);
            }
            createSlice(newPolyVertices1,newPolyVertices1.length);
            createSlice(newPolyVertices2,newPolyVertices2.length);
            world.DestroyBody(affectedBody);
        }
    }
    return 1;
};

function addWall(x,y,w,h) {
    return world.add({shape:'box', w:w, h:h, x:x, y:y, density:0, friction:1, restitution:0.5, type:'static' });
}

function findCentroid(vs, count) {
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

function getArea(vs, count) {
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

function createSlice(vertices,numVertices) {
    var mixRadius=5.0;
    var explosionRadius=5.0;
    var vect = [];
    if (getArea(vertices,vertices.length)>=0.015) {
        var centre = findCentroid(vertices,vertices.length);
        for (var i=0; i<numVertices; i++) {
            vect.push(vertices[i].x-centre.x);
            vect.push(vertices[i].y-centre.y);
        }
        var worldSlice = world.add({
            shape:'polygon', vertices:vect, 
            x:centre.x, y:centre.y, 
            density:1, friction:1, restitution:0.5 
        });

        var distX = (centre.x-explosionCenter.x);
        if (distX<0) {
            if (distX<-explosionRadius) distX=0;
            else distX=-mixRadius-distX;
        }
        else {
            if (distX>explosionRadius) distX=0;
            else distX=mixRadius-distX;
        }
        var distY=(centre.y-explosionCenter.y);
        if (distY<0) {
            if (distY<-explosionRadius) distY=0;
            else distY=-mixRadius-distY;
        }
        else {
            if (distY>explosionRadius) distY=0;
            else distY=mixRadius-distY;
        }
        distX*=0.25;
        distY*=0.25;
        worldSlice.SetLinearVelocity(new b2Vec2(distX,distY));
        explodingBodies.push(worldSlice);
    }
}