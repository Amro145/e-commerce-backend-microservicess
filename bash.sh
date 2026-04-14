#!/bin/bash

# Create .gitignore file in all services and add node_modules and package-lock.json to it

SERVICES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GITIGNORE_CONTENT="node_modules/
package-lock.json
"

for service in "$SERVICES_DIR"/*/; do
  if [ -d "$service" ]; then
    gitignore_path="$service.gitignore"
    echo "$GITIGNORE_CONTENT" > "$gitignore_path"
    echo "✅ Created .gitignore in: $(basename "$service")"
  fi
done

echo ""
echo "🎉 Done! .gitignore files created in all services."
