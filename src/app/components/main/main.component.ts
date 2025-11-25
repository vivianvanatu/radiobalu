import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  images = [
    { src: 'assets/images/launch/radio-balu-launch-1.jpg', alt: 'Radio Balu launch event 1' },
    { src: 'assets/images/launch/radio-balu-launch-2.jpg', alt: 'Radio Balu launch event 2' },
    { src: 'assets/images/launch/radio-balu-launch-3.jpg', alt: 'Radio Balu launch event 3' },
    { src: 'assets/images/launch/radio-balu-launch-4.jpg', alt: 'Radio Balu launch event 4' },
    { src: 'assets/images/launch/radio-balu-launch-5.jpg', alt: 'Radio Balu launch event 5 - Logo' }
  ];

  selectedIndex = 0;

  openImage(index: number) {
    this.selectedIndex = index;

    const modal = document.getElementById('imageModal');

    modal?.addEventListener('shown.bs.modal', () => {
      const carouselEl = document.getElementById('galleryCarousel');
      // @ts-ignore
      const carousel = bootstrap.Carousel.getInstance(carouselEl);
      carousel?.to(index);
    }, { once: true });
  }

}
