# syntax=docker/dockerfile:1

# Install all dependencies needed to compile the TypeScript application.
FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Keep the final image limited to production dependencies and compiled output.
FROM node:22-bookworm-slim AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

COPY --from=build /app/dist ./dist
# Certificate generation loads this SVG from the source path at runtime.
COPY --from=build /app/src/app/certificates ./src/app/certificates

# The application does not require root privileges to listen on port 5000.
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const http=require('http');const r=http.get('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/v1',x=>process.exit(x.statusCode===200?0:1));r.on('error',()=>process.exit(1));r.setTimeout(4000,()=>{r.destroy();process.exit(1)})"

CMD ["node", "dist/src/server.js"]
