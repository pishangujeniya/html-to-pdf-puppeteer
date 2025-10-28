export interface HtmlToPdfRequest {
    file: Express.Multer.File;
}

export class HtmlToPdfResponse {
    id!: string;
    mimeType!: string;
    blob!: Uint8Array<any>;
}