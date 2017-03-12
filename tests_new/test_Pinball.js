function Test_Pinball() {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;

    world.SetGravity(new b2Vec2(0, -5));

    this.input = { up:0, down:0, left:0, right:0, launch:0 };

    pinball()

}

Test_Pinball.prototype.Step = function() {
    world.Step(1/60, 10, 10);
}

Test_Pinball.prototype.Keyboard = function(char, code) {
    
    switch (code) {
        case 90:case 87:case 38: this.input.up = 1; break;
        case 83:case 40: this.input.down = 1; break;
        case 81:case 65:case 37: this.input.left = 1; break;
        case 68:case 39: this.input.right = 1; break;
        case 32: this.input.launch = 1; break;
    }
};

Test_Pinball.prototype.KeyboardUp = function(char, code) {
    switch (code) {
        case 90:case 87:case 38: this.input.up = 0; break;
        case 83:case 40: this.input.down = 0; break;
        case 81:case 65:case 37: this.input.left = 0; break;
        case 68:case 39: this.input.right = 0; break;
        case 32: this.input.launch = 0; break;
    }
};

function pinball(){
    this.offramp = world.add({
        angle:1.375707030296326,
        angularVelocity:0,
        linearVelocity:0,
        x:1.801, y:2.069,
        friction:0.2, type: 'static', userData: 2,
        shapes:[
            {shape:'edge', p1: new b2Vec2(0.608, -0.867), p2: new b2Vec2(0.719, -0.8) },
            {shape:'edge', categoryBits:2, p1: new b2Vec2(-0.051, 0.009), p2: new b2Vec2(0.042, -0.006) },
        ],
    });

    this.bumper = world.add({
        x:1.5, y:.55,
        friction:0.2, restitution:1.2,  type: 'static', userData: 3,
        shape:'circle', density:1, categoryBits:3,  radius: 0.051,
    });

    this.bumper2 = world.add({
        x:1.715, y:2.63,
        friction:0.2, restitution:1.2,  type: 'static', userData: 3,
        shape:'circle', density:1, categoryBits:3,  radius: 0.082,
    });

    this.destroyball = world.add({
        angle:1.375,
        x:0.951, y:0.012,
        friction:0.2, type: 'static', userData: 2,
        shape:'edge', density:1, categoryBits:2,  p1: new b2Vec2(-0.144, 0), p2: new b2Vec2( 0.144, 0) 
    });

    this.ff = world.add({
        angle:1.375,
        x:1.95, y:0.369,
        friction:0.2, type: 'dynamic', userData: 3,
        shape:'polygon', density:1, categoryBits:3,  vertices: [0.039, 0.07, -0.0399,0.07, -0.0399,-0.07, 0.0399,-0.07 ] 
    });

}