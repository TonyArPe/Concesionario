CREATE DATABASE IF NOT EXISTS Concesionario;

USE Concesionario;


-- Crear tabla Vehículo
CREATE TABLE Vehiculo (
    ID_Vehiculo INT PRIMARY KEY,
    Marca VARCHAR(50),
    Modelo VARCHAR(50),
    Anio INT,
    Precio DECIMAL(10, 2),
    Combustible VARCHAR(20)
);

-- Crear tabla Cliente
CREATE TABLE Cliente (
    ID_Cliente INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Telefono VARCHAR(20),
    Direccion VARCHAR(150)
);

-- Crear tabla Venta
CREATE TABLE Venta (
    ID_Venta INT PRIMARY KEY,
    Fecha_Venta DATE,
    Total DECIMAL(10, 2),
    ID_Cliente INT,
    ID_Vehiculo INT,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE SET NULL,
    FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo(ID_Vehiculo) ON DELETE SET NULL
);

-- Crear tabla Compra
CREATE TABLE Compra (
    ID_Compra INT PRIMARY KEY,
    Fecha_Compra DATE,
    Precio_Compra DECIMAL(10, 2),
    ID_Cliente INT,
    ID_Vehiculo INT,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente) ON DELETE SET NULL,
    FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo(ID_Vehiculo) ON DELETE SET NULL
);
