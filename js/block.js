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

		this.x = 0;
		this.y = 0;

		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;
	}

	findCorners() {}

	draw() {
		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		this.canvasCtx.fillStyle = "#D3D3D3";
		this.canvasCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		
		this.drawGrid();

		this.canvasCtx.fillStyle = "#32CD32";
		this.canvasCtx.fillRect(
			this.x,
			this.y,
			this.logoWidth,
			this.logoHeight
		);

	}

	drawGrid() {
		for (let blockX = 0; blockX < this.screenBlocksWide; blockX++) {
			for (let blockY = 0; blockY < this.screenBlocksWide; blockY++) {
				let xPos = blockX * this.blockWidth;
				let yPos = blockY * this.blockHeight;

				this.canvasCtx.moveTo(xPos, 0);
				this.canvasCtx.lineTo(xPos, this.canvasHeight);
				this.canvasCtx.stroke();

				this.canvasCtx.moveTo(0, yPos);
				this.canvasCtx.lineTo(this.canvasWidth, yPos);
				this.canvasCtx.stroke();
			}
		}
	}

	animate() {}
}
