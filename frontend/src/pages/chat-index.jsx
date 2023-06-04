
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadChats, addCar, updateCar, removeCar, addToCart } from '../store/car.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/car.service.js'
import { loadboard } from '../store/board.actions.js'
import { ChatList } from '../cmps/chat-list.jsx'
import { Hero } from '../cmps/hero.jsx'
import { ChatDetails } from '../cmps/chat-details.jsx'

export function ChatIndex() {

    const board = useSelector(storeState => storeState.carModule.board)
    const [selectedChat, setSelectedChat] = useState(null)

    useEffect(() => {
        loadboard()
    }, [])

    async function onRemoveCar(carId) {
        try {
            await removeCar(carId)
            showSuccessMsg('Car removed')
        } catch (err) {
            showErrorMsg('Cannot remove car')
        }
    }

    async function onAddCar() {
        const car = carService.getEmptyCar()
        car.vendor = prompt('Vendor?')
        try {
            const savedCar = await addCar(car)
            showSuccessMsg(`Car added (id: ${savedCar._id})`)
        } catch (err) {
            showErrorMsg('Cannot add car')
        }
    }

    async function onUpdateCar(car) {
        const price = +prompt('New price?')
        const carToSave = { ...car, price }
        try {
            const savedCar = await updateCar(carToSave)
            showSuccessMsg(`Car updated, new price: ${savedCar.price}`)
        } catch (err) {
            showErrorMsg('Cannot update car')
        }
    }

    function onAddToCart(car) {
        console.log(`Adding ${car.vendor} to Cart`)
        addToCart(car)
        showSuccessMsg('Added to Cart')
    }

    function onAddCarMsg(car) {
        console.log(`TODO Adding msg to car`)
    }


    return (
        <div className='chat-index'>
            <div className='green-background'></div>
            <div className='grey-background'></div>
            <main className='flex'>
                {!!board[0]?.chats.length && <ChatList
                    chats={board[0]?.chats}
                    setSelectedChat={setSelectedChat}
                />}
                {selectedChat ? <ChatDetails chat={selectedChat} /> : <Hero />}
            </main>
            {/* <main>
                <button onClick={onAddCar}>Add Car ⛐</button>
                <ul className="car-list">
                    {cars.map(car =>
                        <li className="car-preview" key={car._id}>
                            <h4>{car.vendor}</h4>
                            <h1>⛐</h1>
                            <p>Price: <span>${car.price.toLocaleString()}</span></p>
                            <p>Owner: <span>{car.owner && car.owner.fullname}</span></p>
                            <div>
                                <button onClick={() => { onRemoveCar(car._id) }}>x</button>
                                <button onClick={() => { onUpdateCar(car) }}>Edit</button>
                            </div>

                            <button onClick={() => { onAddCarMsg(car) }}>Add car msg</button>
                            <button className="buy" onClick={() => { onAddToCart(car) }}>Add to cart</button>
                        </li>)
                    }
                </ul>
            </main> */}
        </div>
    )
}