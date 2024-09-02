import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
    };

    const addTask = async () => {
        const response = await axios.post('http://localhost:5000/tasks', newTask);
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '' });
    };

    const updateTask = async (task) => {
        const response = await axios.put(`http://localhost:5000/tasks/${task._id}`, task);
        setTasks(tasks.map(t => t._id === task._id ? response.data : t));
        setEditingTask(null);
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/tasks/${id}`);
        setTasks(tasks.filter(task => task._id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editingTask ? updateTask(editingTask) : addTask();
    };

    return (
        <Container>
            <Row className="justify-content-center my-4">
                <Col md={8}>
                    <h1 className="text-center">To-Do List</h1>
                    <Form onSubmit={handleSubmit} className="my-3">
                        <Form.Group controlId="taskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task title"
                                value={editingTask ? editingTask.title : newTask.title}
                                onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="taskDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task description"
                                value={editingTask ? editingTask.description : newTask.description}
                                onChange={(e) => editingTask ? setEditingTask({ ...editingTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 w-100">
                            {editingTask ? 'Update Task' : 'Add Task'}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h2 className="text-center">Tasks</h2>
                    {tasks.length === 0 ? (
                        <p className="text-center">No tasks available. Add a new task above.</p>
                    ) : (
                        tasks.map(task => (
                            <Card key={task._id} className="mb-3">
                                <Card.Body>
                                    <Card.Title>{task.title}</Card.Title>
                                    <Card.Text>{task.description}</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="secondary" onClick={() => setEditingTask(task)}>Edit</Button>
                                        <Button variant="danger" onClick={() => deleteTask(task._id)}>Delete</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default App;
