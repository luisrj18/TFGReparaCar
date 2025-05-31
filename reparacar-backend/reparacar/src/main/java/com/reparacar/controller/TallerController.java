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
import org.springframework.web.bind.annotation.RestController;

import com.reparacar.dto.TallerDTO;
import com.reparacar.service.TallerService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/talleres")
public class TallerController {

    private final TallerService tallerService;

   
    public TallerController(TallerService tallerService) {
        this.tallerService = tallerService;
    }

    // Crear un nuevo taller
    @PostMapping
    public ResponseEntity<TallerDTO> crearTaller(@RequestBody TallerDTO tallerDTO) {
        TallerDTO nuevoTaller = tallerService.crearTaller(tallerDTO);
        return new ResponseEntity<>(nuevoTaller, HttpStatus.CREATED);
    }

    // Obtener todos los talleres
    @GetMapping
    public ResponseEntity<List<TallerDTO>> obtenerTodosTalleres() {
        List<TallerDTO> talleres = tallerService.obtenerTodosTalleres();
        return new ResponseEntity<>(talleres, HttpStatus.OK);
    }

    // Obtener un taller por ID
    @GetMapping("/{id}")
    public ResponseEntity<TallerDTO> obtenerTallerPorId(@PathVariable Long id) {
        TallerDTO taller = tallerService.obtenerTallerPorId(id);
        return new ResponseEntity<>(taller, HttpStatus.OK);
    }

    // Actualizar un taller existente
    @PutMapping("/{id}")
    public ResponseEntity<TallerDTO> actualizarTaller(@PathVariable Long id, @RequestBody TallerDTO tallerDTO) {
        TallerDTO tallerActualizado = tallerService.actualizarTaller(id, tallerDTO);
        return new ResponseEntity<>(tallerActualizado, HttpStatus.OK);
    }

    // Eliminar un taller
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTaller(@PathVariable Long id) {
        tallerService.eliminarTaller(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
