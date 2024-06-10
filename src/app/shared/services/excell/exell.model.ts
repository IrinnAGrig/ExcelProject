export interface ExcelDoc {
    id: string;
    name: string;
    contributors: string[];
    owner: string;
    dateCreated: string;
    modifications: string[];
    files: ExcelFile[];
}

export interface ExcelFile {
    sheetName: string; 
    headers: string[]; 
    fields: string[][]; 
}