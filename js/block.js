/**
 * TODO
 * - Add major gridlines
 */

/**
 * Represent a block bouncing inside of a grid
 */
class Block {
	/**
	 * Create a block object.
	 *
	 * @param {HTMLCanvasElement} canvas The empty canvas element
	 * @param {number} screenBlocksWide The number of blocks wide to make the screen
	 * @param {number} screenBlocksTall The number of blocks tall to make the screen
	 * @param {number} logoBlocksWide Number of blocks teh logo is (not pixels)
	 * @param {number} logoBlocksTall Number of blocks the logo is tall (not pixels)
	 * @param {number} rate Number of times to move the block each update call
	 */
	constructor(
		canvas,
		screenBlocksWide,
		screenBlocksTall,
		logoBlocksWide,
		logoBlocksTall,
		rate
	) {
		this.canvas = canvas;
		/** @type {CanvasRenderingContext2D} */
		this.canvasCtx = this.canvas.getContext("2d");

		this.screenBlocksWide = screenBlocksWide;
		this.screenBlocksTall = screenBlocksTall;

		this.logoBlocksTall = logoBlocksTall;
		this.logoBlocksWide = logoBlocksWide;

		this.rate = rate;

		this.blockWidth = 25;
		this.blockHeight = 25;

		// In pixels
		this.logoWidth = this.logoBlocksWide * this.blockWidth;
		this.logoHeight = this.logoBlocksTall * this.blockHeight;

		// In pixels
		this.xVelocity = this.blockWidth;
		this.yVelocity = this.blockHeight;

		// In pixels
		this.redXVelocity = this.blockWidth;
		this.redYVelocity = this.blockHeight;

		// In blocks, not pixels. For the small rect.
		this.widthDiff = this.screenBlocksWide - this.logoBlocksWide;
		this.heightDiff = this.screenBlocksTall - this.logoBlocksTall;

		// In blocks, not pixels
		this.diffGcd = this.gcd(this.widthDiff, this.heightDiff);
		this.diffLcm = this.lcm(this.widthDiff, this.heightDiff);

		this.rectWidth = screenBlocksWide * this.blockWidth;
		this.rectHeight = screenBlocksTall * this.blockHeight;

		// In pixels
		this.canvasWidth = (this.diffLcm + 1) * this.blockWidth;
		this.canvasHeight = (this.diffLcm + 1) * this.blockWidth;

		// In pixels
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.x = 0;
		this.y = 0;

		this.redX = 0;
		this.redY = 0;

		this.distance = 0;
		this.squareDistance = 0;

		this.corner1 = null;
		this.corner2 = null;

		/** @type {number} */
		this.animId = null;

		console.group("Differences");
		console.log("Width Diff " + this.widthDiff);
		console.log("Height Diff " + this.heightDiff);
		console.groupEnd("Differences");

		console.group("GCD and LCM");
		console.log("gcd of WdthDiff and HgtDiff " + this.diffGcd);
		console.log("lcm of WdthDiff and HgtDiff " + this.diffLcm);
		console.groupEnd("GCD and LCM");

		this.findCorners();
	}

	/**
	 * Return the largest number that divides to the two numbers (the greatest common denominator).
	 *
	 * @param {number} a First term
	 * @param {number} b Second term
	 * @returns {number} The greatest common denominator
	 */
	gcd(a, b) {
		if (!b) {
			return a;
		}

		return this.gcd(b, a % b);
	}

	/**
	 * Return the smallest number that is divisable by both terms (the lowest common multiple).
	 *
	 * @param {number} a First term
	 * @param {number} b Second term
	 * @returns {number} The lowest common multiple
	 */
	lcm(a, b) {
		return Math.abs(a * b) / this.gcd(a, b);
	}

	/**
	 * Determine the first two corners the logo will hit if any.
	 */
	findCorners() {
		let xyDiff = Math.abs(this.x - this.y);
		if (xyDiff % this.diffGcd === 0) {
			// corners will be reached
			console.group("Corners");
			if ((xyDiff / this.diffGcd) % 2 === 0) {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 === 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 === 0 ? "L" : "R");
				this.corner2 = "TL";

				console.log(this.corner1);
				console.log(this.corner2);
			} else {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 !== 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 !== 0 ? "L" : "R");
				this.corner2 = "BR";

				console.log(this.corner1);
				console.log(this.corner2);
			}
		} else {
			console.log("No corner!");
		}
		console.groupEnd("Corners");
	}

	/**
	 * Draw all of the elements on the canvas
	 */
	draw() {
		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Background
		this.canvasCtx.fillStyle = "#D3D3D3";
		this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		// The rect block
		this.canvasCtx.fillStyle = "#32CD32";
		this.canvasCtx.fillRect(
			this.x + 1,
			this.y + 1,
			this.logoWidth - 2,
			this.logoHeight - 2
		);

		// The super square block
		this.canvasCtx.fillStyle = "#FF0000";
		this.canvasCtx.fillRect(
			this.redX + 1,
			this.redY + 1,
			this.logoWidth - 2,
			this.logoHeight - 2
		);
		this.drawGrid(this.canvasWidth, this.canvasHeight, this.blockWidth);
	}

	drawGrid(w, h, minorStep) {
		this.canvasCtx.beginPath();
		for (let x = 0; x <= w; x += minorStep) {
			this.canvasCtx.moveTo(x, 0);
			this.canvasCtx.lineTo(x, h);
		}
		this.canvasCtx.strokeStyle = "#000000";
		this.canvasCtx.lineWidth = 1;
		this.canvasCtx.stroke();

		this.canvasCtx.beginPath();
		for (let y = 0; y <= h; y += minorStep) {
			this.canvasCtx.moveTo(0, y);
			this.canvasCtx.lineTo(w, y);
		}
		this.canvasCtx.strokeStyle = "#000000";
		this.canvasCtx.lineWidth = 1;
		this.canvasCtx.stroke();
	}

	/**
	 * Recalculate the position of everything on the canvas
	 */
	update() {
		// debugger;
		for (let i = 0; i < this.rate; i++) {
			this.x += this.xVelocity;
			this.y += this.yVelocity;

			this.redX += this.redXVelocity;
			this.redY += this.redYVelocity;

			this.squareDistance += 1;
			this.distance += 1;

			// The logo is drawn from its top-left corner
			let left = this.x === 0;
			let right = this.x + this.logoWidth === this.rectWidth;

			let top = this.y === 0;
			let bottom = this.y + this.logoHeight === this.rectHeight;

			let squareLeft = this.redX === 0;
			let squareRight = this.redX + this.logoWidth === this.canvasWidth;

			let squareTop = this.redY === 0;
			let squareBottom =
				this.redY + this.logoHeight === this.canvasHeight;

			if (bottom && right) {
				this.distance = 0;
				console.log("bottom right");
			}
			if (bottom && left) {
				this.distance = 0;
				console.log("bottom left");
			}
			if (top && right) {
				this.distance = 0;
				console.log("top right");
			}
			if (top && left) {
				this.distance = 0;
				console.log("top left");
			}

			if (right) {
				this.xVelocity = -this.xVelocity;
			}
			if (top) {
				this.yVelocity = -this.yVelocity;
			}
			if (bottom) {
				this.yVelocity = -this.yVelocity;
			}
			if (left) {
				this.xVelocity = -this.xVelocity;
			}

			if (squareBottom && squareRight) {
				this.squareDistance = 0;
				console.log("squareBottom squareRight");
			}
			if (squareBottom && squareLeft) {
				this.squareDistance = 0;
				console.log("squareBottom squareLeft");
			}
			if (squareTop && squareRight) {
				this.squareDistance = 0;
				console.log("squareTop squareRight");
			}
			if (squareTop && squareLeft) {
				this.squareDistance = 0;
				console.log("squareTop squareLeft");
			}

			if (squareRight) {
				this.redXVelocity = -this.redXVelocity;
			}
			if (squareTop) {
				this.redYVelocity = -this.redYVelocity;
			}
			if (squareBottom) {
				this.redYVelocity = -this.redYVelocity;
			}
			if (squareLeft) {
				this.redXVelocity = -this.redXVelocity;
			}
		}

		this.draw();
	}

	/**
	 * Repeatedly call the update function
	 */
	animate() {
		this.animId = setInterval(() => {
			this.update();
		}, 1000 / 3);
	}
}
