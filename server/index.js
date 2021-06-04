const dotenv = require("dotenv");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
    nanoid
} = require('nanoid');

const {
    graphqlHTTP
} = require('express-graphql');
const {
    buildSchema
} = require('graphql');





// mongoose Models
const Event = require('./models/event');
const User = require("./models/user");


//create app with express func
const app = express();
app.use(bodyParser.json());

dotenv.config();


// fetch Events 
const events = eventIds => {
    return Event.find({
        _id: {
            $in: eventIds
        }
    }).then(events => {
        return events.map(event => {
            return {
                ...event._doc,
                owner: user.bind(this, event.owner)
            }
        })
    }).catch(err => {
        throw err;
    })
}


// fetch User  
const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        }).catch(err => {
            throw err
        })
}


app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            from: String!
            to: String!
            owner: User!
        }
        input EventInput{
            title: String!
            description: String!
            from: String!
            to: String!
            owner: String!
        }

        type User{
            _id: ID!
            firstName: String!
            lastName: String!
            password: String
            age: Int!
            address: String!
            email: String!
            createdEvents: [Event!]!
        }
        input UserInput{
            firstName: String!
            lastName: String!
            password: String
            age: Int!
            address: String!
            email: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .populate('owner')
                .then(events => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                            owner: user.bind(this, event._doc.owner)
                        };
                    });
                }).catch(err => {
                    throw err
                });
        },
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                from: new Date(args.eventInput.from),
                to: new Date(args.eventInput.to),
                owner: '60ba01505b8beb4b88a2f83d',
                users: []
            })
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = {
                        ...result._doc
                    };
                    return User.findById('60ba01505b8beb4b88a2f83d')
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found !');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: args => {
            return User.findOne({
                    email: args.userInput.email
                }).then(user => {
                    if (user) {
                        throw new Error("User exists already !");
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        firstName: args.userInput.firstName,
                        lastName: args.userInput.lastName,
                        password: hashedPassword,
                        address: args.userInput.address,
                        email: args.userInput.email,
                        age: args.userInput.age,
                    });
                    return user.save();
                })
                .then(result => {
                    return {
                        ...result._doc,
                        password: null,
                        _id: result.id
                    };
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
}));

mongoose.connect(process.env.URI_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is ranning 🛴 on ${process.env.PORT}`);
    });
}).catch(err => {
    console.log(err);
});