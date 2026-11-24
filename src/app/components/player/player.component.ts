import { Component, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_COVER, DEFAULT_STREAM, StreamData, StreamService } from '../../services/stream.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { catchError, EMPTY, Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [StreamService],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit, OnDestroy {

  streamUrl = DEFAULT_STREAM;
  streamData?: StreamData;
  isPlaying = false;
  volume = 1;
  private sub!: Subscription;

  constructor(private streamService: StreamService) {}

  ngOnInit(): void {
    this.sub = timer(0, 5000)
      .pipe(switchMap(() => this.streamService.getStreamData().pipe(
        catchError(err => {
          console.error('Error loading stream data:', err);
          return EMPTY;
        })
      )))
      .subscribe({
        next: (data) => {
          this.streamData = data;
          this.streamUrl = data.listenUrl;
        },
        error: (err) => console.error('Error loading stream data:', err),
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  useFallbackCover(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (!image.src.endsWith(DEFAULT_COVER)) {
      image.src = DEFAULT_COVER;
    }
  }

  togglePlay(audio: HTMLAudioElement) {
    if (this.isPlaying) {
      audio.pause();
    } else {
      void audio.play().catch(err => {
        this.isPlaying = false;
        console.error('Unable to play stream:', err);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  changeVolume(audio: HTMLAudioElement, event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    audio.volume = this.volume;
  }

}
