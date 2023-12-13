export class WindowCanvas {
	private newWindow: WindowProxy | null = null;
	private context: CanvasRenderingContext2D | null = null;

	constructor() {
	}

	getContext(): CanvasRenderingContext2D {
		if (!this.context) {
			throw Error("WindowCanvas is not started");
		}

		return this.context;
	}

	closed() {
		this.newWindow = null;
		this.context = null;
	}

	start() {
		this.newWindow = window.open("", "", "width=800,height=600");

		if (!this.newWindow) {
			throw Error("Cannot open new window");
		}

		const newCanvas = this.newWindow.window.document.createElement("canvas");
		newCanvas.style.width = "100vw";
		newCanvas.style.height = "100vh";
		newCanvas.width = window.screen.width;
		newCanvas.height = window.screen.height;

		const link = this.newWindow.window.document.createElement("link");
		link.href = "https://fonts.googleapis.com/css2?family=Ubuntu&display=swap"
		link.rel = "stylesheet";
		this.newWindow.window.document.head.append(link);

		this.newWindow.window.document.body.style.margin = "0";
		this.newWindow.window.document.body.style.padding = "0";
		this.newWindow.window.document.body.append(newCanvas);

		this.context = newCanvas.getContext("2d");

		window.onclose = () => {
			this.closed();
		};
	}

}
