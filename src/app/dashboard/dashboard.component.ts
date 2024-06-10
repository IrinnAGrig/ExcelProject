import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExcelToJsonService } from '../shared/services/excell/excell.service';
import { ExcelDoc, ExcelFile } from '../shared/services/excell/exell.model';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  file: ExcelFile | null = null;
  originalDoc: ExcelDoc | null = null;
  selectedProject: ExcelDoc | null = null;
  newFile: ExcelDoc | null = null;
  projects: ExcelDoc[] = [];
  nameForm: FormGroup;
  isNewFile = false;
  searchTerm: string = '';
  filteredProjects: ExcelDoc[] = [];
  extendedBarProj = true;
  focusElement: string = "";


  constructor(private activatedRoute: ActivatedRoute, private excelService: ExcelToJsonService, private dashboard: DashboardService, private location: Location) {
    this.nameForm = new FormGroup({
      name: new FormControl('', Validators.required) // You can add validators if needed
    });
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getProjects();
      const file = params.get('file');
      if (file == 'new-file') {
        this.isNewFile = true;
        let fileDoc = this.excelService.getExcelDataFromFile();
        if (fileDoc) {
          this.selectedProject = fileDoc;
          this.file = fileDoc.files[0];
          this.originalDoc = fileDoc;
        }

        if (this.file == null) {
          this.removeNewFileFromURL();
          this.isNewFile = false;
        }
      }
    });
  }
  search(): void {
    this.filteredProjects = [];
    this.projects.forEach(project => {
      if (project.name.toLowerCase().includes(this.searchTerm.toLowerCase())) { this.filteredProjects.push(project) }
    });
  }
  getProjects() {
    this.dashboard.getProjects().subscribe(res => {
      this.projects = res;
      this.filteredProjects = res;
    })
  }
  removeNewFileFromURL() {
    const currentURL = this.location.path();
    if (currentURL.endsWith('/new-file')) {
      const newURL = currentURL.replace('/new-file', '');
      this.location.replaceState(newURL);
    }
  }
  addProject() {
    let value = this.nameForm.value;
    if (value && this.selectedProject) {
      let name = value.name;
      this.dashboard.addProject(this.selectedProject, name).subscribe(() => {
        this.getProjects();
        this.isNewFile = false;
      });
    }
  }
  saveProject() {
      if (confirm("You want to save the modifications?")) {
        if (this.selectedProject)
          this.dashboard.saveProjectToUser(this.selectedProject).subscribe();
      } else {
        this.selectedProject = this.originalDoc;
      }
  }
  selectProject(id: string) {
    if (!this.deepEqual(this.selectedProject, this.originalDoc)) {
      this.saveProject();
    }
    this.dashboard.getProjectById(id).subscribe(res => { this.selectedProject = res; this.file = res.files[0]; this.extendedBarProj = false; })
  }
  deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  selectFile(fileData: ExcelFile) {
    if (this.file) {
      const index = this.selectedProject?.files.findIndex(fil => fil.sheetName === this.file?.sheetName);

      if (index && index > -1 && this.selectedProject) {
        this.selectedProject.files[index] = this.file;
      }
    }

    this.file = fileData;
  }
  cancelSaveProject() {
    if (confirm("You really want to cancel this action?")) {
      this.excelService.deleteDoc();
      this.isNewFile = false;
      this.file = null;
      this.originalDoc = null;
      this.selectedProject = null;
    }
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
