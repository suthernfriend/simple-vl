export class WindowCanvas {
	private windowRef: WindowProxy | null = null;
	private context: CanvasRenderingContext2D | null = null;

	constructor() {
	}

	getContext(): CanvasRenderingContext2D {
		if (this.state === "link") {
			this.openCanvas();
		}

		if (!this.context) {
			throw Error("WindowCanvas is not started");
		}

		return this.context;
	}

	isRunning() {
		return this.windowRef !== null;
	}

	closed() {
		this.windowRef = null;
		this.context = null;
	}

	private state: "idle" | "link" | "canvas" = "idle";

	openLink(url: string) {
		if (!this.windowRef) {
			throw new Error("WindowCanvas not started");
		}

		if (this.state === "canvas") {
			this.iframeElement = this.windowRef.window.document.createElement("iframe");
			this.iframeElement.style.width = "100vw";
			this.iframeElement.style.height = "100vh";
			this.iframeElement.style.border = "none";
			this.iframeElement.src = url;

			if (this.canvasElement) {
				this.windowRef.window.document.body.removeChild(this.canvasElement);
				this.canvasElement = null;
				this.context = null;
			}

			this.windowRef.window.document.body.appendChild(this.iframeElement!);
		} else {
			this.iframeElement!.src = url;
		}

		this.state = "link";
	}

	private iframeElement: HTMLIFrameElement | null = null;
	private canvasElement: HTMLCanvasElement | null = null;

	openCanvas() {
		if (!this.windowRef)
			throw new Error("WindowCanvas not started");

		if (this.state === "canvas")
			return;

		console.log("Opening canvas");

		this.canvasElement = this.windowRef.window.document.createElement("canvas");
		this.canvasElement.style.width = "100vw";
		this.canvasElement.style.height = "100vh";
		this.canvasElement.width = window.screen.width;
		this.canvasElement.height = window.screen.height;

		if (this.iframeElement) {
			this.windowRef.window.document.body.removeChild(this.iframeElement);
			this.iframeElement = null;
		}

		this.windowRef.window.document.body.appendChild(this.canvasElement);

		this.context = this.canvasElement.getContext("2d");
		console.log(`Opened canvas ${this.canvasElement.width}x${this.canvasElement.height}, context: ${this.context}`);
		this.state = "canvas";
	}

	start() {
		// this.windowRef = window.open("", "", "width=800,height=600");
		this.windowRef = window.open("", "");

		if (!this.windowRef) {
			throw Error("Cannot open new window");
		}

		const link = this.windowRef.window.document.createElement("link");

		link.href = "https://fonts.googleapis.com/css2?family=Ubuntu&display=swap";
		link.rel = "stylesheet";
		this.windowRef.window.document.head.append(link);
		this.windowRef.window.document.body.style.margin = "0";
		this.windowRef.window.document.body.style.padding = "0";

		this.openCanvas();

		window.onclose = () => {
			this.closed();
			this.windowRef = null;
			this.canvasElement = null;
			this.iframeElement = null;
			this.state = "idle";
		};
	}

}
