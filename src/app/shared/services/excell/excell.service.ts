import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ExcelDoc, ExcelFile } from './exell.model';

@Injectable({
    providedIn: 'root'
})
export class ExcelToJsonService {

    private excelData: ExcelDoc | null = null;

    constructor() { }

    saveExcelDataToFile(file: File): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = reader.result;
                const workBook = XLSX.read(data, { type: 'binary' });
                const files: ExcelFile[] = [];

                workBook.SheetNames.forEach(name => {
                    const sheet = workBook.Sheets[name];
                    const sheetJson = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    const excelFile: ExcelFile = {
                        sheetName: name,
                        headers: sheetJson[0] as string[],
                        fields: sheetJson.slice(1) as string[][]
                    };
                    files.push(excelFile);
                });

                const newData: ExcelDoc = {
                    id: "", // Completați cu id-ul adecvat
                    name: file.name, // Folosiți numele fișierului pentru numele documentului
                    dateCreated: new Date().toISOString(), // Folosiți data curentă
                    contributors: [], // Completați cu contribuitorii adecvați
                    owner: "", // Completați cu proprietarul adecvat
                    modifications: [], // Completați cu modificările adecvate
                    files: files // Adăugați array-ul de fișiere Excel
                };

                this.excelData = newData;
                resolve();
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    }


    getExcelDataFromFile(): ExcelDoc | null {
        return this.excelData;
    }
    deleteDoc() {
        this.excelData = null;
    }
}
