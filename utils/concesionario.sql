CREATE TABLE Vehiculo (
  ID_Vehiculo INT PRIMARY KEY,
  Marca VARCHAR(50),
  Modelo VARCHAR(50),
  Año INT,
  Precio DECIMAL(10, 2),
  Combustible VARCHAR(50)
);
INSERT INTO Vehiculo (ID_Vehiculo, Marca, Modelo, Año, Precio, Combustible) VALUES
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
CREATE TABLE Cliente (
  ID_Cliente INT PRIMARY KEY,
  Nombre VARCHAR(50),
  Telefono VARCHAR(20),
  Direccion VARCHAR(100)
);
INSERT INTO Cliente (ID_Cliente, Nombre, Telefono, Direccion) VALUES
(1, 'Ana', '555-8386', 'Calle 49 #963'),
(2, 'John', '555-9349', 'Calle 31 #503'),
(3, 'Carlos', '555-5291', 'Calle 45 #880'),
(4, 'John', '555-2304', 'Calle 10 #987'),
(5, 'Ana', '555-9803', 'Calle 34 #741'),
(6, 'María', '555-2693', 'Calle 22 #162'),
(7, 'Carlos', '555-7015', 'Calle 36 #114'),
(8, 'John', '555-5441', 'Calle 12 #212'),
(9, 'Luis', '555-7016', 'Calle 27 #841'),
(10, 'José', '555-6500', 'Calle 8 #757');
CREATE TABLE Venta (
  ID_Venta INT PRIMARY KEY,
  Fecha_Venta DATE,
  Total DECIMAL(10, 2)
);
INSERT INTO Venta (ID_Venta, Fecha_Venta, Total) VALUES
(1, 'DATE(40618)', 19958.86),
(2, 'DATE(40943)', 15532.75),
(3, 'DATE(39713)', 9883.78),
(4, 'DATE(37772)', 10695.88),
(5, 'DATE(42764)', 9786.14),
(6, 'DATE(41492)', 20369.7),
(7, 'DATE(33147)', 23385.75),
(8, 'DATE(42379)', 11231.9),
(9, 'DATE(43725)', 17253.66),
(10, 'DATE(42616)', 6873);
CREATE TABLE Compra (
  ID_Compra INT PRIMARY KEY,
  Fecha_Compra DATE,
  Precio_Compra DECIMAL(10, 2)
);
INSERT INTO Compra (ID_Compra, Fecha_Compra, Precio_Compra) VALUES
(1, 'DATE(38798)', 10379.51),
(2, 'DATE(41228)', 24973.73),
(3, 'DATE(43382)', 18383.9),
(4, 'DATE(40462)', 14616.17),
(5, 'DATE(42555)', 3799.42),
(6, 'DATE(41237)', 21712.08),
(7, 'DATE(38425)', 3506.2),
(8, 'DATE(35513)', 21111.77),
(9, 'DATE(39316)', 21415.04),
(10, 'DATE(43515)', 17169.74);
