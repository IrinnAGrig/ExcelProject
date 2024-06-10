import { ComponentFixture, TestBed, async, fakeAsync, inject } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../shared/services/dashboard/dashboard.service';
import { ExcelDoc, ExcelFile } from '../shared/services/excell/exell.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let service: DashboardService;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpTestingController: HttpTestingController;
  let upperPipe: UpperCasePipe;
  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule
      ],
      providers: [DashboardService, AuthService],
      declarations: [DashboardComponent]
    })
      .compileComponents();
    service = TestBed.inject(DashboardService);
    service.userId = "967ad3fb5de5c25589206ac7725240cb0b7b5e3c009bb7595c5e68aec538e03b";
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    upperPipe = new UpperCasePipe();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test Reactive forms', async () => {
    let name = component.nameForm.controls['name'];
    expect(name.valid).toBeFalsy();
    if (name.errors)
      expect(name.errors['required']).toBeTruthy();
  });


  it('initially the bar is open then close it', () => {
    const compiled = fixture.nativeElement;
    const barIcon = compiled.querySelector('.arrow-extension');
    expect(barIcon).toBeTruthy();
    expect(component.extendedBarProj).toBeTrue();

    barIcon.click();
    fixture.detectChanges();
    expect(component.extendedBarProj).toBeFalse();
  });

  it("should call getProjects and return list of users", async () => {
    const response: ExcelDoc[] = [];

    spyOn(service, 'getProjects').and.returnValue(of(response))

    await component.getProjects();

    fixture.detectChanges();
    console.log(component.projects)
    expect(component.projects).toEqual(response);
  });

  it("is disabled project part/ ngClass test", async () => {
    const element = fixture.debugElement.nativeElement.querySelector(".selected-project-part");
    component.isNewFile = true;
    fixture.detectChanges();
    expect(element.getAttribute('class')).toContain('disabled');
  });
  it('should bind ngModel to searchTerm', () => {
    const compiled = fixture.nativeElement;
    const inputElement = compiled.querySelector('input[name="searchTerm"]');

    inputElement.value = 'test search';
    inputElement.dispatchEvent(new Event('input'));

    expect(component.searchTerm).toEqual('test search');
  });

  it('should test ngFor for table / ngFor', () => {
    const exampleExcelFile: ExcelFile = {
      sheetName: "Sheet1",
      headers: ["Name", "Age", "Country"],
      fields: [
        ["John", "30", "USA"],
        ["Alice", "25", "Canada"],
        ["Bob", "35", "UK"]
      ]
    };

    component.file = exampleExcelFile;
    fixture.detectChanges();
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('th.header'));

    expect(elements.length).toBe(exampleExcelFile.headers.length);

    elements.forEach((element: DebugElement, index: number) => {
      const inputValue = element.nativeElement.querySelector('input').value.trim();

      expect(inputValue).toEqual(exampleExcelFile.headers[index]);
    });
  });


  it('should test uppercase pipe / Pipe', () => {
    const elements: DebugElement[] = fixture.debugElement.queryAll(By.css('.table-container'));

    const paragraphText = elements[0].query(By.css('p')).nativeElement.textContent.trim();

    expect(paragraphText).toEqual(upperPipe.transform('NO PROJECT SELeCTED.'));
  });

  it('search for "fin" and filter projects / easy way', () => {
    const mockProjects: ExcelDoc[] = [
      {
        id: '1',
        name: 'Financial Report',
        contributors: [],
        owner: '',
        dateCreated: '',
        modifications: [],
        files: []
      },
      {
        id: '2',
        name: 'Marketing Fidings',
        contributors: [],
        owner: '',
        dateCreated: '',
        modifications: [],
        files: []
      }
    ];
    component.projects = mockProjects;
    component.filteredProjects = mockProjects;

    component.searchTerm = 'fin';

    component.search();

    expect(component.filteredProjects.length).toBe(1);
  });

});
