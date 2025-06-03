package com.reparacar.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reparacar.dto.CitasDTO;
import com.reparacar.service.CitasService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/citas")
public class CitasController {

    private final CitasService citasService;


    public CitasController(CitasService citasService) {
        this.citasService = citasService;
    }

    // Crear una nueva cita
    @PostMapping
    public ResponseEntity<CitasDTO> crearCita(@RequestBody CitasDTO citasDTO) {
        CitasDTO nuevaCita = citasService.crearCita(citasDTO);
        return new ResponseEntity<>(nuevaCita, HttpStatus.CREATED);
    }

    // Obtener todas las citas
    @GetMapping
    public ResponseEntity<List<CitasDTO>> obtenerTodasCitas() {
        List<CitasDTO> citas = citasService.obtenerTodasCitas();
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Obtener una cita por ID
    @GetMapping("/{id}")
    public ResponseEntity<CitasDTO> obtenerCitaPorId(@PathVariable Long id) {
        CitasDTO cita = citasService.obtenerCitaPorId(id);
        return new ResponseEntity<>(cita, HttpStatus.OK);
    }

    // Actualizar una cita
    @PutMapping("/{id}")
    public ResponseEntity<CitasDTO> actualizarCita(@PathVariable Long id, @RequestBody CitasDTO citasDTO) {
        CitasDTO citaActualizada = citasService.actualizarCita(id, citasDTO);
        return new ResponseEntity<>(citaActualizada, HttpStatus.OK);
    }

    // Eliminar una cita
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCita(@PathVariable Long id) {
        citasService.eliminarCita(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Buscar citas por nombre
    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<CitasDTO>> buscarPorNombre(@RequestParam String nombre) {
        List<CitasDTO> citas = citasService.buscarCitasPorNombre(nombre);
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Buscar citas por estado
    @GetMapping("/buscar/estado")
    public ResponseEntity<List<CitasDTO>> buscarPorEstado(@RequestParam String estado) {
        List<CitasDTO> citas = citasService.buscarCitasPorEstado(estado);
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }

    // Buscar citas por matrícula
    @GetMapping("/buscar/matricula")
    public ResponseEntity<List<CitasDTO>> buscarPorMatricula(@RequestParam String matricula) {
        List<CitasDTO> citas = citasService.buscarCitasPorMatricula(matricula);
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }
    
    //Buscar Citas por taller_id
    @GetMapping("/buscar/taller")
    public ResponseEntity<List<CitasDTO>> buscarPorTallerId(@RequestParam Long tallerId) {
        List<CitasDTO> citas = citasService.buscarCitasPorTallerId(tallerId);
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }
    
  //Buscar Citas por cliente_id
    @GetMapping("/buscar/cliente")
    public ResponseEntity<List<CitasDTO>> buscarPorClienteId(@RequestParam Long clienteId) {
        List<CitasDTO> citas = citasService.buscarCitasPorClienteId(clienteId);
        return new ResponseEntity<>(citas, HttpStatus.OK);
        
    }  

}
