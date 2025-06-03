package com.reparacar.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.reparacar.ResourceNotFoundException;
import com.reparacar.dto.ClienteDTO;
import com.reparacar.dto.LoginDTO;
import com.reparacar.dto.TallerDTO;
import com.reparacar.entity.Cliente;
import com.reparacar.entity.Taller;
import com.reparacar.repository.ClienteRepository;
import com.reparacar.repository.TallerRepository;
import com.reparacar.service.ClienteService;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final TallerRepository tallerRepository;

    // Constructor para inyección de dependencias
    public ClienteServiceImpl(ClienteRepository clienteRepository,TallerRepository tallerRepository) {
        this.clienteRepository = clienteRepository;
		this.tallerRepository = tallerRepository;
    }

    @Override
    public ClienteDTO crearCliente(ClienteDTO clienteDTO) {
        Cliente cliente = mapearAEntidad(clienteDTO); // Convertimos el DTO a entidad
        Cliente clienteGuardado = clienteRepository.save(cliente); // Guardamos en la BD
        return mapearADTO(clienteGuardado); // Devolvemos el DTO del cliente creado
    }

    @Override
    public List<ClienteDTO> obtenerTodosClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes.stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClienteDTO obtenerClientePorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return mapearADTO(cliente);
    }

    @Override
    public ClienteDTO actualizarCliente(Long id, ClienteDTO clienteDTO) {
        // Verificar si existe el cliente
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        
        // Se actualizan los campos permitidos
        cliente.setNombre(clienteDTO.getNombre());
        cliente.setApellidos(clienteDTO.getApellidos());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setDireccion(clienteDTO.getDireccion());
        cliente.setCodigoPostal(clienteDTO.getCodigoPostal());
        cliente.setCiudad(clienteDTO.getCiudad());
        
        Cliente clienteActualizado = clienteRepository.save(cliente); // Guardamos los cambios
        return mapearADTO(clienteActualizado);  // Devolvemos el DTO actualizado
    }

    @Override
    public void eliminarCliente(Long id) {
        // Verificar si existe el cliente
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        
        clienteRepository.delete(cliente);
    }

    @Override
    public List<ClienteDTO> buscarClientes(String nombre, String apellidos) {
        List<Cliente> clientes;
        
        if (nombre != null && apellidos != null) {
            clientes = clienteRepository.findByNombreContainingAndApellidosContaining(nombre, apellidos);
        } else if (nombre != null) {
            clientes = clienteRepository.findByNombreContaining(nombre);
        } else if (apellidos != null) {
            clientes = clienteRepository.findByApellidosContaining(apellidos);
        } else {
            clientes = clienteRepository.findAll();
        }
        
        return clientes.stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }
    
    // Login de cliente o taller
    public Object login(LoginDTO login) {
        Optional<Cliente> cliente = clienteRepository.findByEmailAndPassword(login.getEmail(), login.getPassword());
        if (cliente.isPresent()) {
            return mapearADTO(cliente.get());
        }

        Optional<Taller> taller = tallerRepository.findByEmailAndPassword(login.getEmail(), login.getPassword());
        if (taller.isPresent()) {
            return mapearADTOTaller(taller.get());
        }

        throw new RuntimeException("Credenciales inválidas");
    }
    
    // Conversión de Cliente → ClienteDTO
    private ClienteDTO mapearADTO(Cliente cliente) {
        ClienteDTO clienteDTO = new ClienteDTO();
        clienteDTO.setId(cliente.getId());
        clienteDTO.setNombre(cliente.getNombre());
        clienteDTO.setApellidos(cliente.getApellidos());
        clienteDTO.setEmail(cliente.getEmail());
        clienteDTO.setTelefono(cliente.getTelefono());
        clienteDTO.setDireccion(cliente.getDireccion());
        clienteDTO.setCodigoPostal(cliente.getCodigoPostal());
        clienteDTO.setCiudad(cliente.getCiudad());
        clienteDTO.setProvincia(cliente.getProvincia());
        clienteDTO.setPassword(cliente.getPassword());
        return clienteDTO;
    }
    
    // Conversión de ClienteDTO → Cliente
    private Cliente mapearAEntidad(ClienteDTO clienteDTO) {
        Cliente cliente = new Cliente();
        cliente.setNombre(clienteDTO.getNombre());
        cliente.setApellidos(clienteDTO.getApellidos());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setDireccion(clienteDTO.getDireccion());
        cliente.setCodigoPostal(clienteDTO.getCodigoPostal());
        cliente.setCiudad(clienteDTO.getCiudad());
        cliente.setPassword(clienteDTO.getPassword());
        cliente.setProvincia(clienteDTO.getProvincia());
        return cliente;
    }
    
    // Convierte un Taller a TallerDTO (usado en login)
    public TallerDTO mapearADTOTaller(Taller taller) {
        TallerDTO dto = new TallerDTO();
        dto.setId(taller.getId());
        dto.setNombre(taller.getNombre());
        dto.setCif(taller.getCif());
        dto.setEmail(taller.getEmail());
        dto.setTelefono(taller.getTelefono());
        dto.setDireccion(taller.getDireccion());
        dto.setCodigoPostal(taller.getCodigoPostal());
        dto.setCiudad(taller.getCiudad());
        dto.setProvincia(taller.getProvincia());
        dto.setPassword(taller.getPassword());
        return dto;
    }   

}