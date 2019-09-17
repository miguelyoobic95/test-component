import { Component, Prop, h, Element } from '@stencil/core';
import { LoginFocusAnimation } from '../../utils';

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
    this.playAnimation();
  }

  playAnimation() {
    let focusAnimation = new LoginFocusAnimation();
    let elements = (this.host.shadowRoot || this.host).querySelector('.name');
    console.log("TCL: MyComponent -> playAnimation -> elements", elements)
    focusAnimation.addContainer(elements);
    focusAnimation.playFocus();
  }

  render() {
    return <div class="name">Hello. My name is {this.name}. You {this.action}. Prepare to {this.result}.</div>;
  }
}
