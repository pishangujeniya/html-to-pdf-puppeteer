import nodeCrypto = require("node:crypto");
import { ApiResponse } from "../../../shared/types";
import { HtmlToPdfRequest, HtmlToPdfResponse } from "./HtmlToPdf.model";
import puppeteer from 'puppeteer';

export class HtmlToPdfHandler {
    static async execute(request: HtmlToPdfRequest): Promise<ApiResponse<HtmlToPdfResponse>> {
        try {
            const { file } = request;

            if (!file) {
                return {
                    statusCode: 400,
                    error: "No file uploaded"
                };
            }

            if (!file.buffer || file.buffer.length === 0) {
                return {
                    statusCode: 400,
                    error: "Empty file content"
                };
            }

            const allowedMimeTypes = [
                'text/html'
            ];

            if (!allowedMimeTypes.includes(file.mimetype)) {
                return {
                    statusCode: 400,
                    error: `Unsupported file type: ${file.mimetype}`
                };
            }

            const htmlContent = file.buffer.toString("utf-8");

            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome',
                headless: true,
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
            });

            const page = await browser.newPage();

            await page.setContent(htmlContent, { waitUntil: "networkidle0" });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
            });

            await browser.close();

            const response: HtmlToPdfResponse = {
                id: nodeCrypto.randomUUID().toString(),
                mimeType: "application/pdf",
                blob: pdfBuffer
            };

            return {
                statusCode: 200,
                data: response
            };
        } catch (error) {
            console.error("Error:", error);
            return {
                statusCode: 500,
                error: "Failed"
            };
        }
    }
}