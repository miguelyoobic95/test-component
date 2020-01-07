import { Component, Prop, h, Element } from "@stencil/core";
import Polyglot from "node-polyglot";

@Component({
  tag: "my-component",
  styleUrl: "my-component.scss",
  shadow: true
})
export class MyComponent {
  @Prop() name: string;
  @Prop() action: string;
  @Prop() result: string;

  @Element() host: HTMLMyComponentElement;

  componentDidLoad() {
    if (!(window as any).polyglot) {
      (window as any).polyglot = new Polyglot({
        allowMissing: true,
        interpolation: { prefix: "{{", suffix: "}}" }
      } as any);
    }
  }

  render() {
    return (
      <div class="name">
        Hello. My name is {this.name}. You {this.action}. Prepare to{" "}
        {this.result}.
      </div>
    );
  }
}
