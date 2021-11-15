import {createStore} from 'redux'
import reducer from './reducer.js'
import { addEntry } from './actions.js'

const store = new createStore(reducer)

store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/originals/b2/ba/86/b2ba861d1024ebda7386d235a7f0a002.png',
    name: "Zax's",
    description: "Zax's is a jewelry store chain with more than 200 stores over 3 countries. It sells jewels such as diamond and other crystals and precious ores.",
    rating: 4.7,
    comments: [
        {
            messageContent: 'Very good!'
        },
    ]
}))
store.dispatch(addEntry({
    image: 'https://i.pinimg.com/736x/51/42/8d/51428da23cd4794e8f0a070d0b5147ab.jpg',
    name: "Buy now store",
    description: "We sell goods.",
    rating: 2.4,
    comments: [
        {
            messageContent: 'Great store'
        },
    ]
}))

export default store