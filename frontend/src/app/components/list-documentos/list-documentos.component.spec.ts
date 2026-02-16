import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDocumentosComponent } from './list-documentos.component';

describe('ListDocumentosComponent', () => {
  let component: ListDocumentosComponent;
  let fixture: ComponentFixture<ListDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
