
CREATE TABLE inventory_items(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(200) NOT NULL,
	stock INTEGER,
	precio DECIMAL(10,2),
	created_at TIMESTAMP
)