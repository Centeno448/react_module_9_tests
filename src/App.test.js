import '@testing-library/jest-dom';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { shallow } from 'enzyme';
import App from './App';
import TareasLista from './TareasLista';
import Tarea from './Tarea';
import { validate } from 'uuid';

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

beforeEach(() => {
  window.localStorage.setItem('tareasApp.tareas', JSON.stringify([]));
});

test('App.js tiene 1 componente hijo TareasLista.js | Asegúrate de renderizar 1 vez el componente <TareasLista> dentro de App.js', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find(TareasLista).length).toBe(1);
});

test('App.js tiene 1 <input type="text"> | Asegúrate de renderizar 1 vez un <input type="text" /> dentro de App.js', () => {
  const wrapper = shallow(<App />);
  const input = wrapper.find('input[type="text"]');
  expect(input).toBeDefined();
  expect(input.length).toBe(1);
});

test('App.js tiene 2 botones con texto | Asegúrate de renderizar 2 botones con texto dentro de App.js', () => {
  const wrapper = shallow(<App />);
  const buttons = wrapper.find('button');
  expect(buttons).toBeDefined();
  expect(buttons.length).toBe(2);
  expect(buttons.at(0).text().trim()).not.toBe('');
  expect(buttons.at(1).text().trim()).not.toBe('');
});

test('App.js tiene 1 div con texto | Asegúrate de renderizar 1 div con texto dentro de App.js', () => {
  const wrapper = shallow(<App />);
  const div = wrapper.find('div');
  expect(div).toBeDefined();
  expect(div.length).toBe(1);
  expect(div.first().text().trim()).not.toBe('');
});

test('App.js utiliza el hook useState | Asegúrate de utilizar el hook useState dentro de App.js', () => {
  const appDefinition = App.toString();

  expect(appDefinition).toContain(
    'const [tareas, setTareas] = (0, _react.useState)([]);'
  );
});

test('App.js manda el prop "tareas" a TareasLista | Asegúrate de que App.js mande el prop "tareas" al componente TareasLista', () => {
  const wrapper = shallow(<App />);
  const tareasLista = wrapper.find(TareasLista);
  expect(tareasLista.prop('tareas')).toBeDefined();
  expect(tareasLista.prop('tareas').length).toBe(0);
});

test('App.js manda el prop "marcadoTarea" a TareasLista | Asegúrate de que App.js mande el prop "marcadoTarea" al componente TareasLista. El prop debe ser una funcion llamada marcadoTarea', () => {
  const wrapper = shallow(<App />);
  const tareasLista = wrapper.find(TareasLista);
  expect(tareasLista.prop('marcadoTarea')).toBeDefined();
  expect(tareasLista.prop('marcadoTarea').name).toBe('marcadoTarea');
  expect(tareasLista.prop('marcadoTarea').length).toBe(1);
});

test('App maneja click en Añadir Tarea | Asegúrate de que en App.js el boton que de agregar tareas diga "Añadir Tarea" y maneje el evento onClick con una función llamada "agregarTarea" que reciba 1 parámetro', () => {
  const wrapper = shallow(<App />);
  const buttons = wrapper.find('button');
  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);

  let addButton = undefined;
  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }
  expect(addButton.prop('onClick')).toBeDefined();
  expect(addButton.prop('onClick').name).toBe('agregarTarea');
  expect(addButton.prop('onClick').length).toBe(1);
});

test('App utiliza ref | Asegúrate de que en App.js crees una ref llamada "tareaNombreRef" y le asignes a la propiedad ref del input', () => {
  const appDefinition = App.toString();
  const regex = /"input", {[\da-zA-Z:,"\s]+}/g;
  const inputDefinition = appDefinition.match(regex)[0];

  if (!appDefinition.includes('const tareaNombreRef = (0, _react.useRef)();')) {
    throw new Error('ref not implemented');
  }

  if (!inputDefinition.includes('ref: tareaNombreRef')) {
    throw new Error('ref not in use on input');
  }
});

test('App no agrega una nueva tarea si el nombre está vacío | Asegúrate de que la función agregar tarea no cree una nueva tarea si es que el nombre de la tarea es vacío', () => {
  const wrapper = mount(<App />);
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = '';
  addButton.simulate('click');
  expect(wrapper.find(Tarea).length).toBe(0);
});

test('App al agregar una tarea, resetea el valor de la refencia tareaNombreRef a un string vacío | Asegúrate de que la función agregar tarea coloque el valor de tareaNombreRef a un string vacío después de que haya creado la nueva tarea', () => {
  const wrapper = mount(<App />);
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = 'asd';
  addButton.simulate('click');
  expect(wrapper.find("input[type='text']").getDOMNode().value).toBe('');
});

test('App agrega una nueva tarea | Asegúrate de que la función agregar tarea tome el valor de la referencia del input y llame a la función setTareas', () => {
  const wrapper = mount(<App />);
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = 'New item';
  addButton.simulate('click');
  expect(wrapper.find(Tarea).length).toBe(1);
  const firstTarea = wrapper.find(Tarea).first().prop('tarea');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 2';
  addButton.simulate('click');
  expect(wrapper.find(Tarea).length).toBe(2);
  const secondTarea = wrapper.find(Tarea).at(1).prop('tarea');

  expect(validate(firstTarea.id)).toBe(true);
  expect(firstTarea.nombre).toBe('New item');
  expect(firstTarea.completado).toBe(false);

  expect(validate(secondTarea.id)).toBe(true);
  expect(secondTarea.nombre).toBe('New item 2');
  expect(secondTarea.completado).toBe(false);

  expect(firstTarea.id).not.toBe(secondTarea.id);
});

test('App escribe las tareas a localStorage | Asegúrate de que guardes las tareas creadas en localStorage bajo la llave "tareasApp.tareas"', () => {
  const wrapper = mount(<App />);
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = 'New item';
  addButton.simulate('click');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 2';
  addButton.simulate('click');

  const tareas = JSON.parse(window.localStorage.getItem('tareasApp.tareas'));
  expect(Array.isArray(tareas)).toBe(true);
  expect(tareas.length).toBe(2);
  expect(tareas[0].nombre).toBe('New item');
  expect(tareas[1].nombre).toBe('New item 2');
});

test('App lee las tareas de localStorage despues de refrescar la página | Asegúrate de que obtengas las tareas guardadas en localStorage despues de refrescar la pagina', () => {
  const regex = /\(0, _react.useEffect\)[()\s=>{a-zA-Z._;}]+, \[]/g;
  const useEffectDefinition = App.toString().match(regex)[0];
  let implemented = true;

  if (!useEffectDefinition.includes('localStorage.getItem')) {
    implemented = false;
  }

  if (!useEffectDefinition.includes('setTareas')) {
    implemented = false;
  }

  if (!implemented) throw new Error('not implemented');
});

test('App maneja click en Limpiar Tareas Completadas | Asegúrate de que en App.js el boton que de agregar tareas diga "Limpiar Tareas Completadas" y maneje el evento onClick con una función llamada "manejoLimpiarTareas" que reciba 1 parámetro', () => {
  const wrapper = shallow(<App />);
  const buttons = wrapper.find('button');
  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);

  let deleteButton = undefined;
  if (firstButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = firstButton;
  } else if (secondButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  expect(deleteButton.prop('onClick')).toBeDefined();
  expect(deleteButton.prop('onClick').name).toBe('manejoLimpiarTareas');
  expect(deleteButton.prop('onClick').length).toBe(1);
});

test('App elimina las tareas completadas | Asegúrate de que la función manejoLimpiarTareas limpie las tareas completadas', () => {
  const wrapper = mount(<App />);
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;
  let deleteButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  if (firstButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = firstButton;
  } else if (secondButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = 'New item';
  addButton.simulate('click');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 2';
  addButton.simulate('click');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 3';
  addButton.simulate('click');

  const tareaWrapper = wrapper.find(Tarea).at(1);
  const div = tareaWrapper.find('div');
  const label = div.find('label');
  const checkbox = label.find('input[type="checkbox"]');

  checkbox.simulate('change', { target: { checked: true } });

  deleteButton.simulate('click');

  expect(wrapper.find(Tarea).length).toBe(2);
  const tarea1 = wrapper.find(Tarea).at(0);
  const tarea2 = wrapper.find(Tarea).at(1);

  expect(tarea1.prop('tarea').nombre).toBe('New item');
  expect(tarea2.prop('tarea').nombre).toBe('New item 3');
});

test('App.js tiene 1 div con la cantidad de tareas por terminar | Asegúrate de renderizar 1 div con la cantidad de tareas por terminar dentro de App.js', () => {
  const wrapper = mount(<App />);
  const div = wrapper.find('div');
  const buttons = wrapper.find('button');

  const firstButton = buttons.at(0);
  const secondButton = buttons.at(1);
  let addButton = undefined;
  let deleteButton = undefined;

  if (firstButton.text().includes('Añadir Tarea')) {
    addButton = firstButton;
  } else if (secondButton.text().includes('Añadir Tarea')) {
    addButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  if (firstButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = firstButton;
  } else if (secondButton.text().includes('Limpiar Tareas Completadas')) {
    deleteButton = secondButton;
  } else {
    throw new Error('No existe el botón');
  }

  wrapper.find("input[type='text']").getDOMNode().value = 'New item';
  addButton.simulate('click');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 2';
  addButton.simulate('click');

  wrapper.find("input[type='text']").getDOMNode().value = 'New item 3';
  addButton.simulate('click');

  expect(div.first().text()).toContain(wrapper.find(Tarea).length.toString());

  const tareaWrapper = wrapper.find(Tarea).last();
  const tareaDiv = tareaWrapper.find('div');
  const label = tareaDiv.find('label');
  const checkbox = label.find('input[type="checkbox"]');

  checkbox.simulate('change', { target: { checked: true } });

  deleteButton.simulate('click');

  expect(div.first().text()).toContain(wrapper.find(Tarea).length.toString());
});
