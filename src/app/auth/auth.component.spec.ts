import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { of } from 'rxjs/internal/observable/of';
import { LoginData, UserDetails } from '../shared/services/auth/auth.model';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let service: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule
      ],
      providers: [AuthService],
      declarations: [AuthComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Unit test for subscribe method', fakeAsync(() => {
    let data: LoginData = {
      password: '123456',
      email: 'user1@gmail.com'
    }
    let spy = spyOn(service, 'signIn').and.returnValue(of());
    let subSpy = spyOn(service.signIn(data), 'subscribe');
    component.signIn(data);
    tick();
    expect(spy).toHaveBeenCalledBefore(subSpy);
    expect(subSpy).toHaveBeenCalled();
  }));
});
