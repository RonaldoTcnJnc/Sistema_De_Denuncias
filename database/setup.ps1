# Script de Inicialización de Base de Datos
# Sistema de Denuncias

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Inicializador de Base de Datos" -ForegroundColor Cyan
Write-Host "Sistema de Denuncias" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Ruta a psql
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Verificar que psql existe
if (-not (Test-Path $psqlPath)) {
    Write-Host " Error: No se encontró PostgreSQL en $psqlPath" -ForegroundColor Red
    Write-Host "Por favor, actualiza la variable `$psqlPath en este script con la ruta correcta." -ForegroundColor Yellow
    exit 1
}

Write-Host " PostgreSQL encontrado" -ForegroundColor Green

# Solicitar contraseña
$password = Read-Host "Ingresa la contraseña de PostgreSQL (usuario: postgres)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Configurar variable de entorno
$env:PGPASSWORD = $plainPassword

Write-Host ""
Write-Host "Paso 1: Creando base de datos 'sistema_denuncias'..." -ForegroundColor Yellow

# Crear base de datos
$createDbResult = & $psqlPath -U postgres -c "CREATE DATABASE sistema_denuncias;" 2>&1

if ($LASTEXITCODE -eq 0 -or $createDbResult -like "*already exists*") {
    Write-Host " Base de datos creada o ya existe" -ForegroundColor Green
} else {
    Write-Host " Error al crear la base de datos:" -ForegroundColor Red
    Write-Host $createDbResult
    exit 1
}

Write-Host ""
Write-Host "Paso 2: Inicializando schema y datos..." -ForegroundColor Yellow

# Ejecutar script de inicialización
$initResult = & $psqlPath -U postgres -d sistema_denuncias -f "database\init.sql" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host " Schema y datos inicializados correctamente" -ForegroundColor Green
} else {
    Write-Host " Error al inicializar la base de datos:" -ForegroundColor Red
    Write-Host $initResult
    exit 1
}

Write-Host ""
Write-Host "Paso 3: Verificando instalación..." -ForegroundColor Yellow

# Verificar tablas
$tableCount = & $psqlPath -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>&1

Write-Host "   Tablas creadas: $($tableCount.Trim())" -ForegroundColor Cyan

# Verificar datos
$ciudadanosCount = & $psqlPath -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM ciudadanos;" 2>&1
$denunciasCount = & $psqlPath -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM denuncias;" 2>&1
$autoridadesCount = & $psqlPath -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM autoridades;" 2>&1

Write-Host "   Ciudadanos: $($ciudadanosCount.Trim())" -ForegroundColor Cyan
Write-Host "   Denuncias: $($denunciasCount.Trim())" -ForegroundColor Cyan
Write-Host "   Autoridades: $($autoridadesCount.Trim())" -ForegroundColor Cyan

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ ¡Base de datos lista!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Actualiza backend\.env con tu contraseña de PostgreSQL" -ForegroundColor White
Write-Host "2. Inicia el backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Verifica: http://localhost:4000/api/health" -ForegroundColor White
Write-Host ""

# Limpiar contraseña de memoria
$env:PGPASSWORD = ""
