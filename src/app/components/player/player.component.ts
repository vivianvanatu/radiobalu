import { Component, OnInit, Renderer2 } from '@angular/core';
import { StreamService } from '../../services/stream.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [JsonPipe, HttpClientModule, CommonModule],
  providers: [StreamService],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent implements OnInit {

  streamUrl = 'https://media2.streambrothers.com:2020/stream/8016';
  streamData: any;
  isPlaying = false;
  volume = 1;

  constructor(private renderer: Renderer2, private streamService: StreamService) {}

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://media2.streambrothers.com:2020/dist/widgets.js';
    script.defer = true;
    this.renderer.appendChild(document.body, script);

    this.streamService.getStreamData().subscribe({
      next: (data) => {
        this.streamData = data;
        console.log('Stream data:', data);
      },
      error: (err) => console.error('Error loading stream data:', err),
    });
  }

  togglePlay(audio: HTMLAudioElement) {
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  changeVolume(audio: HTMLAudioElement, event: Event) {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    audio.volume = this.volume;
  }

}
