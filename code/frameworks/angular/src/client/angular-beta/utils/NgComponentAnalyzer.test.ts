import {
  ComponentFactory,
  Type,
  Component,
  ComponentFactoryResolver,
  Directive,
  EventEmitter,
  HostBinding,
  Injectable,
  Input,
  Output,
  Pipe,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import {
  getComponentInputsOutputs,
  isComponent,
  isDeclarable,
  getComponentDecoratorMetadata,
  isStandaloneComponent,
} from './NgComponentAnalyzer';

describe('getComponentInputsOutputs', () => {
  it('should return empty if no I/O found', () => {
    @Component({})
    class FooComponent {}

    expect(getComponentInputsOutputs(FooComponent)).toEqual({
      inputs: [],
      outputs: [],
    });

    class BarComponent {}

    expect(getComponentInputsOutputs(BarComponent)).toEqual({
      inputs: [],
      outputs: [],
    });
  });

  it('should return I/O', () => {
    @Component({
      template: '',
      inputs: ['inputInComponentMetadata'],
      outputs: ['outputInComponentMetadata'],
    })
    class FooComponent {
      @Input()
      public input: string;

      @Input('inputPropertyName')
      public inputWithBindingPropertyName: string;

      @Output()
      public output = new EventEmitter<Event>();

      @Output('outputPropertyName')
      public outputWithBindingPropertyName = new EventEmitter<Event>();
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect({ inputs, outputs }).toEqual({
      inputs: [
        { propName: 'inputInComponentMetadata', templateName: 'inputInComponentMetadata' },
        { propName: 'input', templateName: 'input' },
        { propName: 'inputWithBindingPropertyName', templateName: 'inputPropertyName' },
      ],
      outputs: [
        { propName: 'outputInComponentMetadata', templateName: 'outputInComponentMetadata' },
        { propName: 'output', templateName: 'output' },
        { propName: 'outputWithBindingPropertyName', templateName: 'outputPropertyName' },
      ],
    });

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });

  it("should return I/O when some of component metadata has the same name as one of component's properties", () => {
    @Component({
      template: '',
      inputs: ['input', 'inputWithBindingPropertyName'],
      outputs: ['outputWithBindingPropertyName'],
    })
    class FooComponent {
      @Input()
      public input: string;

      @Input('inputPropertyName')
      public inputWithBindingPropertyName: string;

      @Output()
      public output = new EventEmitter<Event>();

      @Output('outputPropertyName')
      public outputWithBindingPropertyName = new EventEmitter<Event>();
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });

  it('should return I/O in the presence of multiple decorators', () => {
    @Component({
      template: '',
    })
    class FooComponent {
      @Input()
      @HostBinding('class.preceeding-first')
      public inputPreceedingHostBinding: string;

      @HostBinding('class.following-binding')
      @Input()
      public inputFollowingHostBinding: string;
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect({ inputs, outputs }).toEqual({
      inputs: [
        { propName: 'inputPreceedingHostBinding', templateName: 'inputPreceedingHostBinding' },
        { propName: 'inputFollowingHostBinding', templateName: 'inputFollowingHostBinding' },
      ],
      outputs: [],
    });

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });

  it('should return I/O with extending classes', () => {
    @Component({
      template: '',
    })
    class BarComponent {
      @Input()
      public a: string;

      @Input()
      public b: string;
    }

    @Component({
      template: '',
    })
    class FooComponent extends BarComponent {
      @Input()
      public b: string;

      @Input()
      public c: string;
    }

    const fooComponentFactory = resolveComponentFactory(FooComponent);

    const { inputs, outputs } = getComponentInputsOutputs(FooComponent);

    expect({ inputs, outputs }).toEqual({
      inputs: [
        { propName: 'a', templateName: 'a' },
        { propName: 'b', templateName: 'b' },
        { propName: 'c', templateName: 'c' },
      ],
      outputs: [],
    });

    expect(sortByPropName(inputs)).toEqual(sortByPropName(fooComponentFactory.inputs));
    expect(sortByPropName(outputs)).toEqual(sortByPropName(fooComponentFactory.outputs));
  });
});

describe('isDeclarable', () => {
  it('should return true with a Component', () => {
    @Component({})
    class FooComponent {}

    expect(isDeclarable(FooComponent)).toEqual(true);
  });

  it('should return true with a Directive', () => {
    @Directive({})
    class FooDirective {}

    expect(isDeclarable(FooDirective)).toEqual(true);
  });

  it('should return true with a Pipe', () => {
    @Pipe({ name: 'pipe' })
    class FooPipe {}

    expect(isDeclarable(FooPipe)).toEqual(true);
  });

  it('should return false with simple class', () => {
    class FooPipe {}

    expect(isDeclarable(FooPipe)).toEqual(false);
  });
  it('should return false with Injectable', () => {
    @Injectable()
    class FooInjectable {}

    expect(isDeclarable(FooInjectable)).toEqual(false);
  });
});

describe('isComponent', () => {
  it('should return true with a Component', () => {
    @Component({})
    class FooComponent {}

    expect(isComponent(FooComponent)).toEqual(true);
  });

  it('should return false with simple class', () => {
    class FooPipe {}

    expect(isComponent(FooPipe)).toEqual(false);
  });
  it('should return false with Directive', () => {
    @Directive()
    class FooDirective {}

    expect(isComponent(FooDirective)).toEqual(false);
  });
});

describe('isStandaloneComponent', () => {
  it('should return true with a Component with "standalone: true"', () => {
    // TODO: `standalone` is only available in Angular v14. Remove cast to `any` once
    // Angular deps are updated to v14.x.x.
    @Component({ standalone: true } as any)
    class FooComponent {}

    expect(isStandaloneComponent(FooComponent)).toEqual(true);
  });

  it('should return false with a Component with "standalone: false"', () => {
    // TODO: `standalone` is only available in Angular v14. Remove cast to `any` once
    // Angular deps are updated to v14.x.x.
    @Component({ standalone: false } as any)
    class FooComponent {}

    expect(isStandaloneComponent(FooComponent)).toEqual(false);
  });

  it('should return false with a Component without the "standalone" property', () => {
    @Component({})
    class FooComponent {}

    expect(isStandaloneComponent(FooComponent)).toEqual(false);
  });

  it('should return false with simple class', () => {
    class FooPipe {}

    expect(isStandaloneComponent(FooPipe)).toEqual(false);
  });

  it('should return false with Directive', () => {
    @Directive()
    class FooDirective {}

    expect(isStandaloneComponent(FooDirective)).toEqual(false);
  });
});

describe('getComponentDecoratorMetadata', () => {
  it('should return Component with a Component', () => {
    @Component({ selector: 'foo' })
    class FooComponent {}

    expect(getComponentDecoratorMetadata(FooComponent)).toBeInstanceOf(Component);
    expect(getComponentDecoratorMetadata(FooComponent)).toEqual({
      changeDetection: 1,
      selector: 'foo',
    });
  });

  it('should return Component with extending classes', () => {
    @Component({ selector: 'bar' })
    class BarComponent {}
    @Component({ selector: 'foo' })
    class FooComponent extends BarComponent {}

    expect(getComponentDecoratorMetadata(FooComponent)).toBeInstanceOf(Component);
    expect(getComponentDecoratorMetadata(FooComponent)).toEqual({
      changeDetection: 1,
      selector: 'foo',
    });
  });
});

function sortByPropName(
  array: {
    propName: string;
    templateName: string;
  }[]
) {
  return array.sort((a, b) => a.propName.localeCompare(b.propName));
}

function resolveComponentFactory<T extends Type<any>>(component: T): ComponentFactory<T> {
  TestBed.configureTestingModule({
    declarations: [component],
  }).overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [component],
    },
  });
  const componentFactoryResolver = TestBed.inject(ComponentFactoryResolver);

  return componentFactoryResolver.resolveComponentFactory(component);
}
