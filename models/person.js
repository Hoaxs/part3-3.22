const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
console.log('connecting to ', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({

    name: {
        type: String,
        minLength: 3,
        validate: {
            validator: function (v) {
                const regx = /\b[a-z]+|\b \b\s[a-z]+\b/ig
                if (!v.match(regx))
                    throw new Error(`${v}  is invalid `)
                else
                    return true
            }

        },
        required: [true, 'name required']
    },
    number: {
        type: String,
        maxlength: 11,
        validate: {
            validator: function (v) {

                if (!(/\d{2,3}-\d{6,7}/.test(v)))
                    throw new Error(`${v} is not a valid phone number`)
                else
                    return true
            }
        },
        required: [true, 'phone number required']
    }
})

personSchema.set('toJson', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', personSchema)