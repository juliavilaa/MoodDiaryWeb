import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmocionComponent } from './emocion.component';

describe('AnimalComponent', () => {
  let component: EmocionComponent;
  let fixture: ComponentFixture<EmocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmocionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
