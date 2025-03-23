

// BEHAVIOR DELEGATION DEMO


// Define core utility 
const Loggable = {
  log(message) {
    console.log(`[${this.name || 'Component'}] ${message}`);
  }
};

const Stylable = {
  setStyle(styles) {
    Object.assign(this.style, styles);
    this.log(`Styles updated: ${JSON.stringify(styles)}`);
  }
};

// Create UI component using OLOO
const UIComponent = Object.assign(Object.create(null), {
  // Initialization method (not constructor)
  init(name) {
    this.name = name;
    this.style = {};
    return this;
  },

  // Base render method
  render() {
    this.log('Rendering...');
  }
});

// Create specific components through delegation
const Button = Object.create(UIComponent);
Object.assign(Button, {
  setup(name, onClick) {
    // Delegated initialization
    this.init(name);
    this.onClick = onClick;
    return this;
  },

  render() {
    // Delegated call to parent render
    UIComponent.render.call(this);
    console.log(`<button style="${JSON.stringify(this.style)}">${this.name}</button>`);
    this.log('Render complete');
  },

  click() {
    this.onClick();
    this.log('Button clicked');
  }
});

// 4. Create enhanced component through composition
const FancyButton = Object.create(Button);
Object.assign(FancyButton, {
  setup(name, onClick) {
    Button.setup.call(this, name, onClick);
    this.setStyle({ color: 'gold', padding: '10px' });
    return this;
  },

  animate() {
    this.log('Playing fancy animation!');
  }
});

// Create instances using prototype delegation
const myButton = Object.create(FancyButton)
  .setup('Submit', () => console.log('Click handler called!'));

// Add logging capability through composition
Object.assign(myButton, Loggable);


// USAGE DEMONSTRATION

console.log('=== Basic Usage ===');
myButton.render();
myButton.click();
myButton.animate();

console.log('\n=== Style Update ===');
myButton.setStyle({ padding: '20px' });

console.log('\n=== Prototype Chain Checks ===');
console.log('Is FancyButton in prototype chain?',
  FancyButton.isPrototypeOf(myButton)); // true
console.log('Is UIComponent in prototype chain?',
  UIComponent.isPrototypeOf(myButton)); // true

console.log('\n=== Performance Test ===');
console.time('OLOO Instance Creation');
for (let i = 0; i < 10000; i++) {
  Object.create(FancyButton).setup(`Btn${i}`, () => { });
}
console.timeEnd('OLOO Instance Creation');