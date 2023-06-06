import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Container, TextField } from '@mui/material';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
  //const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const handleInputChange = (event) => {
    setNewTaskTitle(event.target.value);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== '') {
      const newTask = {
        title: newTaskTitle,
        completed: false,
        important: false,
      };

      fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
        .then((response) => response.json())
        .then((data) => {
          setTasks([...tasks, data]);
          setNewTaskTitle('');
        });
    }
  };

  const handleToggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    // Remove a mensagem de sucesso após 3 segundos
    setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTasks.find((task) => task.id === taskId)),
    })
      .then((response) => response.json())
      .then(() => setTasks(updatedTasks));
  };

  const handleToggleImportance = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          important: !task.important,
        };
      }
      return task;
    });

    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTasks.find((task) => task.id === taskId)),
    })
      .then((response) => response.json())
      .then(() => setTasks(updatedTasks));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE',
    }).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    });
  };

    // Remove a mensagem de erro após 3 segundos
    setTimeout(() => {
        setErrorMessage("");
    }, 3000);

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <h1>Lista de Tarefas do GaldiLuna</h1>
      <div>
        <TextField
          label="Nova Tarefa"
          variant="outlined"
          value={newTaskTitle}
          onChange={handleInputChange}
        />
        <Button variant="contained" onClick={handleAddTask} sx={{ marginLeft: '1rem' }}>
          Adicionar
        </Button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Checkbox
              checked={task.completed}
              onChange={() => handleToggleCompletion(task.id)}
              color="primary"
            />
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: task.important ? 'bold' : 'normal',
              }}
            >
              {task.title}
            </span>
            <Button
              variant="contained"
              onClick={() => handleToggleImportance(task.id)}
              sx={{ marginLeft: '1rem' }}
            >
              {task.important ? 'Remover Importância' : 'Marcar como Importante'}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteTask(task.id)}
              sx={{ marginLeft: '1rem' }}
            >
              Excluir
            </Button>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TaskList;
