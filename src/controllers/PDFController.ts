import { Controller, Post, Route, Tags, UploadedFile, Produces, Request } from 'tsoa'
import express from 'express'
import { HtmlToPdfHandler } from '../features/PDF/HtmlToPdf/HtmlToPdf.handler';

@Route('PDF')
@Tags('PDF')
export class PDFController extends Controller {

  /**
   * Convert HTML file to PDF
   */
  @Post('/HtmlToPdf')
  @Produces("application/octet-stream")
  public async HtmlToPdf(
    @UploadedFile() file: Express.Multer.File,
    @Request() request: express.Request
  ): Promise<void> {

    const res = request.res as express.Response;

   const result = await HtmlToPdfHandler.execute({ file })
    
    if (result.statusCode === 200 && result.data) {
      res.setHeader("Content-Type", result.data.mimeType);
      res.setHeader("Content-Disposition", `attachment; filename=${result.data.id}.pdf`);
      res.send(Buffer.from(result.data.blob));
      return;
    }

    res.sendStatus(result.statusCode);
  }
}