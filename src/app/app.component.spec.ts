import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { Location } from '@angular/common';
import { HomeComponent } from './home/home.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: HomeComponent } // Define routes for testing
        ])
      ],
      declarations: [
        AppComponent
      ],
      providers: [Location]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should navigate to /home when clicking "Scan"', () => {
    const compiled = fixture.nativeElement;
    const scanLink = compiled.querySelector('a[routerLink="/home"]');
    expect(scanLink).toBeTruthy();
    expect(scanLink.textContent).toBe('Scan');

    const location = TestBed.inject(Location);
    const currentUrl = location.path();

    scanLink.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const newUrl = location.path();
      expect(newUrl).toBe('/home');
      expect(currentUrl).not.toBe(newUrl);
    });
  });

  it('should navigate to /dashboard when clicking "Dashboard"', () => {

    const compiled = fixture.nativeElement;
    const dashboardLink = compiled.querySelector('a[routerLink="/dashboard"]');
    expect(dashboardLink).toBeTruthy();

    dashboardLink.click();
    fixture.detectChanges();
    // You might want to assert further things here, like if the router navigated properly
  });

});
