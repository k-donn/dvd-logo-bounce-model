/**
 * TODO
 * - Add major gridlines
 */

class Block {
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

		this.blockWidth = 35;
		this.blockHeight = 35;

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
		this.canvasWidth = this.diffLcm * this.blockWidth;
		this.canvasHeight = this.diffLcm * this.blockWidth;

		// In pixels
		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.x = 0;
		this.y = 0;

		this.redX = 0;
		this.redY = 0;

		this.corner1 = null;
		this.corner2 = null;

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
			if ((xyDiff / this.diffGcd) % 2 === 0) {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 === 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 === 0 ? "L" : "R");
				this.corner2 = "TL";

				console.group("corner-1");
				console.log(this.corner1);
				console.groupEnd("corner-1");

				console.group("corner 2");
				console.log(this.corner2);
				console.groupEnd("corner-2");
			} else {
				this.corner1 =
					((this.diffLcm / this.heightDiff) % 2 !== 0 ? "T" : "B") +
					((this.diffLcm / this.widthDiff) % 2 !== 0 ? "L" : "R");
				this.corner2 = "BR";

				console.group("corner-1");
				console.log(this.corner1);
				console.groupEnd("corner-1");

				console.group("corner 2");
				console.log(this.corner2);
				console.groupEnd("corner-2");
			}
		} else {
			console.log("No corner!");
		}
	}

	draw() {
		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Background
		this.canvasCtx.fillStyle = "#D3D3D3";
		this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		// this.drawGrid();

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
	}

	drawGrid() {
		let data = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern
					id="smallGrid"
					width="8"
					height="8"
					patternUnits="userSpaceOnUse"
				>
					<path
						d="M 8 0 L 0 0 0 8"
						fill="none"
						stroke="gray"
						stroke-width="0.5"
					/>
				</pattern>
				<pattern
					id="grid"
					width="80"
					height="80"
					patternUnits="userSpaceOnUse"
				>
					<rect width="80" height="80" fill="url(#smallGrid)" />
					<path
						d="M 80 0 L 0 0 0 80"
						fill="none"
						stroke="gray"
						stroke-width="1"
					/>
				</pattern>
			</defs>

			<rect width="100%" height="100%" fill="url(#smallGrid)" />
		</svg>`;

		let DOMURL = window.URL || window.webkitURL || window;

		let img = new Image();
		let svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
		let url = DOMURL.createObjectURL(svg);

		img.onload = () => {
			this.canvasCtx.drawImage(img, 0, 0);
			DOMURL.revokeObjectURL(url);
		};
		img.src = url;
	}

	update() {
		for (let i = 0; i < this.rate; i++) {
			this.x += this.xVelocity;
			this.y += this.yVelocity;

			this.redX += this.redXVelocity;
			this.redY += this.redYVelocity;

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
				console.log("bottom right");
			}
			if (bottom && left) {
				console.log("bottom left");
			}
			if (top && right) {
				console.log("top right");
			}
			if (top && left) {
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

		requestAnimationFrame(() => {
			this.update();
		});
	}
}
