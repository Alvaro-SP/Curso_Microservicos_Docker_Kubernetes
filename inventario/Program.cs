using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

var builder = WebApplication.CreateBuilder(args);

// CONFIGURACION DE BASE DE DATOS
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? "Host=postgres;Port=5432;Database=inventario_db;Username=postgres;Password=postgres123";

Console.WriteLine($"Conectando a DB: {connectionString}");

builder.Services.AddDbContext<InventarioDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// CONFIGURACION DE CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// INICIALIZAR LA BASE DE DATOS Y CREAR TABLAS
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventarioDbContext>();
    Console.WriteLine("Se esta iniciando la base de datos...");
    // aca se crean las tablas
    try
    {
        db.Database.EnsureCreated();
        // insertar datos de prueba a inventarios
        if (!db.Items.Any())
        {
            db.Items.AddRange(
                new InventoryItem { Nombre = "Producto A", Stock = 100, Precio = 9.99M },
                new InventoryItem { Nombre = "Producto B", Stock = 50, Precio = 19.99M },
                new InventoryItem { Nombre = "Producto C", Stock = 200, Precio = 4.99M },
                new InventoryItem { Nombre = "Producto D", Stock = 75, Precio = 14.99M },
                new InventoryItem { Nombre = "Producto E", Stock = 150, Precio = 7.49M },
                new InventoryItem { Nombre = "Producto F", Stock = 30, Precio = 29.99M }
            );
            db.SaveChanges();
            Console.WriteLine("Datos de prueba han sido insertados en la base de datos.");
        }else
        {
            Console.WriteLine("La base de datos ya contiene datos, no se insertaron datos de prueba.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al iniciar la base de datos: {ex.Message}");
    }
}

app.UseCors();

// ******************************************
// ***********  ENDPOINTS  ******************
// ******************************************

app.MapGet("/health", () => Results.Ok(new { status = "ok"}));

// GET /inventario = listar todas las filas de mi db
app.MapGet("/inventario", async (InventarioDbContext db) =>
{
    var items = await db.Items.ToListAsync(); //  SELECT * FROM inventory_items
    return Results.Ok(new {
        mensaje = "Se han obtenido los items de inventario correctamente.",
        data = items
    });
});

// obtener todos los items de inventario
app.MapGet("/api/inventario", async (InventarioDbContext db) =>
{
    var items = await db.Items.ToListAsync(); //  SELECT * FROM inventory_items
    return Results.Ok(new {
        mensaje = "Se han obtenido los items de inventario correctamente.",
        data = items
    });
});

// obtener un item especifico dado un ID
app.MapGet("/inventario/{id:int}", async (int id, InventarioDbContext db) =>
{
    var item = await db.Items.FindAsync(id); // SELECT * FROM inventory_items WHERE id = {id}
    return item is null
        ? Results.NotFound(new {mensaje = $"El item de inventario con id {id} no fue encontrado."})
        : Results.Ok(item);
});

// reservar item de inventario (disminuir stock)
app.MapPost("/inventario/reservar", async (HttpContext ctx, InventarioDbContext db) =>
{
    var body = await ctx.Request.ReadFromJsonAsync<ReservaDto>();
    if(body is null || body.Id <= 0)
        return Results.BadRequest(new { mensaje = "Payload invalido. Por favor enviar un id y cantidad validos."});

    var item = await db.Items.FindAsync(body.Id);
    if (item is null)
        return Results.NotFound(new { mensaje = $"El item de inventario con id {body.Id} no fue encontrado."});

    // validar si hay en stock
    var cantidad = body.Cantidad ?? 1;
    if(item.Stock < cantidad)
        return Results.BadRequest(new { mensaje = $"No hay suficiente stock para el item {item.Nombre}. Stock actual: {item.Stock}"});

    item.Stock -= cantidad;
    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        mensaje = $"Se ha reservado {cantidad} unidad(es) del producto {item.Nombre}. Stock restante: {item.Stock}",
        data = item
    });
});
// reabastecer item de inventario (aumentar stock)
// crear un nuevo item de inventario


Console.WriteLine("SERVICIO DE INVENTARIO HA SIDO INICIADO");
Console.WriteLine($"Escuchando en el puerto 5002...{builder.Configuration["ASPNETCORE_URLS"]}");
app.Run();



// ******************************************
//* MODELO DE DATOS
// ******************************************

[Table("inventory_items")]
public class InventoryItem
{
    [Key]
    public int Id { get; set;}

    [Required]
    [MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    public int Stock { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Precio { get; set; }

    public DateTime CreatedAt { get; set;  } = DateTime.UtcNow;
}

public record ReservaDto(int Id, int? Cantidad);

// DBCONTEXT = contexto para manejar consultas a la base de datos
public class InventarioDbContext : DbContext
{
    public InventarioDbContext(DbContextOptions<InventarioDbContext> options)
        : base(options)
    {}
    public DbSet<InventoryItem> Items { get; set;} //la tabla de "inventory_items"

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.HasIndex(e => e.Nombre);
        });
    }
}






