package com.reparacar.service;

import java.util.List;
import java.util.Optional;

import com.reparacar.dto.ClienteDTO;
import com.reparacar.dto.LoginDTO;

public interface ClienteService {
    
    // Crear un nuevo cliente
    ClienteDTO crearCliente(ClienteDTO clienteDTO);
    
    // Obtener todos los clientes
    List<ClienteDTO> obtenerTodosClientes();
    
    // Obtener un cliente por ID
    ClienteDTO obtenerClientePorId(Long id);
    
    // Actualizar un cliente existente
    ClienteDTO actualizarCliente(Long id, ClienteDTO clienteDTO);
    
    // Eliminar un cliente
    void eliminarCliente(Long id);
    
    // Buscar clientes por nombre o apellidos
    List<ClienteDTO> buscarClientes(String nombre, String apellidos);
    
    Object login(LoginDTO login);
}