import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { ExcelDoc } from '../excell/exell.model';


describe('DashboardService', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule
            ]
        })

        service = TestBed.inject(DashboardService);
        httpMock = TestBed.inject(HttpTestingController);
        service.userId = "967ad3fb5de5c25589206ac7725240cb0b7b5e3c009bb7595c5e68aec538e03b";
    });
    afterEach(() => {
        httpMock.verify(); // Verify that no unexpected requests were made
    });

    it('should create dashboard service', () => {
        expect(service).toBeTruthy();
    });
});