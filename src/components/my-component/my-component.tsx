import { Component, Prop, h, Element } from "@stencil/core";
import { saveAs } from "file-saver";

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
    saveAs("", "");
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
