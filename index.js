/* use error handling middleware*/

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

const errorHandler = (error, request, response, next) => {

    //console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }
    else if (error.name === 'ValidationError') {

        return response.status(400).send({ error: error.message })
    }
    next(error)//pass other types of errors to express
}


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).send({ error: 'content missing' })

    }

    try {
        const user = new Person({ name: body.name, number: body.number })
        user.validateSync()
    }
    catch (error) { error => next(error) }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))

})
app.get('/api/persons', (request, response) => {

    Person.find({}).then(person => {
        response.json(person)
    })
})


// use Mongoose findById method
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(400).end()
            }

        })
        .catch(error => {
            console.log(error)
            response.status(500).send({ error: 'malformed id' })
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(request.params.id)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => { console.log(`Running on port ${PORT}`) })