var ARRAY32
if(!ARRAY32) ARRAY32 = (typeof Float32Array !== 'undefined') ? Float32Array : Array;

var ARRAY8
if(!ARRAY8) ARRAY8 = (typeof Uint8Array !== 'undefined') ? Uint8Array : Array;


var Terrain2D = function(w, h, size, step, range) {

	this.step = step || 10;

	this.range = range || [-0.8, 0.8];

	this.w = w || 400;
	this.h = h || 100;
	this.mh = this.h*0.5;
	s = size || 30;
	this.num = Math.round(this.step+this.w/this.step);
	this.scale = 1/s;
	this.perlin = new Perlin();
	this.points = new ARRAY32(this.num*2);
}

Terrain2D.prototype = {
	gen:function(x,y){
		x = x || 0;
		y = y || 0;
		var n, h;
		for (var i = 0; i < this.num; i++) {
			n = i*2;
			h = this.perlin.noise((x+i)*this.scale, y*this.scale);
			if(this.range[0]>-1) h = h<this.range[0] ? this.range[0]:h;
			if(this.range[1]<1) h = h>this.range[1] ? this.range[1]:h;
			this.points[n] = i*this.step;
			this.points[n+1] = this.mh+(h*this.mh);
        }
        return this.points;
	}
}


function Perlin(random) {
	this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    this.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    if (!random) random = Math.random;
    this.p = new ARRAY8(256);
    this.perm = new ARRAY8(512);
    this.permMod12 = new ARRAY8(512);
    for (var i = 0; i < 256; i++) {
        this.p[i] = random() * 256;
    }
    for (i = 0; i < 512; i++) {
        this.perm[i] = this.p[i & 255];
        this.permMod12[i] = this.perm[i] % 12;
    }
}

Perlin.prototype = {
	grad3: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]),
	noise: function (xin, yin) {
        var permMod12 = this.permMod12, perm = this.perm, grad3 = this.grad3;
        var n0=0, n1=0, n2=0; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        var s = (xin + yin) * this.F2; // Hairy factor for 2D
        var i = Math.floor(xin + s);
        var j = Math.floor(yin + s);
        var t = (i + j) * this.G2;
        var X0 = i - t; // Unskew the cell origin back to (x,y) space
        var Y0 = j - t;
        var x0 = xin - X0; // The x,y distances from the cell origin
        var y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        else {
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        var x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
        var y1 = y0 - j1 + this.G2;
        var x2 = x0 - 1.0 + 2.0 * this.G2; // Offsets for last corner in (x,y) unskewed coords
        var y2 = y0 - 1.0 + 2.0 * this.G2;
        // Work out the hashed gradient indices of the three simplex corners
        var ii = i & 255;
        var jj = j & 255;
        // Calculate the contribution from the three corners
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            var gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
        }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    }
}