package com.reparacar.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.reparacar.ResourceNotFoundException;
import com.reparacar.dto.TallerDTO;
import com.reparacar.entity.Taller;
import com.reparacar.repository.TallerRepository;
import com.reparacar.service.TallerService;

@Service
public class TallerServiceImpl implements TallerService {

    private final TallerRepository tallerRepository;


    public TallerServiceImpl(TallerRepository tallerRepository) {
        this.tallerRepository = tallerRepository;
    }

    @Override
    public TallerDTO crearTaller(TallerDTO tallerDTO) {
        Taller taller = mapearAEntidad(tallerDTO);
        Taller guardado = tallerRepository.save(taller);
        return mapearADTO(guardado);
    }

    @Override
    public List<TallerDTO> obtenerTodosTalleres() {
        return tallerRepository.findAll()
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public TallerDTO obtenerTallerPorId(Long id) {
        Taller taller = tallerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Taller no encontrado con ID: " + id));
        return mapearADTO(taller);
    }

    @Override
    public TallerDTO actualizarTaller(Long id, TallerDTO tallerDTO) {
        Taller taller = tallerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Taller no encontrado con ID: " + id));

        // Actualizar los campos
        taller.setNombre(tallerDTO.getNombre());
        taller.setDireccion(tallerDTO.getDireccion());
        taller.setTelefono(tallerDTO.getTelefono());
        taller.setEmail(tallerDTO.getEmail());
       

        Taller actualizado = tallerRepository.save(taller);
        return mapearADTO(actualizado);
    }

    @Override
    public void eliminarTaller(Long id) {
        Taller taller = tallerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Taller no encontrado con ID: " + id));
        tallerRepository.delete(taller);
    }

    @Override
    public List<TallerDTO> buscarTalleresPorNombre(String nombre) {
        return tallerRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TallerDTO> buscarTalleresPorDireccion(String direccion) {
        return tallerRepository.findByDireccionContainingIgnoreCase(direccion)
                .stream()
                .map(this::mapearADTO)
                .collect(Collectors.toList());
    }



    // --- Métodos auxiliares de mapeo ---
    private TallerDTO mapearADTO(Taller taller) {
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

    private Taller mapearAEntidad(TallerDTO dto) {
        Taller taller = new Taller();
        taller.setId(dto.getId());
        taller.setNombre(dto.getNombre());
        taller.setCif(dto.getCif());
        taller.setEmail(dto.getEmail());
        taller.setTelefono(dto.getTelefono());
        taller.setDireccion(dto.getDireccion());
        taller.setCodigoPostal(dto.getCodigoPostal());
        taller.setCiudad(dto.getCiudad());
        taller.setProvincia(dto.getProvincia());
        taller.setPassword(dto.getPassword());        
        taller.setCitas(null);              
      
        return taller;
    }
}
