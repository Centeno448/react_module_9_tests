import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import TareasLista from './TareasLista';
import Tarea from './Tarea';

beforeAll(() => {
  configure({ adapter: new Adapter() });
});

test('TareasLista manda el prop "tarea" a Tarea | Asegúrate de que TareasLista mande un prop "tarea" al componenete Tarea', () => {
  const wrapper = shallow(<TareasLista tareas={['']} />);
  expect(wrapper.find(Tarea).prop('tarea')).toBeDefined();
});

test('TareasLista manda el prop "marcadoTarea" a Tarea | Asegúrate de que TareasLista mande un prop "marcadoTarea" al componenete Tarea. Este prop debe ser la funcion definida en app llamada marcadoTarea', () => {
  const wrapper = shallow(
    <TareasLista tareas={['']} marcadoTarea={jest.fn()} />
  );
  expect(wrapper.find(Tarea).prop('marcadoTarea')).toBeDefined();
});

test('TareasLista manda tarea.id en el prop "key" a Tarea | Asegúrate de que TareasLista mande "tarea.id" al prop "key" del componenete Tarea', () => {
  const regex = /},[\da-zA-Z,.\s]+,/g;
  const tareasListaDefinition = TareasLista.toString().match(regex)[0];

  if (tareasListaDefinition.includes(', void 0,')) {
    throw new Error('key not set');
  }

  if (!tareasListaDefinition.includes(', tarea.id,')) {
    throw new Error('tarea not pased to key prop');
  }
});

test('TareasLista renderiza componentes Tarea en base a prop "tareas" | Asegúrate de que TareasLista reciba un prop "tareas" de tipo array y renderice un componenete Tarea por cada elemento presente', () => {
  const wrapper = shallow(<TareasLista tareas={['', '', '']} />);
  expect(wrapper.find(Tarea).length).toBe(3);
});
