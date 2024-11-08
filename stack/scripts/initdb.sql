CREATE DATABASE IF NOT EXISTS concesionario;

USE concesionario;


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

INSERT INTO Vehiculo (ID_Vehiculo, Marca, Modelo, Anio, Precio, Combustible) VALUES
(1, 'Chevrolet', 'Sedan', 2004, 40679.89, 'Gasolina'),
(2, 'Toyota', 'Hatchback', 2005, 30269.74, 'Eléctrico'),
(3, 'Chevrolet', 'Coupe', 2023, 18915.95, 'Diesel'),
(4, 'Toyota', 'Coupe', 2000, 12770.17, 'Híbrido'),
(5, 'Toyota', 'Coupe', 2003, 15343.84, 'Diesel'),
(6, 'BMW', 'Sedan', 2017, 49996.86, 'Eléctrico'),
(7, 'Chevrolet', 'SUV', 2003, 21170.79, 'Híbrido'),
(8, 'Chevrolet', 'SUV', 2022, 21421.32, 'Híbrido'),
(9, 'Toyota', 'Coupe', 2001, 36687.32, 'Híbrido'),
(10, 'Toyota', 'Coupe', 2015, 45768.36, 'Diesel'),
(11, 'Toyota', 'SUV', 2011, 8726.65, 'Híbrido'),
(12, 'Ford', 'Truck', 2023, 17419.34, 'Gasolina'),
(13, 'Toyota', 'Hatchback', 2001, 12121.02, 'Gasolina'),
(14, 'Ford', 'Truck', 2006, 12688.86, 'Diesel'),
(15, 'BMW', 'Hatchback', 2008, 6853.59, 'Diesel');

INSERT INTO Cliente (ID_Cliente, Nombre, Telefono, Direccion) VALUES
(1, 'Juan Pérez', '123456789', 'Calle Falsa 123, Ciudad X'),
(2, 'Ana Gómez', '987654321', 'Avenida Siempre Viva 456, Ciudad Y'),
(3, 'Carlos Martínez', '555555555', 'Plaza Mayor 789, Ciudad Z'),
(4, 'Lucía Fernández', '666666666', 'Callejón del Sol 101, Ciudad W'),
(5, 'Pedro Rodríguez', '444444444', 'Camino Real 202, Ciudad X');

INSERT INTO Venta (ID_Venta, Fecha_Venta, Total, ID_Cliente, ID_Vehiculo) VALUES
(1, '2024-11-01', 50000.00, 1, 6),
(2, '2024-11-02', 30000.00, 2, 3),
(3, '2024-11-03', 45000.00, 3, 10),
(4, '2024-11-04', 40000.00, 4, 5),
(5, '2024-11-05', 20000.00, 5, 12);

INSERT INTO Compra (ID_Compra, Fecha_Compra, Precio_Compra, ID_Cliente, ID_Vehiculo) VALUES
(1, '2024-10-20', 45000.00, 1, 2),
(2, '2024-10-21', 50000.00, 2, 7),
(3, '2024-10-22', 60000.00, 3, 14),
(4, '2024-10-23', 35000.00, 4, 8),
(5, '2024-10-24', 25000.00, 5, 15);





