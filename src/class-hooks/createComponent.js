import { Hook } from './hooks';
import { NewComponent } from './NewComponent';

// This function uses the given component class and creates a function component
// that uses the instance of the component class to call the necessary hooks and render function
// The scope of the class instance will be contained, which will require no modification
// to the class component. This method is like creating custom hooks but inside classes
export function createComponent(Component) {
    const clsComponent = Component.__proto__.prototype.constructor.name;
    const clsBase = NewComponent.prototype.constructor.name;
    if (clsComponent !== clsBase) {
        throw new Error(`${clsComponent} must be an instance of NewComponent`);
    }

    return function(props) {
        // create a class instance
        const instance = new Component(props);

        // extract hooks
        const hooks = Object.values(instance).filter(
            val => val instanceof Hook
        );

        // call hooks first
        hooks.forEach(hook => {
            hook.run();
        });

        // return React element from render function of the instance
        return instance.render();
    };
}
