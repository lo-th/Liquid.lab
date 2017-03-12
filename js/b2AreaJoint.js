var b2JointType = {}; 

b2JointType.e_unknownJoint = 0;
b2JointType.e_revoluteJoint = 1;
b2JointType.e_prismaticJoint = 2;
b2JointType.e_distanceJoint = 3;
b2JointType.e_pulleyJoint = 4;
b2JointType.e_mouseJoint = 5;
b2JointType.e_gearJoint = 6;
b2JointType.e_wheelJoint = 7;
b2JointType.e_weldJoint = 8;
b2JointType.e_frictionJoint = 9;
b2JointType.e_ropeJoint = 10;
b2JointType.e_motorJoint = 11;
b2JointType.e_areaJoint = 12;



var b2JointDef = function (type)
{
    this.type = type;
}


b2JointDef.prototype.constructor = b2JointDef;

/** 
 * The joint type is set automatically for concrete joint types.
 * @export 
 * @type {box2d.b2JointType}
 */
b2JointDef.prototype.type = b2JointType.e_unknownJoint;

/** 
 * Use this to attach application specific data to your joints. 
 * @export 
 * @type {*}
 */
b2JointDef.prototype.userData = null;

/** 
 * The first attached body. 
 * @export 
 * @type {box2d.b2Body}
 */
b2JointDef.prototype.bodyA = null;

/** 
 * The second attached body. 
 * @export 
 * @type {box2d.b2Body}
 */
b2JointDef.prototype.bodyB = null;

/** 
 * Set this flag to true if the attached bodies should collide. 
 * @export 
 * @type {boolean}
 */
b2JointDef.prototype.collideConnected = false;


/*
* Copyright (c) 2006-2007 Erin Catto http://www.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

/*goog.provide('b2AreaJoint');

goog.require('b2Settings');
goog.require('b2Joint');
goog.require('b2Math');
*/
/** 
 * Definition for a {@link b2AreaJoint}, which connects a 
 * group a bodies together so they maintain a constant area 
 * within them. 
 * @export 
 * @constructor 
 * @extends {b2JointDef} 
 */
var b2AreaJointDef = function ()
{
    jointDef.call(this, b2JointType.e_areaJoint); // base class constructor

    this.bodies = new Array();
}

//goog.inherits(b2AreaJointDef, b2JointDef);
b2AreaJointDef.prototype = Object.create( jointDef.prototype );
//b2AreaJointDef.prototype.constructor = b2AreaJointDef;
/**
 * @export 
 * @type {b2World}
 */
b2AreaJointDef.prototype.world = null;

/**
 * @export 
 * @type {Array.<b2Body>}
 */
b2AreaJointDef.prototype.bodies = null;

/** 
 * The mass-spring-damper frequency in Hertz. A value of 0 
 * disables softness. 
 * @export 
 * @type {number}
 */
b2AreaJointDef.prototype.frequencyHz = 0;

/** 
 * The damping ratio. 0 = no damping, 1 = critical damping. 
 * @export 
 * @type {number}
 */
b2AreaJointDef.prototype.dampingRatio = 0;

/** 
 * @export 
 * @return {void} 
 * @param {b2Body} body
 */
b2AreaJointDef.prototype.AddBody = function (body)
{
    this.bodies.push(body);

    if (this.bodies.length === 1)
    {
        this.bodyA = body;
    }
    else if (this.bodies.length === 2)
    {
        this.bodyB = body;
    }
}

/** 
 * A distance joint constrains two points on two bodies to 
 * remain at a fixed distance from each other. You can view this 
 * as a massless, rigid rod. 
 * @export 
 * @constructor 
 * @extends {b2Joint} 
 * @param {b2AreaJointDef} def 
 */
b2AreaJoint = function (def)
{
    b2Joint.call(this, def); // base class constructor

    if (ENABLE_ASSERTS) { b2Assert(def.bodies.length >= 3, "You cannot create an area joint with less than three bodies."); }

    this.m_bodies = def.bodies;
    this.m_frequencyHz = def.frequencyHz;
    this.m_dampingRatio = def.dampingRatio;

    this.m_targetLengths = b2MakeNumberArray(def.bodies.length);
    this.m_normals = b2Vec2.MakeArray(def.bodies.length);
    this.m_joints = new Array(def.bodies.length);
    this.m_deltas = b2Vec2.MakeArray(def.bodies.length);
    this.m_delta = new b2Vec2();

    var djd = new b2DistanceJointDef();
    djd.frequencyHz = def.frequencyHz;
    djd.dampingRatio = def.dampingRatio;

    this.m_targetArea = 0;

    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var body = this.m_bodies[i];
        var next = this.m_bodies[(i+1)%ict];

        var body_c = body.GetWorldCenter();
        var next_c = next.GetWorldCenter();

        this.m_targetLengths[i] = b2Distance(body_c, next_c);

        this.m_targetArea += b2Cross_V2_V2(body_c, next_c);

        djd.Initialize(body, next, body_c, next_c);
        this.m_joints[i] = def.world.CreateJoint(djd);
    }

    this.m_targetArea *= 0.5;
}

//goog.inherits(b2AreaJoint, b2Joint);
b2AreaJoint.prototype = Object.create( b2Joint.prototype );
//b2AreaJoint.prototype.constructor = b2AreaJoint;
/**
 * @export 
 * @type {Array.<b2Body>}
 */
b2AreaJoint.prototype.m_bodies = null;
/**
 * @export 
 * @type {number}
 */
b2AreaJoint.prototype.m_frequencyHz = 0;
/**
 * @export 
 * @type {number}
 */
b2AreaJoint.prototype.m_dampingRatio = 0;

// Solver shared
/**
 * @export 
 * @type {number}
 */
b2AreaJoint.prototype.m_impulse = 0;

// Solver temp
b2AreaJoint.prototype.m_targetLengths = null;
b2AreaJoint.prototype.m_targetArea = 0;
b2AreaJoint.prototype.m_normals = null;
b2AreaJoint.prototype.m_joints = null;
b2AreaJoint.prototype.m_deltas = null;
b2AreaJoint.prototype.m_delta = null;

/** 
 * @export 
 * @return {b2Vec2} 
 * @param {b2Vec2} out 
 */
b2AreaJoint.prototype.GetAnchorA = function (out)
{
    return out.SetZero();
}

/** 
 * @export 
 * @return {b2Vec2} 
 * @param {b2Vec2} out 
 */
b2AreaJoint.prototype.GetAnchorB = function (out)
{
    return out.SetZero();
}

/** 
 * Get the reaction force given the inverse time step. 
 * Unit is N.
 * @export 
 * @return {b2Vec2} 
 * @param {number} inv_dt 
 * @param {b2Vec2} out
 */
b2AreaJoint.prototype.GetReactionForce = function (inv_dt, out)
{
    return out.SetZero();
}

/** 
 * Get the reaction torque given the inverse time step. 
 * Unit is N*m. This is always zero for a distance joint.
 * @export 
 * @return {number} 
 * @param {number} inv_dt 
 */
b2AreaJoint.prototype.GetReactionTorque = function (inv_dt)
{
    return 0;
}

/** 
 * Set/get frequency in Hz. 
 * @export 
 * @return {void} 
 * @param {number} hz
 */
b2AreaJoint.prototype.SetFrequency = function (hz)
{
    this.m_frequencyHz = hz;

    for (var i = 0, ict = this.m_joints.length; i < ict; ++i)
    {
        this.m_joints[i].SetFrequency(hz);
    }
}

/** 
 * @export 
 * @return {number}
 */
b2AreaJoint.prototype.GetFrequency = function ()
{
    return this.m_frequencyHz;
}

/** 
 * Set/get damping ratio. 
 * @export 
 * @return {void} 
 * @param {number} ratio
 */
b2AreaJoint.prototype.SetDampingRatio = function (ratio)
{
    this.m_dampingRatio = ratio;

    for (var i = 0, ict = this.m_joints.length; i < ict; ++i)
    {
        this.m_joints[i].SetDampingRatio(ratio);
    }
}

/** 
 * @export 
 * @return {number}
 */
b2AreaJoint.prototype.GetDampingRatio = function ()
{
    return this.m_dampingRatio;
}

/** 
 * Dump joint to dmLog 
 * @export 
 * @return {void}
 */
b2AreaJoint.prototype.Dump = function ()
{
    if (DEBUG)
    {
        b2Log("Area joint dumping is not supported.\n");
    }
}

/** 
 * @export 
 * @return {void} 
 * @param {b2SolverData} data
 */
b2AreaJoint.prototype.InitVelocityConstraints = function (data)
{
    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var prev = this.m_bodies[(i+ict-1)%ict];
        var next = this.m_bodies[(i+1)%ict];
        var prev_c = data.positions[prev.m_islandIndex].c;
        var next_c = data.positions[next.m_islandIndex].c;
        var delta = this.m_deltas[i];

        b2Sub_V2_V2(next_c, prev_c, delta);
    }

    if (data.step.warmStarting)
    {
        this.m_impulse *= data.step.dtRatio;

        for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
        {
            var body = this.m_bodies[i];
            var body_v = data.velocities[body.m_islandIndex].v;
            var delta = this.m_deltas[i];

            body_v.x += body.m_invMass *  delta.y * 0.5 * this.m_impulse;
            body_v.y += body.m_invMass * -delta.x * 0.5 * this.m_impulse;
        }
    }
    else
    {
        this.m_impulse = 0;
    }
}

/** 
 * @export 
 * @return {void} 
 * @param {b2SolverData} data
 */
b2AreaJoint.prototype.SolveVelocityConstraints = function (data)
{
    var dotMassSum = 0;
    var crossMassSum = 0;

    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var body = this.m_bodies[i];
        var body_v = data.velocities[body.m_islandIndex].v;
        var delta = this.m_deltas[i];

        dotMassSum += delta.LengthSquared() / body.GetMass();
        crossMassSum += b2Cross_V2_V2(body_v, delta);
    }

    var lambda = -2 * crossMassSum / dotMassSum;
    //lambda = b2Clamp(lambda, -b2_maxLinearCorrection, b2_maxLinearCorrection);

    this.m_impulse += lambda;

    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var body = this.m_bodies[i];
        var body_v = data.velocities[body.m_islandIndex].v;
        var delta = this.m_deltas[i];

        body_v.x += body.m_invMass *  delta.y * 0.5 * lambda;
        body_v.y += body.m_invMass * -delta.x * 0.5 * lambda;
    }
}

/** 
 * @export 
 * @return {boolean} 
 * @param {b2SolverData} data 
 */
b2AreaJoint.prototype.SolvePositionConstraints = function (data)
{
    var perimeter = 0;
    var area = 0;

    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var body = this.m_bodies[i];
        var next = this.m_bodies[(i+1)%ict];
        var body_c = data.positions[body.m_islandIndex].c;
        var next_c = data.positions[next.m_islandIndex].c;

        var delta = b2Sub_V2_V2(next_c, body_c, this.m_delta);

        var dist = delta.Length();
        if (dist < b2_epsilon)
        {
            dist = 1;
        }

        this.m_normals[i].x =  delta.y / dist;
        this.m_normals[i].y = -delta.x / dist;

        perimeter += dist;

        area += b2Cross_V2_V2(body_c, next_c);
    }

    area *= 0.5;

    var deltaArea = this.m_targetArea - area;
    var toExtrude = 0.5 * deltaArea / perimeter;
    var done = true;

    for (var i = 0, ict = this.m_bodies.length; i < ict; ++i)
    {
        var body = this.m_bodies[i];
        var body_c = data.positions[body.m_islandIndex].c;
        var next_i = (i+1)%ict;

        var delta = b2Add_V2_V2(this.m_normals[i], this.m_normals[next_i], this.m_delta);
        delta.SelfMul(toExtrude);

        var norm_sq = delta.LengthSquared();
        if (norm_sq > b2Sq(b2_maxLinearCorrection))
        {
            delta.SelfMul(b2_maxLinearCorrection / b2Sqrt(norm_sq));
        }
        if (norm_sq > b2Sq(b2_linearSlop))
        {
            done = false;
        }

        body_c.x += delta.x;
        body_c.y += delta.y;
    }

    return done;
}