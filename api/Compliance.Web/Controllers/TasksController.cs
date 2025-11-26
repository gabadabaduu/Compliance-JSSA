using Microsoft.AspNetCore.Mvc;
using Npgsql;

namespace Compliance.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly string _connectionString;

        public TasksController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection") ?? "";
        }

        // GET: api/Tasks
        [HttpGet]
        public IActionResult GetTasks()
        {
            var tasks = new List<object>();

            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            using var cmd = new NpgsqlCommand("SELECT * FROM \"Tasks\" ORDER BY \"Id\"", conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                tasks.Add(new
                {
                    id = reader.GetInt32(0),
                    title = reader.GetString(1),
                    isCompleted = reader.GetBoolean(2),
                    createdAt = reader.GetDateTime(3)
                });
            }

            return Ok(tasks);
        }

        // POST: api/Tasks
        [HttpPost]
        public IActionResult CreateTask([FromBody] CreateTaskRequest request)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            using var cmd = new NpgsqlCommand(
                "INSERT INTO \"Tasks\" (\"Title\", \"IsCompleted\") VALUES (@title, @completed) RETURNING \"Id\"", 
                conn);
            
            cmd.Parameters.AddWithValue("title", request.Title);
            cmd.Parameters.AddWithValue("completed", request.IsCompleted);

            var id = (int)(cmd.ExecuteScalar() ?? 0);

            return Ok(new { message = "Tarea creada", id, title = request.Title });
        }

        // PUT: api/Tasks/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] UpdateTaskRequest request)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            using var cmd = new NpgsqlCommand(
                "UPDATE \"Tasks\" SET \"IsCompleted\" = @completed WHERE \"Id\" = @id", 
                conn);
            
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("completed", request.IsCompleted);

            cmd.ExecuteNonQuery();

            return Ok(new { message = "Tarea actualizada", id });
        }

        // DELETE: api/Tasks/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            using var conn = new NpgsqlConnection(_connectionString);
            conn.Open();

            using var cmd = new NpgsqlCommand("DELETE FROM \"Tasks\" WHERE \"Id\" = @id", conn);
            cmd.Parameters.AddWithValue("id", id);

            cmd.ExecuteNonQuery();

            return Ok(new { message = "Tarea eliminada", id });
        }
    }

    public class CreateTaskRequest
    {
        public string Title { get; set; } = string.Empty;
        public bool IsCompleted { get; set; } = false;
    }

    public class UpdateTaskRequest
    {
        public bool IsCompleted { get; set; }
    }
}