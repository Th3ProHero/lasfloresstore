#!/bin/bash
# ─────────────────────────────────────────────────────────────
# deploy.sh — Las Flores Store · Deploy seguro sin perder datos
# Uso:  ./deploy.sh
# ─────────────────────────────────────────────────────────────
set -e

echo ""
echo "🌸  Las Flores Store — Deploy Seguro"
echo "───────────────────────────────────────"

# 1. Bajar servicios SIN borrar volúmenes (no -v)
echo "⏳  Deteniendo contenedores actuales..."
sudo docker compose down

# 2. Obtener últimos cambios del repositorio
echo "📥  Actualizando código fuente..."
git pull

# 3. Reconstruir imágenes solo si cambiaron (--no-recreate no aplica aquí, pero --build sí detecta cambios en Dockerfile)
echo "🔨  Reconstruyendo imágenes..."
sudo docker compose build --pull

# 4. Levantar servicios (la BD conserva sus datos porque pgdata sobrevive)
echo "🚀  Levantando servicios..."
sudo docker compose up -d

echo ""
echo "✅  Deploy completo. Servicios activos:"
sudo docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📋  Logs en tiempo real (Ctrl+C para salir):"
sudo docker compose logs -f --tail=50
