package com.reparacar.entity;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "clientes")
public class Cliente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "telefono")
    private String telefono;
    
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String direccion;

    @Column(name = "codigo_postal")
    private String codigoPostal;

    @Column(nullable = false)
    private String ciudad;
    
    @Column(nullable = false)
    private String provincia;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Citas> citas;

}