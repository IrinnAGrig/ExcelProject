import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUpload, HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProgressComponent } from '../shared/components/progress/progress.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BytesFormatPipe } from '../shared/pipes/format-bytes.pipe';
import { SharedModule } from '../shared/shared.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let bytesPipe: BytesFormatPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule
      ],
      declarations: [HomeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    bytesPipe = new BytesFormatPipe();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display progress', () => {
    let file: FileUpload = {
      file: new File([], 'mock_image.jpg', { type: 'image/jpeg' }),
      progress: 50
    }
    component.files.push(file);
    fixture.detectChanges();

    const progressElement: HTMLElement = fixture.nativeElement.querySelector('.progress');
    expect(progressElement).toBeTruthy();
    expect(progressElement.style.width).toEqual('50%');
  });

  it('should custop pipe - bytesFormat ', () => {

    const bytes = new Uint8Array(140 * 1024);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const file = new File([blob], 'file.txt', { type: 'text/plain' });

    let fileUp: FileUpload = {
      file: file,
      progress: 20
    }

    expect(bytesPipe.transform(fileUp.file.size, 2)).toEqual('140 KB');
  });
  // it('should display progress when uploading a file', () => {
  //   const file = new File(["content"], "filename.txt"); // Crează un obiect de tip File
  //   const fileList = new FileList(); // Crează o listă de fișiere
  //   Object.defineProperty(fileList, 0, { value: file }); // Adaugă fișierul la lista de fișiere

  //   component.prepareFilesList(fileList);  // Apelează metoda care pregătește lista de fișiere
  //   fixture.detectChanges(); // Detectează schimbările

  //   const progressElement: HTMLElement = fixture.nativeElement.querySelector('.files-list'); // Selectează elementul .progress
  //   expect(progressElement).toBeTruthy(); // Verifică dacă bara de progres este afișată
  // });
});
