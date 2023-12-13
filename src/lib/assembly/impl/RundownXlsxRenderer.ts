import type {AgendaItem, Assembly} from "@/lib/assembly/Assembly";
import type {AssemblyRenderer} from "@/lib/assembly/AssemblyRenderer";

import ExcelJS, {RichText, Buffer, CellValue, Workbook} from "exceljs";

interface SheetWriter {
    lineFeed(xOffset?: number): SheetWriter;

    put(value?: CellValue): SheetWriter;
}

interface TextBuilder {
    bold(text: string): TextBuilder;
    lineFeed(): TextBuilder;
    text(text: string): TextBuilder;
    build(): RichText;
}

function createTextBuilder() {

}

export class RundownXlsxRenderer implements AssemblyRenderer {

    async render(assembly: Assembly): Promise<string> {

        const workbook: Workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Rundown");

        let y = 1, x = 1;

        const sheetWriter: SheetWriter = {
            lineFeed(offsetX?: number): SheetWriter {
                y += 1;
                x = offsetX || 1;
                return this;
            },
            put(value?: CellValue): SheetWriter {
                if (value) {
                    sheet.getCell(y, x).value = value;
                }
                x += 1;
                return this;
            }
        }

        this.renderTitle(sheetWriter, assembly);

        const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        const buffer = await workbook.xlsx.writeBuffer();
        return `data:${mimeType};base64,` + btoa(String.fromCharCode(...new Uint8Array(buffer)));
    }

    renderTitle(sheetWriter: SheetWriter, assembly: Assembly) {
        sheetWriter
            .put(assembly.event).lineFeed()
            .put(assembly.start).lineFeed()
            .put(assembly.location).lineFeed();
    }

    renderAgendaItem(sheetWriter: SheetWriter, agendaItem: AgendaItem) {

        switch (agendaItem.type) {
            case "opening":
                sheetWriter
                    .put(`TOP ${agendaItem.digit}`)
                    .put()
                    .put(agendaItem.title)
                    .lineFeed(2)
                    .put("Eröffnungsrede")
                    .put(`Feststellung`)
        }

    }
}
