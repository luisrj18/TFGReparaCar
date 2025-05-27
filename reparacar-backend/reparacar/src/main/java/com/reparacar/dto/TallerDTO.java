package com.reparacar.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TallerDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String nombre;
    private String cif;
    private String email;
    private String telefono;
    private String direccion;
    private String codigoPostal;
    private String ciudad;
    private String provincia;
    private String password;
    private List<String> servicios;
   
}
