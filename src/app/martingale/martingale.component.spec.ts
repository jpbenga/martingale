import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MartingaleComponent } from './martingale.component';

describe('MartingaleComponent', () => {
  let component: MartingaleComponent;
  let fixture: ComponentFixture<MartingaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MartingaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MartingaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
