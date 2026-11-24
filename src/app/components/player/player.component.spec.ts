import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DEFAULT_COVER, DEFAULT_STREAM, StreamService } from '../../services/stream.service';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let service: jasmine.SpyObj<StreamService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('StreamService', ['getStreamData']);
    service.getStreamData.and.returnValue(of({ title: 'Current song', cover: DEFAULT_COVER, history: [{ title: 'Previous song' }], listeners: 2, listenUrl: DEFAULT_STREAM }));
    await TestBed.configureTestingModule({
      imports: [PlayerComponent]
    })
    .overrideComponent(PlayerComponent, { set: { providers: [{ provide: StreamService, useValue: service }] } })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => fixture.destroy());

  it('renders metadata and the fallback artwork', fakeAsync(() => {
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.title')?.textContent).toBe('Current song');
    expect(element.querySelector('.track-name')?.textContent).toBe('Previous song');
    expect(element.querySelector('.cover-art')?.getAttribute('src')).toBe(DEFAULT_COVER);
    expect(element.textContent).toContain('2 listeners');
    fixture.destroy();
  }));

  it('recovers after a failed poll and stops on destruction', fakeAsync(() => {
    spyOn(console, 'error');
    service.getStreamData.and.returnValues(throwError(() => new Error('Temporary failure')), of({ title: 'Recovered', cover: DEFAULT_COVER, history: [], listeners: 1, listenUrl: DEFAULT_STREAM }));
    fixture.detectChanges();
    tick(0);
    tick(5000);
    expect(component.streamData?.title).toBe('Recovered');
    fixture.destroy();
    tick(5000);
    expect(service.getStreamData).toHaveBeenCalledTimes(2);
  }));
});
