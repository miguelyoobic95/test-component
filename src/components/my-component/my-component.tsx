import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss',
  shadow: true
})
export class MyComponent {
  @Prop() name: string;
  @Prop() action: string;
  @Prop() complexProp: { name: string, age: number, presence: boolean};
  @Prop() result: string;

  componentWillLoad() {
    console.log('WILL LOAD, PROP FROM ANGULAR, undefined', this.complexProp);
  }

  componentDidLoad() {
    console.log('DID LOAD, PROP FROM ANGULAR, defined', this.complexProp);
  }

  render() {
    return <div class="name">Hello. My name is {this.name}. You {this.action}. Prepare to {this.result}.</div>;
  }
}
