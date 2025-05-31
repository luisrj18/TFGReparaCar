package com.reparacar.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.reparacar.ResourceNotFoundException;
import com.reparacar.dto.CitasDTO;
import com.reparacar.entity.Citas;
import com.reparacar.entity.Cliente;
import com.reparacar.entity.Taller;
import com.reparacar.repository.CitasRepository;
import com.reparacar.repository.ClienteRepository;
import com.reparacar.repository.TallerRepository;
import com.reparacar.service.CitasService;

@Service
public class CitasServiceImpl implements CitasService {

    private final CitasRepository citasRepository;
    private final ClienteRepository clienteRepository;
    private final TallerRepository tallerRepository;

    public CitasServiceImpl(CitasRepository citasRepository, ClienteRepository clienteRepository,TallerRepository tallerRepository) {
    	this.citasRepository = citasRepository;
    	this.clienteRepository = clienteRepository;
    	this.tallerRepository = tallerRepository;
    }

    @Override
    public CitasDTO crearCita(CitasDTO citaDTO) {
        Citas cita = mapearAEntidad(citaDTO);
        Citas citaGuardada = citasRepository.save(cita);
        return mapearADTO(citaGuardada);
    }

    @Override
    public List<CitasDTO> obtenerTodasCitas() {
        return citasRepository.findAll()
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public CitasDTO obtenerCitaPorId(Long id) {
        Citas cita = citasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        return mapearADTO(cita);
    }

    @Override
    public CitasDTO actualizarCita(Long id, CitasDTO citaDTO) {
        Citas cita = citasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));

        cita.setNombre(citaDTO.getNombre());
        cita.setModeloVehiculo(citaDTO.getModeloVehiculo());
        cita.setMatricula(citaDTO.getMatricula());
        cita.setFecha(citaDTO.getFecha());
        cita.setHora(citaDTO.getHora());
        cita.setServicio(citaDTO.getServicio());
        cita.setDescripcion(citaDTO.getDescripcion());
        cita.setEstado(citaDTO.getEstado());
        
        if (citaDTO.getCliente_id() != null) {
            Cliente cliente = clienteRepository.findById(citaDTO.getCliente_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + citaDTO.getCliente_id()));
            cita.setCliente(cliente);
        }

        if (citaDTO.getTaller_id() != null) {
            Taller taller = tallerRepository.findById(citaDTO.getTaller_id())
                    .orElseThrow(() -> new ResourceNotFoundException("Taller no encontrado con ID: " + citaDTO.getTaller_id()));
            cita.setTaller(taller);
        }

        Citas citaActualizada = citasRepository.save(cita);
        return mapearADTO(citaActualizada);
    }

    @Override
    public void eliminarCita(Long id) {
        Citas cita = citasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada con ID: " + id));
        citasRepository.delete(cita);
    }

    @Override
    public List<CitasDTO> buscarCitasPorNombre(String nombre) {
        return citasRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitasDTO> buscarCitasPorEstado(String estado) {
        return citasRepository.findByEstadoContainingIgnoreCase(estado)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitasDTO> buscarCitasPorFecha(LocalDate fecha) {
        return citasRepository.findByFecha(fecha)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CitasDTO> buscarCitasPorMatricula(String matricula) {
        return citasRepository.findByMatriculaContainingIgnoreCase(matricula)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CitasDTO> buscarCitasPorTallerId(Long tallerId) {
        List<Citas> citas = citasRepository.findByTallerId(tallerId);
        return citas.stream().map(this::mapearADTO).toList();
    }


    // Métodos auxiliares de mapeo
    private CitasDTO mapearADTO(Citas cita) {
        CitasDTO dto = new CitasDTO();
        dto.setNombre(cita.getNombre());
        dto.setModeloVehiculo(cita.getModeloVehiculo());
        dto.setMatricula(cita.getMatricula());
        dto.setFecha(cita.getFecha());
        dto.setHora(cita.getHora());
        dto.setServicio(cita.getServicio());
        dto.setDescripcion(cita.getDescripcion());
        dto.setEstado(cita.getEstado());
        
        if (cita.getCliente() != null) {
            dto.setCliente_id(cita.getCliente().getId());
        }
        if (cita.getTaller() != null) {
            dto.setTaller_id(cita.getTaller().getId());
        }
        
        return dto;
    }

    private Citas mapearAEntidad(CitasDTO dto) {
        Citas cita = new Citas();
        
        cita.setNombre(dto.getNombre());
        cita.setModeloVehiculo(dto.getModeloVehiculo());
        cita.setMatricula(dto.getMatricula());
        cita.setFecha(dto.getFecha());
        cita.setHora(dto.getHora());
        cita.setServicio(dto.getServicio());
        cita.setDescripcion(dto.getDescripcion());
        cita.setEstado(dto.getEstado());
        
        Cliente cliente = clienteRepository.findById(dto.getCliente_id())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + dto.getCliente_id()));
        cita.setCliente(cliente);

        Taller taller = tallerRepository.findById(dto.getTaller_id())
                .orElseThrow(() -> new ResourceNotFoundException("Taller no encontrado con ID: " + dto.getTaller_id()));
        cita.setTaller(taller);
        
        return cita;
    }
}

