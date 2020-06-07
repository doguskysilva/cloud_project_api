const express = require('express')
const bodyParser = require('body-parser')
const Promise = require('bluebird')

const app = express()
const port = process.env.PORT || 3000
const taskRepository = require('./src/taskRepository')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function TaskException (message) {
    return { code: message }
}


app.get('/', async (req, res) => {
    let defaultTaks = [
        {
            name: 'Welcome to Tasks API',
            description: 'Here you can save temporally your tasks'
        },
        {
            name: 'Create account in Heroku',
            description: 'Enable account and create the fisrt app'
        }
    ]

    await taskRepository.createTable().then(() => Promise.all(
            defaultTaks.map(task => taskRepository.store(task.name, task.description))
        )
    )

    res.json({name: 'Todo Application', version: '1.0.0'})
})

app.get('/restart', (req, res) => {
    taskRepository.all()
        .then(tasks => {
            Promise.all(tasks.map(task => taskRepository.destroy(task.id)))
            res.json({ message: 'All tasks deleted' });
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.get('/tasks', (req, res) => {
    taskRepository.all()
        .then(rows => {
            res.json(rows)
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.post('/tasks', (req, res) => {
    taskRepository.store(req.body.name, req.body.description)
        .then(() => {
            res.status(201).json({message: 'Task created'})
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.put('/tasks/:id/done', (req, res) => {
    taskRepository.complete(req.params.id)
        .then(() => {
            res.json({message: 'Task Completed'})
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.get('/tasks/:id', (req, res) => {
    taskRepository.findById(req.params.id)
        .then((task) => {
            if (!task) {
                throw new TaskException('Task not exists')
            }

            res.json(task)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({message: err.code})
        })

})

app.put('/tasks/:id', (req, res) => {
    taskRepository.update(req.params.id, req.body.name, req.body.description)
        .then(() => {
            res.json({message: 'Task updated'})
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.delete('/tasks/:id', (req, res) => {
    taskRepository.destroy(req.params.id)
        .then(() => {
            res.json({message: 'Task deleted'})
        })
        .catch(err => {
            res.status(400).json({message: err.code})
        })
})

app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
);



