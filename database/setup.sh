#!/bin/bash

# Database Initialization Script for Linux
# Sistema de Denuncias

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}==================================${NC}"
echo -e "${CYAN}Inicializador de Base de Datos${NC}"
echo -e "${CYAN}Sistema de Denuncias${NC}"
echo -e "${CYAN}==================================${NC}"
echo ""

# Check for psql
if ! command -v psql &> /dev/null; then
    echo -e "${RED} Error: PostgreSQL (psql) no encontrado.${NC}"
    echo -e "${YELLOW}Por favor, instala PostgreSQL o asegúrate de que esté en tu PATH.${NC}"
    exit 1
fi

echo -e "${GREEN} PostgreSQL encontrado${NC}"

# Request password
echo -n "Ingresa la contraseña de PostgreSQL (usuario: postgres): "
read -s password
echo ""

export PGPASSWORD=$password

echo ""
echo -e "${YELLOW}Paso 1: Creando base de datos 'sistema_denuncias'...${NC}"

# Create database
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw sistema_denuncias; then
    echo -e "${GREEN} La base de datos ya existe${NC}"
else
    if psql -U postgres -c "CREATE DATABASE sistema_denuncias;" > /dev/null 2>&1; then
        echo -e "${GREEN} Base de datos creada exitosamente${NC}"
    else
        echo -e "${RED} Error al crear la base de datos.${NC}"
        # Try to show error (without leaking password effectively, though psql output usually doesn't show password)
        psql -U postgres -c "CREATE DATABASE sistema_denuncias;"
        exit 1
    fi
fi

echo ""
echo -e "${YELLOW}Paso 2: Inicializando schema y datos...${NC}"

# Run init script
# Assuming script is run from project root, so database/init.sql is correct
# If run from database dir, we might need to adjust.
# Let's check where the user likely runs it. Usually root.
# But just in case, let's find the absolute path to execute consistent
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INIT_SQL="$PROJECT_ROOT/database/init.sql"

if [ ! -f "$INIT_SQL" ]; then
    echo -e "${RED} Error: No se encontró $INIT_SQL${NC}"
    exit 1
fi

if psql -U postgres -d sistema_denuncias -f "$INIT_SQL" > /dev/null 2>&1; then
    echo -e "${GREEN} Schema y datos inicializados correctamente${NC}"
else
    echo -e "${RED} Error al inicializar la base de datos:${NC}"
    psql -U postgres -d sistema_denuncias -f "$INIT_SQL"
    exit 1
fi

echo ""
echo -e "${YELLOW}Paso 3: Verificando instalación...${NC}"

# Verify tables
table_count=$(psql -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d '[:space:]')
echo -e "${CYAN}   Tablas creadas: $table_count${NC}"

# Verify data
ciudadanos_count=$(psql -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM ciudadanos;" | tr -d '[:space:]')
denuncias_count=$(psql -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM denuncias;" | tr -d '[:space:]')
autoridades_count=$(psql -U postgres -d sistema_denuncias -t -c "SELECT COUNT(*) FROM autoridades;" | tr -d '[:space:]')

echo -e "${CYAN}   Ciudadanos: $ciudadanos_count${NC}"
echo -e "${CYAN}   Denuncias: $denuncias_count${NC}"
echo -e "${CYAN}   Autoridades: $autoridades_count${NC}"

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✅ ¡Base de datos lista!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo -e "1. Actualiza backend/.env con tu contraseña de PostgreSQL"
echo -e "2. Inicia el backend: cd backend && npm run dev"
echo -e "3. Verifica: http://localhost:4000/api/health"
echo ""

# Clear password
unset PGPASSWORD
