import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AddReclamo = () => {
    const [empresa, setEmpresa] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const history = useHistory();


    const empresas = [
        { id: 1, nombre: 'Servidentrega' },
        { id: 2, nombre: 'InterRapidísimo' },
        { id: 3, nombre: 'Star Store' }
    ];

    
    const handleEmpresaChange = (event) => {
        setEmpresa(event.target.value);
    };

    
    const handleComentarioChange = (event) => {
        setComentario(event.target.value);
    };

   
    const handleSubmit = async (event) => {
        event.preventDefault();

        
        if (!empresa || !comentario) {
            setMensajeError('Todos los campos son obligatorios.');
            return;
        }

        const data = {
            empresa_id: empresa,
            comentario: comentario
        };

        try {
            
            const response = await axios.post('http://localhost:8000/api/Reclamo/crear', data);

            
            setMensajeExito('Reclamo registrado con éxito.');
            setMensajeError('');
            setTimeout(() => {
                history.push('/');  
            }, 2000);
        } catch (error) {
            
            setMensajeError('Hubo un error al registrar el reclamo. Intenta nuevamente.');
            setMensajeExito('');
        }
    };

    return (
        <div className="add-reclamo-container">
            <h2>Registrar un Reclamo</h2>

            {/* Mostrar mensaje de error si hay */}
            {mensajeError && <div className="error-message">{mensajeError}</div>}

            {/* Mostrar mensaje de éxito si el reclamo fue registrado */}
            {mensajeExito && <div className="success-message">{mensajeExito}</div>}

            <form onSubmit={handleSubmit}>
                {/* Selección de la empresa */}
                <div>
                    <label htmlFor="empresa">Seleccionar Empresa:</label>
                    <select
                        id="empresa"
                        value={empresa}
                        onChange={handleEmpresaChange}
                    >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.id} value={empresa.id}>
                                {empresa.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo de comentario */}
                <div>
                    <label htmlFor="comentario">Comentario:</label>
                    <textarea
                        id="comentario"
                        value={comentario}
                        onChange={handleComentarioChange}
                        placeholder="Escribe tu reclamo aquí..."
                    ></textarea>
                </div>

                {/* Botón de enviar */}
                <div>
                    <button type="submit">Agregar Reclamo</button>
                </div>
            </form>
        </div>
    );
};

export default AddReclamo;
