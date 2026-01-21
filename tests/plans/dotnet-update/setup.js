const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Remove Shared.Library and inline the Calculator.Add code into the service
 */
function removeLibraryAndInlineCode(fixturePath) {
  // Remove Shared.Library directory
  const libraryPath = path.join(fixturePath, 'Shared.Library');
  fs.rmSync(libraryPath, { recursive: true, force: true });

  // Update solution file to remove library reference
  const slnPath = path.join(fixturePath, 'DotnetCalculator.sln');
  let slnContent = fs.readFileSync(slnPath, 'utf8');
  slnContent = slnContent.replace(/Project.*Shared\.Library.*[\s\S]*?EndProject\s*/g, '');
  slnContent = slnContent.replace(/\{B2C3D4E5-F6A7-8901-BCDE-F12345678901\}.*\n/g, '');
  fs.writeFileSync(slnPath, slnContent);

  // Update Service.Api.csproj to remove library reference
  const csprojPath = path.join(fixturePath, 'Service.Api', 'Service.Api.csproj');
  let csprojContent = fs.readFileSync(csprojPath, 'utf8');
  csprojContent = csprojContent.replace(/<ItemGroup>[\s\S]*?<ProjectReference.*Shared\.Library.*[\s\S]*?<\/ItemGroup>/g, '');
  fs.writeFileSync(csprojPath, csprojContent);

  // Inline Calculator.Add into CalculateController
  const controllerPath = path.join(fixturePath, 'Service.Api', 'Controllers', 'CalculateController.cs');
  let controllerContent = fs.readFileSync(controllerPath, 'utf8');
  controllerContent = controllerContent.replace('using Shared.Library;\n', '');
  controllerContent = controllerContent.replace(
    'var result = Calculator.Add(request.Value1, request.Value2);',
    'var result = Add(request.Value1, request.Value2);',
  );

  // Add Add method to controller class (before closing brace)
  const addMethodCode = `
    /// <summary>
    /// Adds two integers (inlined from library)
    /// </summary>
    private static int Add(int a, int b)
    {
        return a + b;
    }
`;
  controllerContent = controllerContent.replace(/^}$/m, `${addMethodCode}\n}`);
  fs.writeFileSync(controllerPath, controllerContent);
}

/**
 * Add Multiply endpoint to the service
 */
function addMultiplyEndpoint(fixturePath) {
  const controllerPath = path.join(fixturePath, 'Service.Api', 'Controllers', 'CalculateController.cs');
  let controllerContent = fs.readFileSync(controllerPath, 'utf8');

  // Add Multiply endpoint before the Add method
  const multiplyEndpoint = `
    /// <summary>
    /// Multiplies two numbers together
    /// </summary>
    /// <param name="request">The values to multiply</param>
    /// <returns>The product of the two numbers</returns>
    [HttpPost("multiply")]
    public ActionResult<CalculateResponse> Multiply([FromBody] CalculateRequest request)
    {
        _logger.LogInformation("Multiplying {A} and {B}", request.Value1, request.Value2);

        var result = MultiplyValues(request.Value1, request.Value2);

        return Ok(new CalculateResponse { Result = result });
    }
`;

  // Add Multiply method
  const multiplyMethod = `
    /// <summary>
    /// Multiplies two integers
    /// </summary>
    private static int MultiplyValues(int a, int b)
    {
        return a * b;
    }
`;

  // Insert multiply endpoint after Add endpoint
  controllerContent = controllerContent.replace(
    /(public ActionResult<CalculateResponse> Add[\s\S]*?\n {4}\})/,
    `$1\n${multiplyEndpoint}`,
  );

  // Insert multiply method after Add method
  controllerContent = controllerContent.replace(
    /(private static int Add[\s\S]*?\n {4}\})/,
    `$1\n${multiplyMethod}`,
  );

  fs.writeFileSync(controllerPath, controllerContent);
}

/**
 * Add CLI project
 */
function addCliProject(fixturePath) {
  const cliPath = path.join(fixturePath, 'Service.Cli');
  fs.mkdirSync(cliPath, { recursive: true });

  // Create Service.Cli.csproj
  const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>
`;
  fs.writeFileSync(path.join(cliPath, 'Service.Cli.csproj'), csprojContent);

  // Create Program.cs
  const programContent = `using System.Text;
using System.Text.Json;

// Parse command-line arguments
if (args.Length < 3)
{
    Console.WriteLine("Usage: dotnet run <action> <value1> <value2>");
    Console.WriteLine("Actions: add, multiply");
    return 1;
}

string action = args[0].ToLower();
int value1 = int.Parse(args[1]);
int value2 = int.Parse(args[2]);

// Call the calculator service
using var client = new HttpClient();
client.BaseAddress = new Uri("https://localhost:5001");

var request = new { Value1 = value1, Value2 = value2 };
var json = JsonSerializer.Serialize(request);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync($"/calculate/{action}", content);
var resultJson = await response.Content.ReadAsStringAsync();
var result = JsonSerializer.Deserialize<JsonElement>(resultJson);

Console.WriteLine($"Result: {result.GetProperty("result").GetInt32()}");
return 0;
`;
  fs.writeFileSync(path.join(cliPath, 'Program.cs'), programContent);

  // Update solution file to add CLI project
  const slnPath = path.join(fixturePath, 'DotnetCalculator.sln');
  let slnContent = fs.readFileSync(slnPath, 'utf8');

  const cliProject = `Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "Service.Cli", "Service.Cli/Service.Cli.csproj", "{C3D4E5F6-A7B8-9012-CDEF-123456789012}"
EndProject
`;

  slnContent = slnContent.replace(
    /(Project.*Service\.Api.*EndProject\s*)/,
    `$1${cliProject}`,
  );

  const cliConfig = `		{C3D4E5F6-A7B8-9012-CDEF-123456789012}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{C3D4E5F6-A7B8-9012-CDEF-123456789012}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{C3D4E5F6-A7B8-9012-CDEF-123456789012}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{C3D4E5F6-A7B8-9012-CDEF-123456789012}.Release|Any CPU.Build.0 = Release|Any CPU
`;

  slnContent = slnContent.replace(
    /(GlobalSection\(ProjectConfigurationPlatforms\)[\s\S]*?)(\s*EndGlobalSection)/,
    `$1${cliConfig}$2`,
  );

  fs.writeFileSync(slnPath, slnContent);
}

/**
 * Apply modifications to the fixture to simulate code changes
 * This includes: removing library, inlining code, adding multiply endpoint, adding CLI
 */
function applyFixtureModifications(fixturePath) {
  // Commit 1: Remove library and inline code
  removeLibraryAndInlineCode(fixturePath);
  execSync('git add .', { cwd: fixturePath, stdio: 'ignore' });
  execSync('git commit -m "refactor: inline library code into service"', { cwd: fixturePath, stdio: 'ignore' });

  // Commit 2: Add multiply endpoint
  addMultiplyEndpoint(fixturePath);
  execSync('git add .', { cwd: fixturePath, stdio: 'ignore' });
  execSync('git commit -m "feat: add multiply endpoint"', { cwd: fixturePath, stdio: 'ignore' });

  // Commit 3: Add CLI project
  addCliProject(fixturePath);
  execSync('git add .', { cwd: fixturePath, stdio: 'ignore' });
  execSync('git commit -m "feat: add CLI client for calculator service"', { cwd: fixturePath, stdio: 'ignore' });
}

function afterGitSetup(fixturePath) {
  // Apply modifications to test incremental updates
  // This simulates: library removal, code inlining, new API, new CLI project
  applyFixtureModifications(fixturePath);
}

module.exports = {
  testCommand: 'update',
  afterGitSetup,
};
