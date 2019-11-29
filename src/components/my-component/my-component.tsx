import { Component, Prop, h, Element } from '@stencil/core';
import { isCordova } from '../../utils';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss',
  shadow: true
})
export class MyComponent {
  @Prop() name: string;
  @Prop() action: string;
  @Prop() result: string;

  @Element() host: HTMLMyComponentElement;

  componentDidLoad() {
    if (isCordova()) {
      ScreenOrientation.unlock();
    }
  }

  render() {
    return <div class="name">Hello. My name is {this.name}. You {this.action}. Prepare to {this.result}.</div>;
  }
}
