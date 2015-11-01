function Test_Pinball() {

    this.input = { up:0, down:0, left:0, right:0, launch:0 };

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