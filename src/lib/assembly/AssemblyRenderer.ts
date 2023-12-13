import type {Assembly} from "./Assembly";

export interface AssemblyRenderer {
    render(assembly: Assembly): Promise<string>;
}
