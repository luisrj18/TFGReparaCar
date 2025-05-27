package com.reparacar.controller;

import com.reparacar.dto.CitasDTO;
import com.reparacar.service.CitasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/citas")
public class CitasController {

    private final CitasService citasService;

    @Autowired
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

    // Buscar citas por fecha (YYYY-MM-DD)
    @GetMapping("/buscar/fecha")
    public ResponseEntity<List<CitasDTO>> buscarPorFecha(@RequestParam String fecha) {
        LocalDate fechaParsed = LocalDate.parse(fecha);
        List<CitasDTO> citas = citasService.buscarCitasPorFecha(fechaParsed);
        return new ResponseEntity<>(citas, HttpStatus.OK);
    }
}
