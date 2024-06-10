import { Injectable } from '@angular/core';
import { ExcelDoc, ExcelFile } from '../excell/exell.model';
import { Observable, forkJoin, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { UserDetails } from '../auth/auth.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    userId = "";
    projectIds: string[] = [];
    url = "http://localhost:3000/excel-projects";

    constructor(private http: HttpClient) {
        let userDetails: UserDetails = this.getDataUser()
        if (userDetails) {
            this.userId = userDetails.id;
            this.projectIds = userDetails.projects;
        }

    }
    getDataUser(): UserDetails {
        let userDetailsString = localStorage.getItem('userDetails');
        let userDetails: any;
        if (userDetailsString) {
            userDetails = JSON.parse(userDetailsString);
        }
        return userDetails;
    }
    getProjects(): Observable<ExcelDoc[]> {
        let userDetails: UserDetails = this.getDataUser()
        if (userDetails) {
            this.projectIds = userDetails?.projects;
        }

        const projectRequests: Observable<ExcelDoc>[] = this.projectIds.map(projectId =>
            this.getProjectById(projectId)
        );

        return forkJoin(projectRequests);
    }
    getProjectById(id: string): Observable<ExcelDoc> {
        return this.http.get<ExcelDoc>(this.url + `/${id}`);
    }
    addProject(project: ExcelDoc, name: string): Observable<boolean> {
        let newData: ExcelDoc = {
            id: this.generateId(name),
            name: name,
            contributors: [],
            dateCreated: new Date().toDateString(),
            owner: this.userId,
            modifications: [],
            files: []
        };

        project.files.forEach(file => {
            if (!this.verifyIntactTable(file)) {
                file = this.makeTableIntact(file);
            }
            newData.files.push(file);
        });

        return this.addProjectToUser(newData.id).pipe(
            switchMap(() => {
                return this.http.post<boolean>(this.url, newData);
            })
        );
    }

    addProjectToUser(idProject: string): Observable<boolean> {
        let userDetailsString = localStorage.getItem('userDetails');
        let userDetails: UserDetails;
        if (userDetailsString) {
            userDetails = JSON.parse(userDetailsString);
            userDetails.projects.push(idProject);
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
            return this.http.put<boolean>(`http://localhost:3000/users/${this.userId}`, userDetails);
        } else {
            return of(false);;
        }
    }
    saveProjectToUser(project: ExcelDoc): Observable<boolean> {
        return this.http.put<boolean>(this.url + `/${project.id}`, project);
    }

    verifyIntactTable(file: ExcelFile): boolean {
        const expectedFieldLength = file.headers.length;

        for (const field of file.fields) {
            if (field.length !== expectedFieldLength) {
                return false;
            }
        }

        if (file.headers.length !== expectedFieldLength) {
            return false;
        }

        return true;
    }
    makeTableIntact(file: ExcelFile): ExcelFile {
        const maxRowLength = Math.max(...file.fields.map(row => row.length));

        const newFields = file.fields.map(row => {
            while (row.length < maxRowLength) {
                row.push('');
            }
            return row;
        });


        while (file.headers.length < maxRowLength) {
            file.headers.push('');
        }

        return {
            sheetName: file.sheetName,
            headers: file.headers,
            fields: newFields
        };
    }

    generateId(name: string): string {
        let data = this.userId + name + Math.random();
        const hash = CryptoJS.SHA256(data).toString();
        return hash;
    }
}
