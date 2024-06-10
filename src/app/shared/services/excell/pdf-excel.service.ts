import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExcelDoc, ExcelFile } from './exell.model';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
    providedIn: 'root'
})
export class PdfExcelService {

    constructor(private http: HttpClient) { }

    async extractTablesFromPDF(pdfFile: File): Promise<ExcelDoc> {
        try {
            const pdfText = await this.extractTextFromPdf(pdfFile);
            console.log(pdfText);
            const tables = this.extractTablesFromText(pdfText);
            const excelDoc = this.convertToExcelDoc(tables);
            return excelDoc;
        } catch (error: any) {
            throw new Error('Error extracting tables from PDF: ' + error.message);
        }
    }


    async extractTextFromPdf(pdfFile: File): Promise<string> {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            textContent.items.forEach(item => {
                fullText += item + '\n';
            });
        }

        return fullText;
    }




    private extractTablesFromText(pdfText: string): any[] {
        const rows = pdfText.split('\n');
        const tables: any[] = [];

        let currentTable: string[][] = [];

        rows.forEach(row => {
            if (row.trim().length === 0) {
                if (currentTable.length > 0) {
                    tables.push(currentTable);
                    currentTable = [];
                }
            } else {
                const cells = row.split('\t');
                currentTable.push(cells);
            }
        });

        if (currentTable.length > 0) {
            tables.push(currentTable);
        }

        return tables;
    }

    private convertToExcelDoc(tables: any[]): ExcelDoc {
        const excelDoc: ExcelDoc = {
            id: 'some_id',
            name: 'Some Name',
            contributors: ['Contributor 1', 'Contributor 2'],
            owner: 'Owner Name',
            dateCreated: new Date().toISOString(),
            modifications: [],
            files: []
        };

        tables.forEach((table, index) => {
            const sheetName = `Table_${index + 1}`;
            const headers = table[0];
            const fields = table.slice(1); // Exclude headers from fields
            const excelFile: ExcelFile = {
                sheetName: sheetName,
                headers: headers,
                fields: fields
            };
            excelDoc.files.push(excelFile);
        });

        return excelDoc;
    }

    async processPDF(pdfFile: File): Promise<ExcelDoc> {
        try {
            const excelDoc = await this.extractTablesFromPDF(pdfFile);
            console.log(excelDoc);
            if (excelDoc.files.length === 0) {
                console.error('No tables found in the PDF.');
            }
            return excelDoc;
        } catch (error) {
            console.error('Error processing PDF:', error);
            throw error; // Re-throw error for handling by the caller
        }
    }
}
