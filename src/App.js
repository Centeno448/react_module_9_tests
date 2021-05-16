import React, {useState, useRef, useEffect} from 'react';
import TareasLista from './TareasLista';
import { v4 as uuidv4 } from 'uuid';

const ALMACENAMIENTO_LOCAL_KEY = 'tareasApp.tareas'

function App() {
  const [ tareas, setTareas ] = useState ([ ])
  const tareaNombreRef = useRef()

  useEffect( () => {
    const tareasGuardadas = JSON.parse(localStorage.getItem 
    (ALMACENAMIENTO_LOCAL_KEY))
    if (tareasGuardadas) setTareas (tareasGuardadas)
    }, [])
    

  useEffect( () => {
    localStorage.setItem(ALMACENAMIENTO_LOCAL_KEY, JSON.stringify(tareas))
    }, [tareas])
    
  function marcadoTarea(id) { 

      const nuevaListaTareas = [...tareas] 
      
      const tarea = nuevaListaTareas.find(tarea => tarea.id === id) 
      
      tarea.completado = !tarea.completado 
      
      setTareas(nuevaListaTareas) 
      
  } 

  function agregarTarea(e){
    const nombre = tareaNombreRef.current.value
    if (nombre === '' ) return
    setTareas(prevTareas => {
      return [...prevTareas, {id:uuidv4(), nombre:nombre, completado:false}]
    })
    tareaNombreRef.current.value = null
  }
  
  return (
    <>
    <TareasLista tareas={tareas} marcadoTarea= {marcadoTarea}/>
    <input ref={tareaNombreRef} type="text" />
    <button onClick={agregarTarea}>Añadir Tarea</button>
    <button>Limpiar Tareas Completadas</button>
    <div>0 tareas por terminar</div>
    </>
  )
}

export default App;
