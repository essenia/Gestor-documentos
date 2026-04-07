import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasoForm } from './caso-form';

describe('CasoForm', () => {
  let component: CasoForm;
  let fixture: ComponentFixture<CasoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
