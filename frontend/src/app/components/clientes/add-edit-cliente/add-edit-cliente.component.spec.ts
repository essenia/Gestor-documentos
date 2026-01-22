import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClienteComponent } from './add-edit-cliente.component';

describe('AddEditClienteComponent', () => {
  let component: AddEditClienteComponent;
  let fixture: ComponentFixture<AddEditClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
