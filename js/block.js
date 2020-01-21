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

		this.blockWidth = 100;
		this.blockHeight = 100;

		this.canvasWidth = screenBlocksWide * this.blockWidth;
		this.canvasHeight = screenBlocksTall * this.blockWidth;

		this.logoWidth = this.logoBlocksWide * this.blockWidth;
		this.logoHeight = this.logoBlocksTall * this.blockHeight;

		this.xVelocity = this.blockWidth;
		this.yVelocity = this.blockHeight;

		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.x = 0;
		this.y = 0;

		this.animId = null;
	}

	findCorners() {}

	draw() {
		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Background
		this.canvasCtx.fillStyle = "#D3D3D3";
		this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.drawGrid();

		// The block
		this.canvasCtx.fillStyle = "#32CD32";
		this.canvasCtx.fillRect(
			this.x + 1,
			this.y + 1,
			this.logoWidth - 2,
			this.logoHeight - 2
		);
	}

	drawGrid() {
		for (let x = 0; x <= this.canvasWidth; x += this.blockWidth) {
			this.canvasCtx.moveTo(x, 0);
			this.canvasCtx.lineTo(x, this.canvasHeight);
			for (let y = 0; y <= this.canvasHeight; y += this.blockHeight) {
				this.canvasCtx.moveTo(0, y);
				this.canvasCtx.lineTo(this.canvasWidth, y);
			}
		}
		this.canvasCtx.stroke();
	}

	update() {
		for (let i = 0; i < this.rate; i++) {
			this.x += this.xVelocity;
			this.y += this.yVelocity;

			// The logo is drawn from its top-left corner
			let right = this.x + this.logoWidth === this.canvasWidth;
			let left = this.x === 0;

			let top = this.y === 0;
			let bottom = this.y + this.logoHeight === this.canvasHeight;

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

			// Right
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
		}

		this.draw();
	}

	animate() {
		this.animId = setInterval(() => {
			this.update();
		}, 1000 / 3);
	}
}
