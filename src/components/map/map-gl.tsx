import { Component, h } from '@stencil/core';

const mapboxgl = (window as any).mapboxgl;

@Component({
  tag: 'yoo-map-gl',
  styleUrl: 'map-gl.scss',
  shadow: true
})
export class YooMapGlComponent {

  private mapContainer: any;
  private map: any;

  componentDidLoad() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoieW9vYmljIiwiYSI6ImNpcTNxaGgwYzAwNjhodm5rdDRmM3JtMmwifQ.Ro3b2vKP5fMMd8ibPKy65A';

    // Basic map setup
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/yoobic/ciq7yppji0085cqm7c0np246c',
    });

    // Map Event Handling below
    this.map.on('load', () => {
      console.log('map loaded');
    });
  }

  render() {
    let mapStyles = {
      height: '100%',
      width: '100%'
    };
    return (
      <div class="column-container">
        <div class="map-container" style={mapStyles} ref={(el) => (this.mapContainer = el as HTMLDivElement)}></div>
      </div>
    );
  }
}