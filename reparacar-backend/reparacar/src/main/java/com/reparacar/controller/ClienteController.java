package com.reparacar.controller;

import com.reparacar.dto.ClienteDTO;
import com.reparacar.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {
    
    private final ClienteService clienteService; // Inyección del servicio que contiene la lógica de negocio
    
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    
    // Crear un nuevo cliente
    @PostMapping
    public ResponseEntity<ClienteDTO> crearCliente(@RequestBody ClienteDTO clienteDTO) {
        ClienteDTO nuevoCliente = clienteService.crearCliente(clienteDTO); // Llama al servicio para crear un cliente
        return new ResponseEntity<>(nuevoCliente, HttpStatus.CREATED);	   // Retorna el cliente creado	
    }
    
    // Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> obtenerTodosClientes() {
        List<ClienteDTO> clientes = clienteService.obtenerTodosClientes();
        return new ResponseEntity<>(clientes, HttpStatus.OK);
    }
    
    // Obtener un cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> obtenerClientePorId(@PathVariable Long id) {
        ClienteDTO cliente = clienteService.obtenerClientePorId(id);
        return new ResponseEntity<>(cliente, HttpStatus.OK);
    }
    
    // Actualizar un cliente existente
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizarCliente(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        ClienteDTO clienteActualizado = clienteService.actualizarCliente(id, clienteDTO);
        return new ResponseEntity<>(clienteActualizado, HttpStatus.OK);
    }
    
    // Eliminar un cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {
        clienteService.eliminarCliente(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
}