import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../../context/cart';
import { API_PAYMENT, API_URL } from '../utils/constants';
import { AuthContext } from '../../context/AuthContext';
import { departments, towns } from '../../utils/colombia';
import CartItem from './CartItem';



const CartShop = () => {
    const { cart } = useCart();
    console.log(cart)
    const [isDelivery, setIsDelivery] = useState(true); 
    const costEnvio = 14000;
    const { user } = useContext(AuthContext);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [municipios, setMunicipios] = useState([]);
    useEffect(() => {
        if (selectedDepartment) {
            const municipiosDepartamento = towns.filter(
                (town) => town.department === selectedDepartment
            );
            setMunicipios(municipiosDepartamento);
        } else {
            setMunicipios([]);
        }
    }, [selectedDepartment]);

    const items = [];
    cart.items.forEach((item) => {
        const newItem = {
            title: item.name,
            unit_price: item.price,
            currency_id: "COP",
            quantity: item.quantity
        };
        items.push(newItem);
    });
    const handleShowitems = () => {
        console.log(items)
    }


    const handlePay = async () => {

        if (isDelivery) {
            items.push({
                title: "Envio",
                unit_price: costEnvio,
                currency_id: "COP",
                quantity: 1
            })
        }



        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`${API_PAYMENT}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items })
            })
            const data = await response.json()
            console.log(data.init_point)
            window.location.href = data.init_point
        }
        catch (error) {
            console.log(error.message)
        }
    }
    const handleDeliveryChange = () => {
        setIsDelivery(!isDelivery);
    };

    return (
        <body>
            <div className="py-3 bg-gray-100 pt-20">
                <h1 className="mb-10 text-center text-2xl font-bold">Lista de compras</h1>
                {cart.items.length === 0 ? (
                    <h1 className="text-center text-2xl font-bold">No hay productos en el carrito</h1>
                ) : null}
                <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                    <div className="rounded-lg md:w-2/3">
                        {cart.items.map((item) => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    {cart.items.length > 0 ? (
                        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                            <div className="mb-2 flex justify-between">
                                <p className="text-gray-700">Subtotal</p>
                                <p className="text-gray-700">{cart.total}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-700">Envio</p>
                                <p className="text-gray-700">{isDelivery ? costEnvio : '0'}</p>
                            </div>
                            <hr className="my-4" />
                            <div className="flex justify-between">
                                <p className="text-lg font-bold">Total</p>
                                <div className="">
                                    <p className="mb-1 text-lg font-bold">
                                        {isDelivery ? cart.total + costEnvio : cart.total} $COP
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-gray-700">Seleccionar método:</p>
                                <div className="flex items-center">
                                    <label className="mr-2">Envío</label>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="delivery"
                                        checked={isDelivery}
                                        onChange={handleDeliveryChange}
                                    />
                                    <label className="ml-2">Recoger en tienda</label>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="pickup"
                                        checked={!isDelivery}
                                        onChange={handleDeliveryChange}
                                    />
                                </div>
                            </div>
                            {isDelivery && (
                                <div>
                                    <p className='text-gray-700'>Selecciona un Departamento:</p>
                                    <select
                                        id="departamentoSelect"
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                                    >
                                        <option value="">Selecciona un departamento</option>
                                        {departments.map((department) => (
                                            <option key={department.code} value={department.code}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>

                                    {selectedDepartment && (
                                        <div>
                                            <p className="text-gray-700">Selecciona un Municipio:</p>
                                            <select id="municipioSelect" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'>

                                                <option value="">Selecciona un municipio</option>
                                                {municipios.map((municipio) => (
                                                    <option key={municipio.code} value={municipio.code}>
                                                        {municipio.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        className="mt-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Ingresa tu dirección"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handlePay}
                                className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                            >
                                Finalizar compra
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </body>
    );
};

export default CartShop;
