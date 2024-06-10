import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginData, UserDetails } from './auth.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule
            ]
        })

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should create auth service', () => {
        expect(service).toBeTruthy();
    });
    it('user can authenticate', async () => {
        let data: LoginData = {
            password: '123456',
            email: 'user1@gmail.com'
        }
        service.signIn(data).subscribe(res => {
            expect(res).toBeTruthy();
            expect(res.fullName).toBeTruthy();
            expect(res.projects.length).toEqual(2);
            console.log('aaa')
        })

        const req = httpMock.expectOne('http://localhost:3000/users');
        expect(req.cancelled).toBeFalsy();
        expect(req.request.responseType).toEqual('json');
        expect(req.request.method).toBe('GET');

        httpMock.verify();
    });
    it('should authenticate user2', () => {
        const loginData: LoginData = {
            email: 'user1@gmail.com',
            password: '123456'
        };
        const mockUserDetails: UserDetails = {
            "id": "967ad3fb5de5c25589206ac7725240cb0b7b5e3c009bb7595c5e68aec538e03b",
            "email": "user1@gmail.com",
            "fullName": "Nick Jons",
            "password": "123456",
            "projects": [
                "bb345da94d4c4105a2b15c879b7d2d577673a02a0a4bd05e4cf133d6d382c257",
                "7c6446f0ee99a26f95d7c084ae604cb6a07a597ff06ff0f25d9ce094daf286a8"
            ],
            "image": ""
        };


        service.signIn(loginData).subscribe((user: UserDetails) => {
            expect(user).toEqual(mockUserDetails);
        });

        const req = httpMock.expectOne('http://localhost:3000/users');
        expect(req.request.method).toBe('GET');

        req.flush([mockUserDetails]);
    });
});

